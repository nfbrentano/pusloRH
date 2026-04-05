import React from 'react';
import { X, Eye, Save, Loader2 } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';
import { useNavigate } from 'react-router-dom';

interface BuilderHeaderProps {
  id?: string;
  isActive: boolean;
  setIsActive: (val: boolean) => void;
  onPreview: () => void;
  onSave: () => void;
  isPending: boolean;
}

const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  id,
  isActive,
  setIsActive,
  onPreview,
  onSave,
  isPending,
}) => {
  const { t } = useLocaleStore();
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface/80 backdrop-blur-md md:pl-72 pointer-events-none">
      <div className="flex items-center gap-4 ml-auto pointer-events-auto">
        {id && (
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium border ${
              isActive
                ? 'text-slate-500 border-outline-variant/30 hover:bg-slate-50'
                : 'text-success bg-success/5 border-success/20 hover:bg-success/10'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${isActive ? 'bg-error' : 'bg-success animate-pulse'}`}
            ></div>
            <span>{isActive ? t('builder.inactivate_survey') : t('builder.activate_survey')}</span>
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-slate-400 hover:text-error px-4 py-2 rounded-lg transition-all font-medium hover:bg-error/5"
        >
          <X className="w-5 h-5" />
          <span>{t('common.cancel')}</span>
        </button>
        <button
          type="button"
          onClick={onPreview}
          className="flex items-center gap-2 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors font-medium border border-outline-variant/30 bg-white/50"
        >
          <Eye className="w-5 h-5" />
          <span>{t('common.preview')}</span>
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{id ? t('builder.save_changes') : t('builder.save_new')}</span>
        </button>
      </div>
    </div>
  );
};

export default BuilderHeader;
