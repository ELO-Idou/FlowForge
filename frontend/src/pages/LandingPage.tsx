import { Link } from 'react-router-dom';

import { Footer } from '../components/common/Footer';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { HowItWorks } from '../components/landing/HowItWorks';
import { Pricing } from '../components/landing/Pricing';
import { FAQ } from '../components/landing/FAQ';

export const LandingPage = () => (
  <div className="min-h-screen bg-neutral-darkest text-neutral-white">
    <header className="sticky top-0 z-20 border-b border-neutral-gray800 bg-neutral-darkest/80 backdrop-blur py-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2xl">
        <Link to="/" className="text-lg font-semibold tracking-wide text-primary-yellow">
          FlowForge
        </Link>
        <nav className="flex items-center gap-lg text-sm text-neutral-gray300">
          <Link to="/#features" className="hover:text-neutral-white">
            Features
          </Link>
          <Link to="/#pricing" className="hover:text-neutral-white">
            Pricing
          </Link>
          <Link to="/#faqs" className="hover:text-neutral-white">
            FAQ
          </Link>
          <div className="flex items-center gap-sm">
            <Link to="/login" className="text-neutral-white hover:text-primary-yellow">
              Log in
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-primary-yellow px-xl py-sm text-body font-medium text-neutral-darkest transition-colors focus:outline-none focus:ring-2 focus:ring-primary-yellow/60 hover:bg-primary-yellowHover"
            >
              Start free trial
            </Link>
          </div>
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-2xl">
      <Hero />
      <section id="features">
        <Features />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="pricing">
        <Pricing />
      </section>
      <section id="faqs" className="pb-4xl">
        <FAQ />
      </section>
    </main>
    <Footer />
  </div>
);
