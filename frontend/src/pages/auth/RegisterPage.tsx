import { Link } from 'react-router-dom';

import { RegisterForm } from '../../components/auth/RegisterForm';

export const RegisterPage = () => (
  <div className="relative flex min-h-screen items-center justify-center bg-neutral-darkest text-neutral-white">
    <Link to="/" className="absolute left-8 top-8 text-lg font-semibold tracking-wide text-primary-yellow">
      FlowForge
    </Link>
    <div className="w-full max-w-xl rounded-3xl border border-neutral-gray800 bg-neutral-dark/80 p-3xl shadow-card">
      <div className="grid gap-lg text-center">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-white">Create your workspace</h1>
          <p className="mt-xs text-sm text-neutral-gray400">
            Launch a personal automation studio in less than a minute.
          </p>
        </div>
        <RegisterForm />
        <p className="text-sm text-neutral-gray400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-yellow hover:text-primary-yellowHover">
            Log in instead
          </Link>
          .
        </p>
      </div>
    </div>
  </div>
);
