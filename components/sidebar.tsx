'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Inbox, ListChecks, BarChart3, Lightbulb, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    title: 'Inbox',
    href: '/inbox',
    icon: Inbox,
    description: 'Discover repurpose candidates',
  },
  {
    title: 'Queue',
    href: '/queue',
    icon: ListChecks,
    description: 'Manage your drafts',
  },
  {
    title: 'Tracker',
    href: '/tracker',
    icon: BarChart3,
    description: 'Monitor performance',
  },
  {
    title: 'Insights',
    href: '/insights',
    icon: Lightbulb,
    description: 'AI-powered recommendations',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/40">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Zap className="h-6 w-6 text-primary" />
        <span className="ml-2 text-xl font-bold">Repurpose Engine</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col rounded-lg px-4 py-3 transition-all hover:bg-accent',
                isActive
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.title}</span>
              </div>
              <span className="ml-8 mt-1 text-xs text-muted-foreground">
                {item.description}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <div className="rounded-lg bg-primary/10 p-4">
          <p className="text-sm font-medium">Safe & Ethical</p>
          <p className="mt-1 text-xs text-muted-foreground">
            All content is summarized and remixed, never copied verbatim.
          </p>
        </div>
      </div>
    </div>
  );
}
