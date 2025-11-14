import { useMemo } from 'react';

interface PlatformStat {
  id: string;
  label: string;
  newCases: number;
  automationCoverage: number;
  slaBreaches: number;
  averageHandleTimeMinutes: number;
}

interface InsightItem {
  title: string;
  description: string;
  action: string;
}

const PROGRESS_WIDTH_CLASSES: Record<number, string> = {
  0: 'automation-progress-0',
  5: 'automation-progress-5',
  10: 'automation-progress-10',
  15: 'automation-progress-15',
  20: 'automation-progress-20',
  25: 'automation-progress-25',
  30: 'automation-progress-30',
  35: 'automation-progress-35',
  40: 'automation-progress-40',
  45: 'automation-progress-45',
  50: 'automation-progress-50',
  55: 'automation-progress-55',
  60: 'automation-progress-60',
  65: 'automation-progress-65',
  70: 'automation-progress-70',
  75: 'automation-progress-75',
  80: 'automation-progress-80',
  85: 'automation-progress-85',
  90: 'automation-progress-90',
  95: 'automation-progress-95',
  100: 'automation-progress-100',
};

const toProgressClass = (value: number): string => {
  const rounded = Math.min(100, Math.max(0, Math.round(value / 5) * 5));
  return PROGRESS_WIDTH_CLASSES[rounded] ?? PROGRESS_WIDTH_CLASSES[0];
};

export const AnalyticsDashboard = () => {
  const platformStats: PlatformStat[] = useMemo(
    () => [
      {
        id: 'zendesk',
        label: 'Zendesk',
        newCases: 128,
        automationCoverage: 76,
        slaBreaches: 2,
        averageHandleTimeMinutes: 18,
      },
      {
        id: 'dynamics',
        label: 'Microsoft Dynamics 365',
        newCases: 64,
        automationCoverage: 52,
        slaBreaches: 5,
        averageHandleTimeMinutes: 26,
      },
      {
        id: 'salesforce',
        label: 'Salesforce Service Cloud',
        newCases: 91,
        automationCoverage: 68,
        slaBreaches: 1,
        averageHandleTimeMinutes: 14,
      },
    ],
    [],
  );

  const insightItems: InsightItem[] = useMemo(
    () => [
      {
        title: 'Boost Dynamics 365 automation',
        description:
          'Only 52% of Dynamics incidents route through AI helpers. Add owner assignment and triage triggers to close the gap.',
        action: 'Suggested workflow: Auto-assign Dynamics incidents by product SKU + notify specialist in Slack.',
      },
      {
        title: 'Salesforce backlog trending down',
        description:
          'Salesforce cases dropped 14% week-over-week after publishing the Gemini-powered troubleshooting article.',
        action: 'Double down with a follow-up automation that syncs resolved cases back into Zendesk.',
      },
      {
        title: 'Zendesk escalations breaching SLA',
        description:
          'Two critical Zendesk tickets exceeded SLA. The AI summary flagged missing hardware logs in both cases.',
        action: 'Create a pre-escalation check that requests diagnostics from the Nuki bridge before paging on-call.',
      },
    ],
    [],
  );

  return (
    <section
      id="analytics"
      className="grid gap-3xl rounded-3xl border border-neutral-gray800 bg-neutral-darkest/90 p-3xl shadow-card glass-card"
      aria-labelledby="analytics-heading"
    >
      <header className="grid gap-xs">
        <span className="text-xs uppercase tracking-[0.2em] text-primary-yellow">Analytics</span>
        <h2 id="analytics-heading" className="text-h2 font-semibold text-neutral-white">
          Unified support performance
        </h2>
        <p className="text-sm text-neutral-gray400">
          Compare Zendesk, Dynamics 365, and Salesforce operations at a glance, then dive into AI-generated actions.
        </p>
      </header>

      <div className="grid gap-xl md:grid-cols-3">
        {platformStats.map((stat) => (
          <article key={stat.id} className="grid gap-md rounded-2xl border border-neutral-gray800 bg-neutral-dark/80 p-2xl shadow-inner">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-white">{stat.label}</h3>
              <span className="text-xs uppercase tracking-wide text-neutral-gray500">24h</span>
            </div>
            <div className="grid gap-sm text-sm text-neutral-gray300">
              <div className="flex items-center justify-between">
                <span>New records</span>
                <strong className="text-neutral-white text-xl">{stat.newCases}</strong>
              </div>
              <div>
                <div className="flex items-center justify-between text-neutral-gray400">
                  <span>Automation coverage</span>
                  <span>{stat.automationCoverage}%</span>
                </div>
                <div className={`progress-track ${toProgressClass(stat.automationCoverage)}`} aria-hidden="true" />
              </div>
              <div className="flex items-center justify-between">
                <span>SLA breaches</span>
                <span className="text-semantic-warning font-semibold">{stat.slaBreaches}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg. handle time</span>
                <span>{stat.averageHandleTimeMinutes} min</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section
        id="week-signal"
        className="grid gap-lg rounded-2xl border border-neutral-gray800 bg-neutral-dark p-2xl"
        aria-labelledby="week-signal-heading"
      >
        <header className="flex items-center justify-between">
          <h3 id="week-signal-heading" className="text-lg font-semibold text-neutral-white">
            Week-over-week signal
          </h3>
          <div className="flex items-center gap-sm text-xs text-neutral-gray400">
            <span className="rounded-full border border-neutral-gray700 px-sm py-xs">Cases ▼14%</span>
            <span className="rounded-full border border-neutral-gray700 px-sm py-xs">Automation ▲6%</span>
            <span className="rounded-full border border-neutral-gray700 px-sm py-xs">CSAT 4.6</span>
          </div>
        </header>
        <p className="text-sm text-neutral-gray400">
          Gemini surfaces correlations between manual escalations and customer satisfaction so you can focus on the
          highest-impact playbooks.
        </p>
      </section>

      <section id="ai-actions" className="grid gap-lg" aria-labelledby="ai-actions-heading">
        <h3 id="ai-actions-heading" className="text-lg font-semibold text-neutral-white">
          AI actions to take this week
        </h3>
        <div className="grid gap-lg md:grid-cols-3">
          {insightItems.map((item) => (
            <article key={item.title} className="grid gap-sm rounded-2xl border border-neutral-gray800 bg-neutral-dark px-2xl py-2xl">
              <h4 className="text-md font-semibold text-neutral-white">{item.title}</h4>
              <p className="text-sm text-neutral-gray400">{item.description}</p>
              <p className="text-xs font-medium text-primary-yellow">{item.action}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};
