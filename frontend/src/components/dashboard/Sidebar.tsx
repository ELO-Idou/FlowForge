import logo from '../../assets/logo.svg';

const sections = [
  { label: 'Overview', icon: '📊' },
  { label: 'Workflows', icon: '🧠' },
  { label: 'Credentials', icon: '🔐' },
  { label: 'Run history', icon: '📜' },
  { label: 'Monitoring', icon: '📡' },
];

export const Sidebar = () => (
  <aside className="bg-neutral-dark flex flex-col border-r border-neutral-gray800">
    <div className="flex items-center gap-sm px-2xl py-xl">
      <img src={logo} alt="Automation logo" className="w-10 h-10" />
      <span className="text-lg font-semibold">FlowForge</span>
    </div>
    <nav className="flex-1 grid gap-xs px-xl text-neutral-gray300">
      {sections.map((section) => (
        <button
          key={section.label}
          className="flex items-center gap-sm px-xl py-sm rounded-lg hover:bg-neutral-gray800 text-left"
        >
          <span>{section.icon}</span>
          <span>{section.label}</span>
        </button>
      ))}
    </nav>
    <div className="px-xl py-xl border-t border-neutral-gray800 text-sm text-neutral-gray500">
      © {new Date().getFullYear()} FlowForge
    </div>
  </aside>
);
