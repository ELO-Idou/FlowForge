import { Button } from '../common/Button';

export const Header = () => (
  <header className="flex items-center justify-between px-2xl py-xl border-b border-neutral-gray800 bg-neutral-dark">
    <div>
      <h1 className="text-h3 font-semibold text-neutral-white">Welcome back, Operator</h1>
      <p className="text-sm text-neutral-gray400">Let’s turn your next idea into an intelligent workflow.</p>
    </div>
    <div className="flex gap-sm">
      <Button variant="ghost">Run history</Button>
      <Button variant="primary">Create new workflow</Button>
    </div>
  </header>
);
