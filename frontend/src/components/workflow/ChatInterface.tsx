import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

import { Button } from '../common/Button';
import { WorkflowVisualization } from './WorkflowVisualization';
import { CredentialsGuide } from './CredentialsGuide';
import { N8NExport } from './N8NExport';
import type {
  GeneratedWorkflow,
  GeminiWorkflowRequest,
  WorkflowBlueprint,
} from '../../types/workflow.types';
import { generateWorkflow as requestWorkflow } from '../../features/workflow/workflowAPI';
import { toGeneratedWorkflow } from '../../utils/workflowMapper';

const AI_THINKING_STEPS = [
  'Thinking...',
  'Parsing your idea...',
  'Structuring workflow logic...',
  'Creating nodes and edges...',
  'Finalizing your workflow...',
];

const CURATED_BLUEPRINT: WorkflowBlueprint = {
  id: 'curated-support-playbook',
  title: 'Unified Support Ops: Zendesk + Dynamics 365 + Salesforce',
  description:
    'Ingest customer issues from every CRM, normalize the payload, summarize context with Gemini, and route prioritized alerts to Slack.',
  steps: [
    {
      id: 'node-1',
      name: 'Zendesk Ticket Trigger',
      type: 'n8n-nodes-base.zendesk',
      parameters: {
        operation: 'newTicket',
        subdomain: 'your-team',
      },
      position: { x: 120, y: 180 },
    },
    {
      id: 'node-2',
      name: 'Dynamics 365 Case Listener',
      type: 'n8n-nodes-base.microsoftDynamicsCrm',
      parameters: {
        operation: 'getAll',
        entity: 'incidents',
      },
      position: { x: 120, y: 340 },
    },
    {
      id: 'node-3',
      name: 'Salesforce Case Watcher',
      type: 'n8n-nodes-base.salesforce',
      parameters: {
        operation: 'getAll',
        sobject: 'Case',
      },
      position: { x: 120, y: 500 },
    },
    {
      id: 'node-4',
      name: 'Normalize & Merge Cases',
      type: 'n8n-nodes-base.function',
      parameters: {
        functionCode:
          '// merge payloads from Zendesk, Dynamics 365, and Salesforce\nreturn items.map(item => ({ json: {\n  source: item.json.source || $json.source,\n  customer: item.json.customer || $json.customer,\n  subject: item.json.subject,\n  description: item.json.description,\n  priority: item.json.priority || "medium",\n}}));',
      },
      position: { x: 380, y: 340 },
    },
    {
      id: 'node-5',
      name: 'Gemini Case Summaries',
      type: 'n8n-nodes-base.code',
      parameters: {
        jsCode: '// call Gemini 2.0 Flash API to summarize each case\n// return { summary, priorityTag }',
      },
      position: { x: 640, y: 340 },
    },
    {
      id: 'node-6',
      name: 'Slack Escalation Router',
      type: 'n8n-nodes-base.slack',
      parameters: {
        channel: '#support-escalations',
        text: 'Unified case alert with AI summary attached',
      },
      position: { x: 900, y: 340 },
    },
  ],
  edges: [
    { id: 'edge-1', source: 'node-1', target: 'node-4' },
    { id: 'edge-2', source: 'node-2', target: 'node-4' },
    { id: 'edge-3', source: 'node-3', target: 'node-4' },
    { id: 'edge-4', source: 'node-4', target: 'node-5' },
    { id: 'edge-5', source: 'node-5', target: 'node-6' },
  ],
  credentials: [
    'Zendesk API Key',
    'Microsoft Dynamics 365 OAuth',
    'Salesforce Connected App',
    'Slack Bot Token',
    'Gemini API Key',
  ],
  estimatedTimeSavedMinutes: 120,
};

