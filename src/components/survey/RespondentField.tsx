import React from 'react';
import type { Question } from '../../types';
import { useLocaleStore } from '../../store/useLocaleStore';
import QuestionInput from './QuestionInput';

interface RespondentFieldProps {
  question: {
    id: string;
    text: string;
    type: Question['type'];
    allowComment?: boolean;
  };
  index: number;
  value?: string | number;
  comment?: string;
  onValueChange?: (value: string | number) => void;
  onCommentChange?: (comment: string) => void;
  disabled?: boolean;
}

const RespondentField: React.FC<RespondentFieldProps> = ({
  question,
  index,
  value,
  comment,
  onValueChange,
  onCommentChange,
  disabled = false,
}) => {
  const { t } = useLocaleStore();

  return (
    <div
      className={`
      relative group overflow-hidden
      bg-surface-container-lowest 
      rounded-[2rem] p-8 md:p-12 
      transition-all duration-500 
      border border-transparent hover:border-primary/10
      shadow-sm hover:shadow-2xl hover:shadow-primary/5
      ${disabled ? 'opacity-90' : ''}
    `}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col gap-10">
        <div className="flex items-start gap-5">
          <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-container/30 text-primary font-bold font-headline text-lg border border-primary/10 group-hover:scale-110 transition-transform duration-500">
            {String(index + 1).padStart(2, '0')}
          </div>
          <div className="space-y-1">
            <h2 className="font-headline font-extrabold text-2xl md:text-3xl text-on-surface leading-tight tracking-tight">
              {question.text}
            </h2>
            <div className="h-1 w-12 bg-primary/20 rounded-full group-hover:w-24 transition-all duration-700" />
          </div>
        </div>

        <div className="relative z-10">
          <QuestionInput
            type={question.type}
            value={value}
            onChange={onValueChange}
            disabled={disabled}
          />
        </div>

        {question.allowComment && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-700">
            <label
              htmlFor={`comment-${question.id}`}
              className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 pl-1"
            >
              {t('respondent.optional_comment') || 'Comentário (Opcional)'}
            </label>
            <textarea
              id={`comment-${question.id}`}
              disabled={disabled}
              className={`
                w-full bg-surface-container-low 
                border-2 border-transparent
                rounded-[1.5rem] p-6 
                font-body text-on-surface 
                focus:border-primary/20 focus:ring-4 focus:ring-primary/5 
                transition-all resize-none 
                placeholder:text-slate-400/60
                ${disabled ? 'cursor-not-allowed bg-slate-50' : 'hover:bg-surface-container-low/80'}
              `}
              placeholder={t('respondent.comment_placeholder')}
              rows={3}
              value={comment || ''}
              onChange={(e) => onCommentChange?.(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RespondentField;
