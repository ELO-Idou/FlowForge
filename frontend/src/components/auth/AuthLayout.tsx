import { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => (
  <div className="min-h-screen flex items-center justify-center bg-neutral-darkest text-neutral-white">
    <div className="w-full max-w-3xl bg-neutral-dark p-3xl rounded-xl shadow-lg shadow-black/40 grid gap-2xl">
      <header className="grid gap-sm text-center">
        <h1 className="text-h1 font-semibold">{title}</h1>
        <p className="text-body text-neutral-gray300">{subtitle}</p>
      </header>
      <main className="flex justify-center">{children}</main>
    </div>
  </div>
);
