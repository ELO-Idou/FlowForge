import { MouseEvent, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '../components/common/Button';
import { AnalyticsDashboard } from '../components/dashboard/AnalyticsDashboard';
import { ChatInterface } from '../components/workflow/ChatInterface';

export const WorkspacePage = () => {
  const [showComposer, setShowComposer] = useState(false);
  const navigate = useNavigate();

  const handleSectionNavigation = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      event.preventDefault();
      const target = document.getElementById(sectionId);
      if (!target) {
        return;
      }

      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [],
  );

  const handleLogout = useCallback(() => {
    localStorage.removeItem('flowforge-session');
    navigate('/login', { replace: true });
  }, [navigate]);

  if (showComposer) {
    return <ChatInterface onExit={() => setShowComposer(false)} />;
  }

  const dashboardSections = [
    { id: 'analytics', label: 'Analytics' },
    { id: 'week-signal', label: 'Week-over-week signal' },
    { id: 'ai-actions', label: 'AI actions' },
  ];

  return (
    <div className="min-h-screen bg-neutral-darkest text-neutral-white">
      <header className="border-b border-neutral-gray800 bg-neutral-darkest/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-2xl py-lg">
          <Link to="/" className="text-lg font-semibold tracking-wide text-primary-yellow">
            FlowForge
          </Link>
          <div className="flex items-center gap-lg text-sm text-neutral-gray300">
            <nav className="hidden items-center gap-md md:flex" aria-label="Dashboard sections">
              {dashboardSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(event) => handleSectionNavigation(event, section.id)}
                  className="rounded-full border border-transparent px-md py-xs text-neutral-white/70 transition hover:border-primary-yellow/60 hover:text-primary-yellow"
                >
                  {section.label}
                </a>
              ))}
            </nav>
            <Button variant="ghost" size="md" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-3xl px-2xl py-4xl">
        <div className="grid gap-3xl">
          <section className="mx-auto max-w-3xl rounded-3xl border border-neutral-gray800 bg-neutral-dark/80 p-3xl text-center shadow-card">
            <h1 className="text-3xl font-semibold text-neutral-white">
              Welcome back! Ready to launch your next automation?
            </h1>
            <p className="mt-sm text-neutral-gray400">
              Capture the business context, preferred tools, and success metrics. We&apos;ll draft an executable
              workflow blueprint you can deploy to n8n with one click.
            </p>
            <div className="mt-xl flex justify-center">
              <Button size="lg" onClick={() => setShowComposer(true)}>
                Create workflow
              </Button>
            </div>
          </section>
          <AnalyticsDashboard />
        </div>
      </main>
    </div>
  );
};
