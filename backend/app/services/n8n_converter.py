"""Convert workflow blueprints into n8n payloads.

- LLM-safe parameter normalization
- Node registry validation & aliasing
- Credential auto-mapping hints
- Target-index-aware connections
- Layered auto-layout (tree), with grid fallback
- Safe workflow settings for n8n 1.118+
"""

from __future__ import annotations

from collections import defaultdict, deque
from collections.abc import Iterable
from typing import Any, Dict, List, Optional, Set, Tuple

from ..schemas.workflow import WorkflowBlueprint

# --------------------------- layout constants ------------------------------

_BASE_X = 200
_BASE_Y = 240
_X_GAP = 320
_Y_GAP = 200
_GRID_COLS = 3


def _derive_grid_position(index: int) -> list[int]:
    col = index % _GRID_COLS
    row = index // _GRID_COLS
    return [_BASE_X + col * _X_GAP, _BASE_Y + row * _Y_GAP]


# --------------------------- known nodes -----------------------------------

NODE_REGISTRY: dict[str, dict[str, Any]] = {
    "n8n-nodes-base.cron": {"typeVersion": 1, "needs_credentials": False},
    "n8n-nodes-base.webhook": {"typeVersion": 1, "needs_credentials": False},
    "n8n-nodes-base.if": {"typeVersion": 2, "needs_credentials": False},
    "n8n-nodes-base.merge": {"typeVersion": 2, "needs_credentials": False},
    "n8n-nodes-base.code": {"typeVersion": 2, "needs_credentials": False},
    "n8n-nodes-base.switch": {"typeVersion": 3, "needs_credentials": False},
    "n8n-nodes-base.wait": {"typeVersion": 1, "needs_credentials": False},
    "n8n-nodes-base.httpRequest": {
        "typeVersion": 4,
        "needs_credentials": False,
    },
    "n8n-nodes-base.hubspot": {"typeVersion": 2, "needs_credentials": True},
    "n8n-nodes-base.slack": {"typeVersion": 2, "needs_credentials": True},
    "n8n-nodes-base.googleSheets": {
        "typeVersion": 4,
        "needs_credentials": True,
    },
    "n8n-nodes-base.emailSend": {"typeVersion": 2, "needs_credentials": True},
    "n8n-nodes-base.zendesk": {"typeVersion": 1, "needs_credentials": True},
    "n8n-nodes-base.stripe": {"typeVersion": 2, "needs_credentials": True},
    "n8n-nodes-base.twilio": {"typeVersion": 2, "needs_credentials": True},
    "n8n-nodes-base.openAi": {"typeVersion": 4, "needs_credentials": True},
}

TYPE_ALIASES = {
    "n8n-nodes-base.switch": "n8n-nodes-base.if",
}

PARAM_COLLECTION_KEYS = {
    "headerParameters",
    "queryParameters",
    "bodyParameters",
    "formDataParameters",
    "headerParametersUi",
    "queryParametersUi",
    "bodyParametersUi",
    "formDataParametersUi",
}


# --------------------------- parameter cleaning ----------------------------

def _sanitize_property_values(value: Any) -> list[dict[str, Any]] | None:
    if isinstance(value, list):
        cleaned: list[dict[str, Any]] = []
        for item in value:
            if isinstance(item, dict):
                cleaned.append(_sanitize_parameters(item))
        return cleaned
    if isinstance(value, dict):
        return [_sanitize_parameters(value)]
    return None


def _coerce_to_parameters_dict(obj: Any) -> Optional[dict[str, Any]]:
    if obj is None:
        return None
    if isinstance(obj, dict):
        if "parameters" in obj and isinstance(obj["parameters"], list):
            return {"parameters": obj["parameters"]}
        if "values" in obj and isinstance(obj["values"], list):
            return {"parameters": obj["values"]}
        return obj
    if isinstance(obj, list):
        return {"parameters": obj}
    return None


def _coerce_parameter_list(value: Any) -> list[dict[str, Any]] | None:
    if isinstance(value, list):
        return [item for item in value if isinstance(item, dict)]
    if isinstance(value, dict):
        return [value]
    return None


def _sanitize_parameters(data: Any, parent_key: str | None = None) -> Any:
    if isinstance(data, dict):
        sanitized: dict[str, Any] = {}
        for key, value in data.items():
            if value is None:
                continue

            new_key = (
                "options"
                if key == "option" and "options" not in data
                else key
            )

            if new_key in PARAM_COLLECTION_KEYS:
                coerced = _coerce_to_parameters_dict(value)
                if coerced:
                    sanitized[new_key] = coerced
                continue

            sanitized_value = _sanitize_parameters(value, new_key)

            if new_key == "propertyValues":
                coerced_list = _sanitize_property_values(sanitized_value)
                if coerced_list is None:
                    continue
                sanitized[new_key] = coerced_list
                continue

            if key == "values" and parent_key in PARAM_COLLECTION_KEYS:
                coerced_params = _coerce_parameter_list(sanitized_value)
                if coerced_params is None:
                    continue
                sanitized["parameters"] = coerced_params
                continue

            sanitized[new_key] = sanitized_value
        return sanitized

    if isinstance(data, list):
        return [
            _sanitize_parameters(item, parent_key)
            for item in data
            if item is not None
        ]

    return data


