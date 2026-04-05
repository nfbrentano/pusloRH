import React from 'react';
import { Send, Loader2, ShieldCheck } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';

interface RespondentFooterProps {
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
}

const RespondentFooter: React.FC<RespondentFooterProps> = ({ onSubmit, isPending }) => {
  const { t } = useLocaleStore();

  return (
    <div className="pt-12 pb-24 flex flex-col items-center gap-8">
      <div className="w-full h-px bg-surface-container-high max-w-xs"></div>
      <button
        onClick={onSubmit}
        disabled={isPending}
        className="bg-signature-gradient group flex items-center justify-center gap-4 py-6 px-12 rounded-xl shadow-xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50"
      >
        <span className="font-headline font-extrabold text-xl text-white tracking-tight">
          {isPending ? 'Enviando...' : t('respondent.send_responses')}
        </span>
        {isPending ? (
          <Loader2 className="text-white w-6 h-6 animate-spin" />
        ) : (
          <Send className="text-white w-6 h-6 transition-transform group-hover:translate-x-1" />
        )}
      </button>
      <p className="text-slate-400 text-sm flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-secondary" />
        {t('respondent.privacy_policy')}
      </p>
    </div>
  );
};

export default RespondentFooter;
