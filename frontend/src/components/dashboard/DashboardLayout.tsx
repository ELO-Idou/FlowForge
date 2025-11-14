import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => (
  <div className="grid grid-cols-[260px_1fr] min-h-screen bg-neutral-darkest text-neutral-white">
    <Sidebar />
    <div className="grid grid-rows-[auto_1fr]">
      <Header />
      <main className="p-2xl bg-neutral-dark overflow-y-auto">{children}</main>
    </div>
  </div>
);