const CURATED_WORKFLOW: GeneratedWorkflow = {
  name: CURATED_BLUEPRINT.title,
  description: CURATED_BLUEPRINT.description,
  nodes: CURATED_BLUEPRINT.steps.map((step) => ({
    id: step.id,
    name: step.name,
    type: step.type,
    parameters: step.parameters,
    position: step.position ?? { x: 120, y: 180 },
  })),
  edges: CURATED_BLUEPRINT.edges.map((edge) => ({ ...edge })),
  connections: {
    'Zendesk Ticket Trigger': {
      main: [[{ node: 'Normalize & Merge Cases', type: 'main', index: 0 }]],
    },
    'Dynamics 365 Case Listener': {
      main: [[{ node: 'Normalize & Merge Cases', type: 'main', index: 0 }]],
    },
    'Salesforce Case Watcher': {
      main: [[{ node: 'Normalize & Merge Cases', type: 'main', index: 0 }]],
    },
    'Normalize & Merge Cases': {
      main: [[{ node: 'Gemini Case Summaries', type: 'main', index: 0 }]],
    },
    'Gemini Case Summaries': {
      main: [[{ node: 'Slack Escalation Router', type: 'main', index: 0 }]],
    },
  },
  steps: [
    {
      stepNumber: 1,
      title: 'Monitor Zendesk tickets',
      description: 'Capture every newly created Zendesk ticket with metadata including customer tier and SLA.',
      nodeId: 'node-1',
      learningTip: 'Automating the trigger eliminates manual inbox refresh cycles.',
    },
    {
      stepNumber: 2,
      title: 'Watch Dynamics 365 incidents',
      description: 'Poll the Dynamics 365 service module for fresh incidents that match your escalation filters.',
      nodeId: 'node-2',
      learningTip: 'Unifies field service issues alongside ticket queues for a single response view.',
    },
    {
      stepNumber: 3,
      title: 'Fetch Salesforce cases',
      description: 'Listen for new Salesforce Service Cloud cases so revenue-critical alerts are never missed.',
      nodeId: 'node-3',
      learningTip: 'Supports matrix teams working across multiple CRMs.',
    },
    {
      stepNumber: 4,
      title: 'Normalize and merge context',
      description: 'Standardize payloads and deduplicate when the same customer appears in multiple systems.',
      nodeId: 'node-4',
      learningTip: 'Gives downstream AI consistent fields to reason about priority and intent.',
    },
    {
      stepNumber: 5,
      title: 'Summarize and route alerts',
      description: 'Gemini grades severity, attaches a short summary, and posts the bundle to Slack.',
      nodeId: 'node-5',
      learningTip: 'Automates triage so agents focus on resolution rather than sorting queues.',
    },
  ],
  credentials: [
    {
      name: 'Zendesk API Key',
      reason: 'Needed to read new tickets and SLA data.',
    },
    {
      name: 'Microsoft Dynamics 365 OAuth',
      reason: 'Required to access incidents and service module metadata.',
    },
    {
      name: 'Salesforce Connected App',
      reason: 'Used to fetch new cases from Service Cloud.',
    },
    {
      name: 'Slack Bot Token',
      reason: 'Needed to post AI summaries into your escalation channel.',
    },
    {
      name: 'Gemini API Key',
      reason: 'Used to summarize customer context and enrich alerts with AI.',
    },
  ],
  estimatedTimeSavedMinutes: CURATED_BLUEPRINT.estimatedTimeSavedMinutes,
};

type ChatMessage = {
  id: string;
  role: 'assistant' | 'user';
  content: string;
};

interface ChatInterfaceProps {
  onExit?: () => void;
}

