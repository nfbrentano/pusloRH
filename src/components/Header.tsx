import { Bell, Menu, Languages, PanelLeftClose, PanelLeft } from 'lucide-react';
import { useLocaleStore } from '../store/useLocaleStore';
import { useAuthStore } from '../store/useAuthStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
  onToggleCollapse?: () => void;
  isSidebarCollapsed?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onMenuClick,
  onToggleCollapse,
  isSidebarCollapsed = false,
}) => {
  const { locale, setLocale } = useLocaleStore();
  const { user } = useAuthStore();

  const toggleLocale = () => {
    setLocale(locale === 'pt' ? 'en' : 'pt');
  };

  return (
    <header
      className={cn(
        'fixed top-0 z-50 flex justify-between items-center px-6 md:px-8 h-16 transition-all duration-300 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10 shadow-sm',
        isSidebarCollapsed ? 'w-full left-0' : 'w-full md:left-72 md:w-[calc(100%-18rem)]'
      )}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-2 -ml-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isSidebarCollapsed ? (
            <PanelLeft className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-blue-900 truncate max-w-[200px] md:max-w-none">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6">
        <div className="flex items-center space-x-1 md:space-x-4">
          <button className="p-2 rounded-full hover:bg-slate-100 transition-colors hidden sm:flex">
            <Bell className="text-slate-600 w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-outline-variant/30 text-xs font-bold text-slate-600 hover:bg-surface-container transition-all"
          >
            <Languages className="w-4 h-4" />
            <span className="uppercase">{locale}</span>
          </button>

          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
            <img
              alt="User avatar"
              className="w-full h-full object-cover"
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop'
              }
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
