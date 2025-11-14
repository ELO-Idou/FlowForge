import { Link } from 'react-router-dom';

import { LoginForm } from '../../components/auth/LoginForm';

export const LoginPage = () => (
  <div className="relative flex min-h-screen items-center justify-center bg-neutral-darkest text-neutral-white">
    <Link to="/" className="absolute left-8 top-8 text-lg font-semibold tracking-wide text-primary-yellow">
      FlowForge
    </Link>
    <div className="w-full max-w-xl rounded-3xl border border-neutral-gray800 bg-neutral-dark/80 p-3xl shadow-card">
      <div className="grid gap-lg text-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-white">Welcome back</h1>
          <p className="mt-xs text-sm text-neutral-gray400">
            Sign in to continue orchestrating automated customer journeys.
          </p>
        </div>
        <LoginForm />
        <p className="text-sm text-neutral-gray400">
          Don&apos;t have an account yet?{' '}
          <Link to="/register" className="text-primary-yellow hover:text-primary-yellowHover">
            Create one now
          </Link>
          .
        </p>
      </div>
    </div>
  </div>
);
