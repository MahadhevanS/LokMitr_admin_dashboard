import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Map, 
  Users, 
  Building2,
  Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Complaints', href: '/complaints', icon: FileText },
  { name: 'Map View', href: '/map', icon: Map },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-surface border-r border-border h-full">
      <nav className="p-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}