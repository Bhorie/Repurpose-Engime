import React, { useState } from 'react';

const Button = ({ children, onClick, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center h-9 px-5 rounded-full text-[13px] font-medium cursor-pointer transition-all whitespace-nowrap';
  
  const variantStyles = {
    primary: 'bg-[#1E2055] text-white border border-[#1E2055] hover:opacity-90',
    secondary: 'bg-transparent border border-[#D6D6DA] text-[#1E2055] hover:bg-[rgba(30,32,85,0.05)]',
    outline: 'bg-transparent border border-[#1E2055] text-[#1E2055] hover:bg-[rgba(30,32,85,0.05)]',
    ghost: 'bg-transparent border border-transparent text-[#1E2055] px-2 hover:opacity-70'
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, status }) => {
  const baseStyles = 'text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full font-semibold border';
  
  const statusStyles = {
    draft: 'bg-[#F3F4F6] text-[#5A5C75] border-[#E5E7EB]',
    ready: 'bg-[#EBF8FF] text-[#1E40AF] border-[#BFDBFE]',
    posted: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
  };

  return (
    <span className={`${baseStyles} ${statusStyles[status]}`}>
      {children}
    </span>
  );
};

const Metric = ({ label, value }) => (
  <div className="text-xs text-[#1E2055] border border-[#D6D6DA] py-0.5 px-2.5 rounded-full flex items-center gap-1.5">
    {label} <span className="text-[#5A5C75]">{value}</span>
  </div>
);

const Tag = ({ children }) => (
  <span className="text-xs px-2.5 py-1 border border-[#D6D6DA] text-[#1E2055] rounded">
    {children}
  </span>
);

const NavItem = ({ children, active = false, onClick }) => (
  <a 
    href="#" 
    onClick={(e) => { e.preventDefault(); onClick && onClick(); }}
    className={`flex items-center gap-3 py-2.5 text-sm font-medium transition-colors no-underline ${
      active ? 'text-[#1E2055]' : 'text-[#5A5C75] hover:text-[#1E2055]'
    }`}
  >
    {active && <span className="mr-[-4px]">→</span>}
    {children}
  </a>
);

const DataRow = ({ item, selected, onClick }) => (
  <div 
    className={`grid grid-cols-[1fr_auto] gap-5 p-5 px-8 border-b border-[#D6D6DA] cursor-pointer transition-all items-start ${
      selected 
        ? 'bg-[#F2F2F4] border-l-[3px] border-l-[#1E2055] pl-[29px]' 
        : 'hover:bg-[#FAFAFB]'
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Badge status={item.status}>{item.statusLabel}</Badge>
        <span className="text-base font-medium text-[#1E2055]">{item.title}</span>
      </div>
      <div className="text-[13px] text-[#5A5C75] leading-relaxed">
        {item.source}
      </div>
      <div className="flex gap-3 mt-1">
        {item.metrics.map((metric, idx) => (
          <Metric key={idx} label={metric.label} value={metric.value} />
        ))}
      </div>
    </div>
    <div className="row-actions">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M9 18l6-6-6-6"></path>
      </svg>
    </div>
  </div>
);

const Inspector = ({ item }) => {
  if (!item) return null;

  return (
    <aside className="bg-[#F2F2F4] border-l border-[#D6D6DA] flex flex-col overflow-y-auto">
      <div className="p-8 px-5 border-b border-[#D6D6DA]">
        <span className="text-[11px] uppercase tracking-widest text-[#5A5C75] mb-3 block">Selected Item</span>
        <h2 className="text-lg font-normal text-[#1E2055] mb-3">{item.title}</h2>
        <div className="inline-flex items-center gap-1.5 text-xs text-[#1E2055] border border-[#1E2055] py-0.5 px-2.5 rounded-full">
          Repurpose Score &nbsp;<strong>{item.score}</strong>
        </div>
      </div>

      <div className="p-5 border-b border-[#D6D6DA]">
        <span className="text-[11px] uppercase tracking-widest text-[#5A5C75] mb-3 block">Summary</span>
        <p className="text-[13px] text-[#5A5C75] leading-relaxed">
          {item.summary}
        </p>
      </div>

      <div className="p-5 border-b border-[#D6D6DA]">
        <span className="text-[11px] uppercase tracking-widest text-[#5A5C75] mb-3 block">Key Takeaways</span>
        <ul className="pl-4 text-[13px] text-[#5A5C75] leading-relaxed">
          {item.takeaways.map((takeaway, idx) => (
            <li key={idx}>{takeaway}</li>
          ))}
        </ul>
      </div>

      <div className="p-5 border-b border-[#D6D6DA]">
        <span className="text-[11px] uppercase tracking-widest text-[#5A5C75] mb-3 block">Tags</span>
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag, idx) => (
            <Tag key={idx}>{tag}</Tag>
          ))}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 mt-auto bg-white border-t border-[#D6D6DA]">
        <Button variant="primary">Generate Draft</Button>
        <Button variant="secondary">Save to Queue</Button>
        <Button variant="ghost" className="mt-1">View Source</Button>
      </div>
    </aside>
  );
};

const App = () => {
  const [selectedItemId, setSelectedItemId] = useState(0);
  const [activeNav, setActiveNav] = useState('queue');

  const items = [
    {
      id: 0,
      status: 'ready',
      statusLabel: 'Ready',
      title: 'The Philosophy of Spacing',
      source: 'Original on Reddit • r/design_systems • 2h ago',
      metrics: [
        { label: 'Score', value: '92' },
        { label: 'Comments', value: '142' }
      ],
      score: 92,
      summary: 'A deep dive into how spacing dictates hierarchy more effectively than size or color. The thread argues for a 4pt grid system as a universal baseline.',
      takeaways: [
        'Proximity = Relationship',
        'Rhythm creates trust',
        'Dense interfaces need tighter grids'
      ],
      tags: ['Design', 'SaaS', 'Education']
    },
    {
      id: 1,
      status: 'draft',
      statusLabel: 'Draft',
      title: 'Color Theory for Developers',
      source: 'Original on X (Twitter) • @ui_wizard • 4h ago',
      metrics: [
        { label: 'Score', value: '84' },
        { label: 'Likes', value: '1.2k' }
      ],
      score: 84,
      summary: 'A comprehensive guide to understanding color theory from a developer\'s perspective, covering HSL, accessibility, and practical implementation strategies.',
      takeaways: [
        'HSL is more intuitive than RGB',
        'Always check contrast ratios',
        'Use color to reinforce hierarchy'
      ],
      tags: ['Development', 'Design', 'Accessibility']
    },
    {
      id: 2,
      status: 'draft',
      statusLabel: 'Draft',
      title: 'Why "White Space" isn\'t wasted space',
      source: 'Original on Medium • UX Collective • 6h ago',
      metrics: [
        { label: 'Score', value: '76' },
        { label: 'Reads', value: '405' }
      ],
      score: 76,
      summary: 'An exploration of how white space improves readability, comprehension, and user experience in digital interfaces.',
      takeaways: [
        'White space reduces cognitive load',
        'Breathing room improves focus',
        'Less is often more'
      ],
      tags: ['UX', 'Design', 'Psychology']
    },
    {
      id: 3,
      status: 'posted',
      statusLabel: 'Posted',
      title: 'Accessibility Checklists 2024',
      source: 'Posted to LinkedIn • 1d ago',
      metrics: [
        { label: 'Score', value: '98' },
        { label: 'Shares', value: '45' }
      ],
      score: 98,
      summary: 'A comprehensive checklist for ensuring your web applications meet modern accessibility standards and WCAG guidelines.',
      takeaways: [
        'ARIA labels are essential',
        'Keyboard navigation is critical',
        'Color alone shouldn\'t convey meaning'
      ],
      tags: ['Accessibility', 'Web', 'Standards']
    },
    {
      id: 4,
      status: 'posted',
      statusLabel: 'Posted',
      title: 'Modern CSS Reset',
      source: 'Posted to Dev.to • 2d ago',
      metrics: [
        { label: 'Score', value: '88' },
        { label: 'Saves', value: '210' }
      ],
      score: 88,
      summary: 'A minimal yet comprehensive CSS reset for modern web development, focusing on consistency and usability.',
      takeaways: [
        'Box-sizing: border-box is essential',
        'Remove default margins intelligently',
        'Set sensible form defaults'
      ],
      tags: ['CSS', 'Development', 'Best Practices']
    }
  ];

  const selectedItem = items.find(item => item.id === selectedItemId);

  return (
    <div className="h-screen w-full bg-[#F2F2F4] text-[#1E2055] font-['Helvetica_Neue',Helvetica,Arial,sans-serif] text-sm leading-relaxed flex overflow-hidden" style={{ WebkitFontSmoothing: 'antialiased' }}>
      <div className="grid grid-cols-[240px_1fr_320px] grid-rows-[64px_1fr] w-full h-full">
        
        <nav className="row-span-2 bg-[#F2F2F4] p-5 flex flex-col gap-10 border-r border-[#D6D6DA]">
          <div>
            <div className="text-xl font-medium text-[#1E2055] tracking-tight mb-3">Variant</div>
            <div className="text-xs text-[#5A5C75]">Repurposing Engine</div>
          </div>

          <div className="flex flex-col gap-1">
            <NavItem active={activeNav === 'inbox'} onClick={() => setActiveNav('inbox')}>Inbox</NavItem>
            <NavItem active={activeNav === 'queue'} onClick={() => setActiveNav('queue')}>Queue</NavItem>
            <NavItem active={activeNav === 'tracker'} onClick={() => setActiveNav('tracker')}>Tracker</NavItem>
            <NavItem active={activeNav === 'insights'} onClick={() => setActiveNav('insights')}>Insights</NavItem>
          </div>

          <div className="h-px bg-[#D6D6DA] my-2.5 w-10"></div>

          <div className="flex flex-col gap-1">
            <NavItem active={activeNav === 'settings'} onClick={() => setActiveNav('settings')}>Settings</NavItem>
          </div>
        </nav>

        <header className="col-span-2 flex items-center justify-between px-8 bg-[#F2F2F4] border-b border-[#D6D6DA]">
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-normal text-[#1E2055] tracking-tight">Content Queue</h1>
            <div className="text-xs text-[#5A5C75] mt-0.5">24 Items Pending Review</div>
          </div>
          <div className="flex items-center gap-5">
            <Button variant="ghost">
              Sync <span className="text-[10px] ml-1">▼</span>
            </Button>
            <div className="w-8 h-8 rounded-full border border-[#D6D6DA] flex items-center justify-center text-xs">JS</div>
          </div>
        </header>

        <main className="bg-white overflow-y-auto border-r border-[#D6D6DA]">
          {items.map(item => (
            <DataRow 
              key={item.id}
              item={item}
              selected={selectedItemId === item.id}
              onClick={() => setSelectedItemId(item.id)}
            />
          ))}
        </main>

        <Inspector item={selectedItem} />
      </div>
    </div>
  );
};

export default App;