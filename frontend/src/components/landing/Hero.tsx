import { Link } from 'react-router-dom';

import heroIllustration from '../../assets/hero-illustration.svg';

export const Hero = () => (
  <section className="grid gap-xl md:grid-cols-[1.1fr_0.9fr] items-center py-4xl">
    <div className="grid gap-lg">
      <p className="uppercase tracking-[0.4em] text-sm text-primary-yellow">Automation for bold teams</p>
      <h1 className="text-hero font-bold leading-tight text-neutral-white">
        Operate smarter with AI-crafted workflows
      </h1>
      <p className="text-lg text-neutral-gray300 max-w-2xl">
        NUKI-inspired automation platform that turns natural language into production-ready workflows.
        Launch marketing journeys, customer onboarding, and internal ops in minutes.
      </p>
      <div className="flex flex-wrap gap-md">
        <Link
          to="/register"
          className="inline-flex items-center justify-center rounded-full bg-primary-yellow px-2xl py-md text-lg font-medium text-neutral-darkest transition-colors focus:outline-none focus:ring-2 focus:ring-primary-yellow/60 hover:bg-primary-yellowHover"
        >
          Start free trial
        </Link>
        <Link
          to="/app"
          className="inline-flex items-center justify-center rounded-full border border-neutral-gray700 px-2xl py-md text-lg font-medium text-neutral-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary-yellow/60 hover:border-neutral-gray500"
        >
          Explore platform
        </Link>
      </div>
    </div>
    <div className="relative">
      <div className="absolute -inset-10 bg-primary-yellow/10 blur-3xl rounded-full" aria-hidden />
      <img src={heroIllustration} alt="Automation dashboard" className="relative z-10 w-full" />
    </div>
  </section>
);