export const ChatInterface = ({ onExit }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! Let’s turn your idea into an intelligent workflow.',
    },
  ]);
  const [userPrompt, setUserPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const thinkingIntervalRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [workflow, setWorkflow] = useState<GeneratedWorkflow | null>(null);
  const [blueprint, setBlueprint] = useState<WorkflowBlueprint | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    if (!isGenerating) {
      if (thinkingIntervalRef.current) {
        window.clearInterval(thinkingIntervalRef.current);
        thinkingIntervalRef.current = null;
      }
      setThinkingStep(0);
      return;
    }

    setThinkingStep(1);
    let currentIndex = 1;
    const intervalId = window.setInterval(() => {
      currentIndex = Math.min(currentIndex + 1, AI_THINKING_STEPS.length);
      setThinkingStep(currentIndex);
      if (currentIndex === AI_THINKING_STEPS.length) {
        window.clearInterval(intervalId);
        thinkingIntervalRef.current = null;
      }
    }, 800);

    thinkingIntervalRef.current = intervalId;

    return () => {
      window.clearInterval(intervalId);
      thinkingIntervalRef.current = null;
    };
  }, [isGenerating]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userPrompt.trim() || isGenerating) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userPrompt.trim(),
    };

    const pendingMessages = [...messages, userMessage];
    setMessages(pendingMessages);
    setUserPrompt('');
    setIsGenerating(true);
    setWorkflow(null);
    setBlueprint(null);
    setErrorMessage(null);
    setThinkingStep(1);

    const payload: GeminiWorkflowRequest = {
      messages: pendingMessages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
      })),
    };

    try {
      const generatedBlueprint = await requestWorkflow(payload);
      const generatedWorkflow = toGeneratedWorkflow(generatedBlueprint);

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `Here is your workflow plan: ${generatedBlueprint.title}.`,
        },
      ]);

      setWorkflow(generatedWorkflow);
      setBlueprint(generatedBlueprint);
      setThinkingStep(AI_THINKING_STEPS.length);
    } catch (error) {
      console.error('Workflow generation failed', error);
      let failureReason = 'service unavailable';

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
          failureReason = 'the AI request took longer than expected and timed out.';
        } else if (typeof error.response?.data === 'string' && error.response.data.trim().length > 0) {
          failureReason = error.response.data.trim();
        } else if (error.response?.data && typeof error.response.data.detail === 'string') {
          failureReason = error.response.data.detail;
        } else if (error.message) {
          failureReason = error.message;
        }
      } else if (error instanceof Error) {
        failureReason = error.message;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content:
            'I hit a snag with the AI service, so I loaded a curated Zendesk-to-Slack playbook you can explore right away.',
        },
      ]);

      setWorkflow(CURATED_WORKFLOW);
      setBlueprint(CURATED_BLUEPRINT);
      setThinkingStep(AI_THINKING_STEPS.length);
      const politeReason = failureReason.replace(/\.$/, '');
      setErrorMessage(
        `AI service could not complete the request (${politeReason}). We loaded a curated playbook so you can keep exploring—try again in a moment!`,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(event.target.value);
  };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-darkest text-neutral-gray100">
      <header className="flex items-center justify-between border-b border-neutral-gray800 px-6 py-4">
        <div className="flex items-center gap-3">
          {onExit ? (
            <button
              type="button"
              onClick={onExit}
              aria-label="Go back"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-gray800 text-neutral-gray300 transition hover:border-primary-yellow/60 hover:text-primary-yellow"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : null}
          <span className="text-lg font-semibold tracking-wide text-primary-yellow">FlowForge</span>
        </div>
        <span className="text-sm text-neutral-gray500">Powered by Gemini 2.0 Flash</span>
      </header>

      <main className="relative flex flex-1 overflow-hidden">
        <div className="relative flex flex-1 flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, translateY: 12 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  className={`rounded-2xl border px-6 py-5 text-base leading-relaxed shadow-card transition ${
                    message.role === 'assistant'
                      ? 'border-neutral-gray800 bg-neutral-dark/80 text-neutral-gray100'
                      : 'border-primary-yellow/60 bg-primary-yellow/10 text-primary-yellow'
                  }`}
                >
                  {message.content}
                </motion.div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-gray800 px-6 py-5">
            <form onSubmit={handleSubmit} className="mx-auto flex max-w-3xl flex-col gap-4">
              <textarea
                value={userPrompt}
                onChange={handleInputChange}
                placeholder="Describe the workflow you want to build..."
                rows={4}
                className="w-full resize-none rounded-2xl border border-neutral-gray800 bg-neutral-dark/80 px-5 py-4 text-base text-neutral-gray100 shadow-card focus:border-primary-yellow focus:outline-none focus:ring-0"
                disabled={isGenerating}
              />
              <div className="flex items-center justify-between gap-3">
                {errorMessage ? (
                  <span className="text-sm text-primary-yellow/80">{errorMessage}</span>
                ) : (
                  <span className="text-sm text-neutral-gray500">
                    Gemini will translate your prompt into an actionable workflow blueprint.
                  </span>
                )}
                <Button type="submit" variant="primary" size="lg" disabled={isGenerating}>
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span>Generating</span>
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      <span>Generate workflow</span>
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <aside className="hidden w-[420px] flex-shrink-0 border-l border-neutral-gray800 bg-neutral-dark px-6 py-8 xl:block">
          <div className="flex h-full flex-col overflow-y-auto">
            <ResultsPanel workflow={workflow} blueprint={blueprint} />
          </div>
        </aside>

        <ThinkingOverlay activeCount={thinkingStep} isVisible={isGenerating} />
      </main>

      <section className="border-t border-neutral-gray800 px-6 py-8 xl:hidden">
        <ResultsPanel workflow={workflow} blueprint={blueprint} />
      </section>
    </div>
  );
};

const ResultsPanel = ({
  workflow,
  blueprint,
}: {
  workflow: GeneratedWorkflow | null;
  blueprint: WorkflowBlueprint | null;
}) => {
  if (!workflow) {
    return (
      <div className="rounded-2xl border border-neutral-gray800 bg-neutral-dark/70 p-6 text-center text-sm text-neutral-gray500">
        Workflow previews, credential checklists, and the n8n export will appear here once generation completes.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <WorkflowVisualization workflow={workflow} />
      <CredentialsGuide credentials={workflow.credentials} />
      <N8NExport workflow={workflow} blueprint={blueprint} />
    </div>
  );
};

const ThinkingOverlay = ({ activeCount, isVisible }: { activeCount: number; isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="relative flex flex-col items-center gap-4">
          <Bubbles />
          <div className="relative flex flex-col items-center gap-3">
            {AI_THINKING_STEPS.slice(0, activeCount).map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.8, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 120, delay: index * 0.05 }}
                className="relative overflow-visible rounded-full bg-neutral-darkest/60 px-6 py-3 text-center text-base font-medium text-primary-yellow shadow-card"
              >
                <span className="water-drop-ripple" aria-hidden="true" />
                {step}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);

const Bubbles = () => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 6 }).map((_, index) => (
      <span key={index} className={`floating-bubble bubble-${index + 1}`} />
    ))}
  </div>
);
