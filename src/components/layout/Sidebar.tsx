import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  ClipboardCheck, 
  MessageSquare, 
  Calendar, 
  FileText, 
  Settings, 
  BarChart3,
  BookOpen,
  Clock,
  Shield,
  UserCheck,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Users, label: 'Teachers', path: '/teachers' },
  { icon: GraduationCap, label: 'Training', path: '/training' },
  { icon: ClipboardCheck, label: 'Trials', path: '/trials' },
  { icon: Shield, label: 'Compliance', path: '/compliance' },
  { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
  { icon: UserCheck, label: 'Counselling', path: '/counselling' },
  { icon: Calendar, label: 'Scheduling', path: '/scheduling' },
  { icon: Clock, label: 'Attendance', path: '/attendance' },
  { icon: BookOpen, label: 'Content & R&D', path: '/content' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-[#0d4f42] transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">T&D Portal</span>
          </div>
        )}
        {collapsed && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator className="bg-white/10" />

      {/* Navigation */}
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <nav className="flex flex-col gap-1 p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User section */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0d4f42]/95 p-3">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <span className="text-sm font-medium text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-white/60">{user?.role}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-white/70 hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-white/70 hover:bg-white/10 hover:text-white"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
