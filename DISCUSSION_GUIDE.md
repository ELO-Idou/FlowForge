# How to "Discuss" Workflows with Your n8n Expert (Gemini)

## 🎭 Who is "Alex"?

Your AI assistant is now **Alex**, a senior n8n workflow expert with:
- 5+ years building production n8n workflows
- Deep knowledge of 100+ n8n nodes and their exact versions
- Expertise in JavaScript, API integrations, and workflow patterns
- Real-world experience with customer support, CRM, marketing automation

## 💬 How to Have a "Discussion"

### **Conversational Approach**

Instead of technical specifications, talk to Alex like a colleague:

**❌ Bad (Too Technical):**
```
Create a workflow with webhook trigger, code node for parsing, switch for routing
```

**✅ Good (Conversational):**
```
Hey Alex, I need to automate our Nuki customer support. 
When a ticket comes in via Zendesk webhook, I want to:
1. Read the customer's issue
2. Figure out if it's about batteries, motors, or Bluetooth
3. Send them the right troubleshooting guide automatically

Can you build that?
```

### **Multi-Turn Conversations**

You can refine workflows through back-and-forth:

```json
{
  "messages": [
    {
      "id": "1",
      "role": "user",
      "content": "Create a Nuki support workflow that categorizes issues"
    },
    {
      "id": "2", 
      "role": "assistant",
      "content": "{...workflow JSON...}"
    },
    {
      "id": "3",
      "role": "user", 
      "content": "Great! Now add a Slack notification for urgent cases where urgency > 8"
    }
  ]
}
```

## 🗣️ Discussion Examples

### Example 1: Customer Support Automation

**User:**
> "We get 100 Nuki smart lock support tickets daily. Most are about dead batteries, 
> Bluetooth pairing, or motor issues. I want to auto-respond with guides. The ticket 
> comes from Freshdesk webhook with {subject, description, email}. Can you help?"

**Alex will:**
- Create a webhook trigger with POST endpoint
- Add JavaScript to analyze the description for keywords
- Build routing logic for battery/bluetooth/motor categories
- Include detailed response templates with emojis and step-by-step instructions
- Add email sending via HTTP Request to SendGrid
- Log everything to a database

### Example 2: Enhancement Request

**User:**
> "The workflow you made is great! But can you also check the customer's urgency? 
> If they say 'locked out' or 'emergency', I want to send it to our Slack #urgent 
> channel immediately instead of auto-responding."

**Alex will:**
- Modify the JavaScript to detect urgency keywords
- Calculate an urgency score (1-10)
- Add a Switch node to check score >= 8
- Route urgent cases to HTTP Request → Slack webhook
- Keep normal flow for low urgency

### Example 3: API Integration

**User:**
> "I want to pull customer data from HubSpot CRM before responding. Use their email 
> to get their subscription tier (free/pro/enterprise) and personalize the response."

**Alex will:**
- Add HTTP Request node to HubSpot API
- Configure Bearer authentication with API key
- Build query params with email filter
- Extract subscription_tier from response
- Modify response templates to include tier-specific info

## 📋 What Alex Knows (From n8n Docs)

Alex has been trained on n8n documentation including:

### **Node Types**
- **Triggers**: Webhook, Manual Trigger, Schedule, Email IMAP, HTTP Trigger
- **Data Processing**: Code, Set, Filter, Merge, Split, Sort, Aggregate
- **Logic**: Switch, If, Wait, Loop Over Items
- **Actions**: HTTP Request, Send Email, Slack, Zendesk, Database (Postgres, MongoDB)
- **AI**: OpenAI, Anthropic, Google Gemini integration nodes

### **Best Practices**
- Proper error handling with try/catch in Code nodes
- Credential management (never hardcoded API keys)
- Workflow execution order (sequential vs parallel)
- Data item linking between nodes
- Expression syntax with `={{$json.field}}`
- Pagination handling for large datasets

### **Common Patterns**
- **Customer Support**: Webhook → Parse → Categorize → Route → Respond → Log
- **Data Sync**: Schedule → Fetch → Transform → Upsert → Notify
- **Monitoring**: Trigger → Check → Filter → Alert → Escalate
- **Lead Qualification**: Form → Enrich → Score → Route → CRM Update

## 🎯 Tips for Best Results

### 1. **Be Specific About Your Tools**
```
"We use Zendesk for tickets, SendGrid for emails, and Postgres for logging"
```
Alex will configure exact API endpoints and parameters.

### 2. **Describe the Data**
```
"The webhook sends: {ticket_id, customer_email, subject, description, priority}"
```
Alex will structure the workflow around your actual data.

### 3. **Mention Edge Cases**
```
"Sometimes the description is empty. In that case, just use the subject line."
```
Alex will add error handling and fallback logic.

### 4. **Reference Real Examples**
```
"Like the nuki-troubleshooter-fixed.json workflow, but for WiFi routers instead"
```
Alex will maintain the same quality and structure.

### 5. **Ask for Explanations**
```
"Can you explain how the switch node routing works in this workflow?"
```
Alex can break down complex logic (though responses are JSON-only during generation).

## 🚀 Testing Your Discussion

Try these prompts in the FlowForge UI (http://localhost:3000):

### **Simple Start**
```
"Create a workflow that sends me a Slack message every morning at 9am with my tasks"
```

### **Moderate Complexity**
```
"Build a lead scoring system: when HubSpot webhook sends a new contact, calculate a 
score based on company size (>100 employees = 10 points), industry (tech = 20 points), 
and job title (C-level = 30 points). If score > 40, assign to sales rep Sarah."
```

### **Advanced**
```
"Create a multi-channel customer service router:
1. Zendesk webhook with ticket data
2. Check if customer exists in Salesforce (API call)
3. If VIP customer (subscription > $10k/year), route to priority queue in Slack
4. Otherwise, use GPT-4 to generate auto-response draft
5. If confidence < 80%, send to human agent for review
6. Log all decisions to Postgres with timestamps"
```

## 📊 How Alex Improves Over Generic Prompts

| Aspect | Generic AI | Alex (n8n Expert) |
|--------|-----------|-------------------|
| Node types | Generic "code" | Exact `n8n-nodes-base.code` v2 |
| JavaScript | Pseudocode | Full executable code with error handling |
| Switch logic | Simple if/else | Proper rules.values array with conditions |
| HTTP requests | URL only | Full headers, auth, body, pagination |
| Credentials | Hardcoded keys | Proper credential references |
| Versions | Missing | Exact typeVersion for compatibility |
| Production-ready | ❌ Needs editing | ✅ Deploy immediately |

## 🎓 Learning Path

Start simple, then add complexity:

1. **Week 1**: Single-trigger, single-action workflows
   - "Send Slack message when webhook receives data"

2. **Week 2**: Add data transformation
   - "Parse JSON webhook, extract name/email, format for Slack"

3. **Week 3**: Introduce routing
   - "Route high-value leads to sales, low-value to marketing"

4. **Week 4**: Multiple APIs and error handling
   - "Fetch from CRM, enrich with AI, update database, notify team"

## 🔗 Resources

- **Your Fixed Workflow**: `nuki-troubleshooter-fixed.json` (reference example)
- **n8n Docs**: https://docs.n8n.io/integrations/builtin/core-nodes/
- **Test Endpoint**: http://localhost:8000/chat/generate-workflow
- **Frontend**: http://localhost:3000

---

**Ready to discuss your first workflow with Alex?** 🚀

Just describe what you want to automate in plain English, and Alex will build it!
