import React from 'react';
import QuestionInput from './QuestionInput';
import { useLocaleStore } from '../../store/useLocaleStore';
import type { QuestionType } from '../../types';

interface BuilderPreviewProps {
  type: QuestionType;
}

/**
 * A specialized preview component for the Survey Builder.
 * Shows how a question response field will look to the respondent,
 * but in a locked, scaled-down, and visually dimmed state.
 */
const BuilderPreview: React.FC<BuilderPreviewProps> = ({ type }) => {
  const { t } = useLocaleStore();

  return (
    <div className="relative overflow-hidden col-span-full opacity-60 pointer-events-none scale-95 border border-dashed border-outline-variant/40 rounded-2xl p-6 bg-surface-container-low/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
          {t('common.preview') || 'Visual Preview'}
        </span>
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        </div>
      </div>

      <div className="px-2">
        <QuestionInput type={type} disabled />
      </div>

      {/* Glassmorphism overlay to reinforce non-interactive state */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
    </div>
  );
};

export default BuilderPreview;
