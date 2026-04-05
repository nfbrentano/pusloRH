import React from 'react';
import { Lock, HelpCircle, Bell } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';

const RespondentHeader: React.FC = () => {
  const { t } = useLocaleStore();

  return (
    <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-8 h-16 w-full shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold tracking-tighter text-blue-800 font-headline">
          PulsoRH
        </span>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-1 text-slate-500 font-medium text-sm">
          <Lock className="w-4 h-4" />
          <span>{t('respondent.anonymous_response')}</span>
        </div>
        <div className="flex items-center gap-2">
          <HelpCircle className="text-slate-600 cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors w-9 h-9" />
          <Bell className="text-slate-600 cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-colors w-9 h-9" />
        </div>
      </div>
    </header>
  );
};

export default RespondentHeader;
