import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  ChevronRight,
  X,
  LogOut,
  Users,
  Building2,
  UserCircle2,
} from 'lucide-react';
import { ROUTES } from '../routes/config';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLocaleStore } from '../store/useLocaleStore';
import { useAuthStore } from '../store/useAuthStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed = false }) => {
  const { t } = useLocaleStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isHR = user?.role === 'HR';
  const canManageSurveys = isAdmin || isHR;

  const sections = [
    {
      title: t('sidebar.platform'),
      items: [
        {
          name: t('sidebar.dashboard'),
          icon: LayoutDashboard,
          path: ROUTES.DASHBOARD,
          show: true,
        },
        {
          name: t('sidebar.employees'),
          icon: Users,
          path: ROUTES.EMPLOYEES,
          show: isAdmin || isHR,
        },
        {
          name: t('sidebar.departments'),
          icon: Building2,
          path: ROUTES.DEPARTMENTS,
          show: isAdmin,
        },
      ].filter((item) => item.show),
    },
  ];

  const sidebarClasses = cn(
    'h-screen w-72 left-0 top-0 fixed bg-surface-container-low flex flex-col p-6 z-50 transition-transform duration-300 ease-in-out border-r border-outline-variant/10',
    isOpen ? 'translate-x-0' : isCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0',
    !isOpen && 'max-md:-translate-x-full'
  );

  return (
    <aside className={sidebarClasses}>
      {/* Brand & Mobile Close */}
      <div className="mb-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <span
              className="material-symbols-outlined text-white text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pulse_alert
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black text-blue-900 leading-none">PulsoRH</h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 md:hidden text-slate-400 hover:text-on-surface transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 768) onClose();
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center group space-x-3 px-4 py-3 transition-all duration-200 rounded-2xl',
                      isActive
                        ? 'bg-primary text-white shadow-md shadow-primary/20 font-bold'
                        : 'text-slate-500 hover:bg-surface-container-high/50 hover:text-primary'
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          'w-5 h-5',
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'
                        )}
                      />
                      <span className="font-headline font-semibold text-sm">{item.name}</span>
                      {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile Area */}
      <div className="mt-auto pt-6 border-t border-outline-variant/10">
        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) =>
            `bg-surface-container/50 rounded-2xl p-4 flex items-center gap-3 mb-4 border transition-all cursor-pointer group ${
              isActive
                ? 'border-primary/20 bg-primary/5'
                : 'border-outline-variant/5 hover:border-primary/10 hover:bg-primary/5'
            }`
          }
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-white shadow-sm flex-shrink-0">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1287&auto=format&fit=crop'
              }
              className="w-full h-full object-cover"
              alt="Profile"
            />
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="text-sm font-bold text-on-surface truncate">{user?.name}</h4>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-black uppercase tracking-tighter bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/10">
                {user?.role}
              </span>
              <p className="text-[10px] text-slate-400 font-medium truncate">{user?.email}</p>
            </div>
          </div>
          <UserCircle2 className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
        </NavLink>

        <div className="flex flex-col gap-2">
          {canManageSurveys && (
            <NavLink
              to={ROUTES.BUILDER_NEW}
              className="w-full flex items-center justify-center space-x-2 bg-signature-gradient text-on-primary py-3 px-4 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:opacity-90 transition-all active:scale-[0.98]"
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">{t('sidebar.new_survey')}</span>
            </NavLink>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-slate-100 text-slate-600 py-3 px-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">{t('common.logout')}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
