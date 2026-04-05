import React from 'react';
import {
  Trash2,
  MessageSquare,
  Smile,
  SlidersHorizontal,
  CheckSquare,
  BarChart3,
  Activity,
} from 'lucide-react';
import type { Question, QuestionType } from '../../types';
import { useLocaleStore } from '../../store/useLocaleStore';
import InfoTooltip from '../InfoTooltip';
import BuilderPreview from '../survey/BuilderPreview';

interface QuestionEditorCardProps {
  question: Omit<Question, 'surveyId'>;
  index: number;
  onUpdate: (id: string, updates: Partial<Omit<Question, 'surveyId'>>) => void;
  onRemove: (id: string) => void;
}

const QuestionEditorCard: React.FC<QuestionEditorCardProps> = ({
  question,
  index,
  onUpdate,
  onRemove,
}) => {
  const { t } = useLocaleStore();

  const types: { type: QuestionType; icon: React.ElementType; label: string; tooltip: string }[] = [
    {
      type: 'Emoticons',
      icon: Smile,
      label: t('builder.type_emoticons'),
      tooltip: t('builder.type_emoticons_tooltip'),
    },
    {
      type: 'Slider',
      icon: SlidersHorizontal,
      label: t('builder.type_slider'),
      tooltip: t('builder.type_slider_tooltip'),
    },
    {
      type: 'Binary',
      icon: CheckSquare,
      label: t('builder.type_binary'),
      tooltip: t('builder.type_binary_tooltip'),
    },
    {
      type: 'LikertAgreement',
      icon: BarChart3,
      label: t('builder.type_likert_agreement'),
      tooltip: t('builder.type_likert_agreement_tooltip'),
    },
    {
      type: 'LikertFrequency',
      icon: Activity,
      label: t('builder.type_likert_frequency'),
      tooltip: t('builder.type_likert_frequency_tooltip'),
    },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/15 group relative">
      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-full hidden group-focus-within:block group-hover:block transition-all"></div>

      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex-grow">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-primary mb-2">
            {t('builder.question_label')} {String(index + 1).padStart(2, '0')}
          </label>
          <input
            id={`q-text-${question.id}`}
            name={`q-text-${question.id}`}
            value={question.text}
            onChange={(e) => onUpdate(question.id, { text: e.target.value })}
            className="w-full text-lg font-semibold bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-slate-300"
            placeholder={t('builder.question_placeholder')}
          />
        </div>
        <button
          type="button"
          onClick={() => onRemove(question.id)}
          className="text-slate-300 hover:text-error transition-colors p-2 rounded-lg hover:bg-error-container/20"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="col-span-full">
          <label className="block text-sm font-semibold text-on-surface-variant mb-3">
            {t('builder.response_type')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-surface-container-low p-1.5 rounded-2xl">
            {types.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => onUpdate(question.id, { type: item.type })}
                  className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl transition-all ${
                    question.type === item.type
                      ? 'bg-white shadow-md text-primary font-bold'
                      : 'text-slate-500 font-medium hover:bg-white/50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Icon className="w-5 h-5" />
                    <InfoTooltip text={item.tooltip} />
                  </div>
                  <span className="text-[10px]">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visual Preview */}
        <BuilderPreview type={question.type} />

        <div className="flex items-center justify-between bg-surface-container-low/50 px-5 py-3 rounded-xl border border-dashed border-outline-variant/30">
          <div className="flex items-center gap-3">
            <MessageSquare className="text-slate-400 w-5 h-5" />
            <span className="text-sm font-semibold text-on-surface-variant">
              {t('builder.allow_comment')}
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={question.allowComment}
              onChange={(e) => onUpdate(question.id, { allowComment: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default QuestionEditorCard;