def _normalize_parameters(
    node_type: str,
    parameters: dict[str, Any],
) -> dict[str, Any]:
    cleaned = _sanitize_parameters(parameters, None)

    if node_type == "n8n-nodes-base.wait" and isinstance(cleaned, dict):
        if "waitTill" not in cleaned and "unit" in cleaned:
            amount = (
                cleaned.get("amount")
                or cleaned.get("waitFor")
                or cleaned.get("value")
                or cleaned.get("duration")
                or 1
            )
            cleaned.update({"waitTill": "timeInterval", "amount": int(amount)})

    # If node: coerce LLM-shaped conditions into n8n expected schema
    if node_type == "n8n-nodes-base.if" and isinstance(cleaned, dict):
        conds = cleaned.get("conditions")
        if isinstance(conds, dict) and "conditions" in conds:
            items = conds.get("conditions")
            combinator = conds.get("combinator") or "and"
            string_rules: list[dict[str, Any]] = []
            number_rules: list[dict[str, Any]] = []
            boolean_rules: list[dict[str, Any]] = []

            if isinstance(items, list):
                for rule in items:
                    if not isinstance(rule, dict):
                        continue
                    left = rule.get("leftValue")
                    right = rule.get("rightValue")
                    operator = rule.get("operator") or {}
                    op_type = (operator.get("type") or "string").lower()
                    op = operator.get("operation") or "equals"

                    # Map generic ops to n8n terms
                    op_map = {
                        "gt": "larger",
                        "gte": "largerEqual",
                        "lt": "smaller",
                        "lte": "smallerEqual",
                        "eq": "equals",
                        "neq": "notEqual",
                    }
                    op = op_map.get(op, op)

                    # Ensure expressions are wrapped
                    def _expr(val: Any) -> Any:
                        has_braces = (
                            isinstance(val, str)
                            and "{{" in val
                            and "}}" in val
                        )
                        if has_braces:
                            inner = (
                                val.replace("{{", "")
                                .replace("}}", "")
                                .strip()
                            )
                            return f"={{{{{ {inner} }}}}}"
                        return val

                    value1 = _expr(left)
                    value2 = _expr(right)

                    rule_obj = {
                        "value1": value1,
                        "operation": op,
                        "value2": value2,
                    }

                    if op_type == "number":
                        number_rules.append(rule_obj)
                    elif op_type == "boolean":
                        boolean_rules.append(rule_obj)
                    else:
                        string_rules.append(rule_obj)

            normalized: dict[str, Any] = {}
            if string_rules:
                normalized["string"] = string_rules
            if number_rules:
                normalized["number"] = number_rules
            if boolean_rules:
                normalized["boolean"] = boolean_rules

            if normalized:
                cleaned["conditions"] = normalized
                # Prefer 'any' for OR, 'all' for AND
                cleaned["combineOperation"] = (
                    "any" if combinator == "or" else "all"
                )
                # Remove unknown helper fields
                if "options" in conds:
                    conds.pop("options", None)

    return cleaned


# --------------------------- credentials hints -----------------------------

def _needs_credentials(node_type: str) -> bool:
    meta = NODE_REGISTRY.get(node_type) or {}
    return bool(meta.get("needs_credentials"))


def _infer_credentials_placeholder(node_type: str) -> dict[str, Any]:
    if not _needs_credentials(node_type):
        return {}
    return {}


# --------------------------- node building ---------------------------------

def _coerce_type_and_version(
    node_type: str,
    type_version: Any,
) -> tuple[str, int]:
    canonical_type = TYPE_ALIASES.get(node_type, node_type)
    default_ver = NODE_REGISTRY.get(canonical_type, {}).get("typeVersion", 1)
    try:
        version = (
            int(type_version)
            if type_version is not None
            else int(default_ver)
        )
    except (TypeError, ValueError):
        version = int(default_ver)
    return canonical_type, version


def _coerce_position(pos: object) -> Optional[list[int]]:
    if isinstance(pos, dict):
        x, y = pos.get("x"), pos.get("y")
        if isinstance(x, (int, float)) and isinstance(y, (int, float)):
            return [int(x), int(y)]
    elif isinstance(pos, (list, tuple)) and len(pos) == 2:
        a, b = pos
        if isinstance(a, (int, float)) and isinstance(b, (int, float)):
            return [int(a), int(b)]
    return None


def _build_nodes(
    blueprint: WorkflowBlueprint,
) -> tuple[list[dict[str, Any]], dict[str, str], dict[str, dict[str, Any]]]:
    nodes: list[dict[str, Any]] = []
    node_lookup: dict[str, str] = {}
    id_to_node: dict[str, dict[str, Any]] = {}

    for index, step in enumerate(blueprint.steps):
        node_type, type_version = _coerce_type_and_version(
            step.type,
            step.type_version,
        )

        raw_parameters = dict(step.parameters or {})
        parameters = _normalize_parameters(node_type, raw_parameters)

        if step.js_code and "code" in node_type.lower():
            parameters["jsCode"] = step.js_code

        if node_type == "n8n-nodes-base.if" and isinstance(parameters, dict):
            parameters.setdefault("alwaysOutputData", True)

        if isinstance(step.credentials, dict):
            credentials = step.credentials
        else:
            credentials = _infer_credentials_placeholder(node_type)

        position = _coerce_position(step.position)

        node_payload: dict[str, Any] = {
            "id": step.id,
            "name": step.name,
            "type": node_type,
            "typeVersion": type_version,
            "position": position or _derive_grid_position(index),
            "parameters": parameters,
            "credentials": credentials,
        }

        optional_fields = {
            "retryOnFail": step.retry_on_fail,
            "maxTries": step.max_tries,
            "waitBetweenTries": step.wait_between_tries,
            "alwaysOutputData": step.always_output_data,
            "continueOnFail": step.continue_on_fail,
            "notes": step.notes,
            "notesInFlow": step.notes_in_flow,
            "disabled": step.disabled,
        }
        for key, value in optional_fields.items():
            if value is not None:
                node_payload[key] = value

        nodes.append(node_payload)
        node_lookup[step.id] = step.name
        id_to_node[step.id] = node_payload

    return nodes, node_lookup, id_to_node


# --------------------------- connections -----------------------------------

def _build_connections(
    edges: Iterable,
    node_lookup: dict[str, str],
) -> dict[str, dict[str, list[list[dict[str, Any]]]]]:
    connections: dict[str, dict[str, list[list[dict[str, Any]]]]] = {}

    for edge in edges:
        src_name = node_lookup.get(edge.source)
        tgt_name = node_lookup.get(edge.target)
        if not src_name or not tgt_name:
            continue

        conn_type = edge.connection_type or "main"
        src_out = int(edge.source_output_index or 0)
        tgt_in = int(edge.target_input_index or 0)

        src_map = connections.setdefault(src_name, {})
        type_matrix = src_map.setdefault(conn_type, [])

        while len(type_matrix) <= src_out:
            type_matrix.append([])

        type_matrix[src_out].append(
            {
                "node": tgt_name,
                "type": conn_type,
                "index": tgt_in,
            }
        )

    return connections


# --------------------------- auto layout -----------------------------------

def _auto_layout(
    edges: Iterable,
    id_to_node: Dict[str, dict],
) -> None:
    incoming: Dict[str, int] = defaultdict(int)
    graph: Dict[str, List[str]] = defaultdict(list)
    for edge in edges:
        if edge.source in id_to_node and edge.target in id_to_node:
            graph[edge.source].append(edge.target)
            incoming[edge.target] += 1
            incoming.setdefault(edge.source, incoming.get(edge.source, 0))

    def is_source(node_id: str) -> bool:
        node = id_to_node[node_id]
        node_type = node["type"]
        return incoming.get(node_id, 0) == 0 or node_type in {
            "n8n-nodes-base.cron",
            "n8n-nodes-base.webhook",
        }

    ids = list(id_to_node.keys())
    sources = [node_id for node_id in ids if is_source(node_id)]
    visited: Set[str] = set()
    layers: List[List[str]] = []

    queue: deque[Tuple[str, int]] = deque()
    for src in sources:
        queue.append((src, 0))
        visited.add(src)
    while queue:
        node_id, layer = queue.popleft()
        if len(layers) <= layer:
            layers.append([])
        if node_id not in layers[layer]:
            layers[layer].append(node_id)
        for nxt in graph.get(node_id, []):
            if nxt not in visited:
                visited.add(nxt)
                queue.append((nxt, layer + 1))

    for node_id in ids:
        if node_id not in visited:
            if not layers:
                layers = [[node_id]]
            else:
                layers[-1].append(node_id)

    for layer_index, layer_ids in enumerate(layers):
        for row_index, node_id in enumerate(layer_ids):
            node = id_to_node[node_id]
            if not node.get("position"):
                node["position"] = [
                    _BASE_X + layer_index * _X_GAP,
                    _BASE_Y + row_index * _Y_GAP,
                ]


# Payload builder helpers

def to_n8n_payload(blueprint: WorkflowBlueprint) -> dict[str, Any]:
    nodes, node_lookup, id_to_node = _build_nodes(blueprint)
    _auto_layout(blueprint.edges, id_to_node)
    connections = _build_connections(blueprint.edges, node_lookup)

    settings = getattr(blueprint, "settings", None) or {
        # n8n expects a boolean here; default to True for visibility
        "saveExecutionProgress": True,
        "saveManualExecutions": True,
        "executionTimeout": -1,
    }

    return {
        "name": blueprint.title,
        "nodes": nodes,
        "connections": connections,
        "settings": settings,
    }
