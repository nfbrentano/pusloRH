import React from 'react';
import type { QuestionType } from '../../types';
import { useLocaleStore } from '../../store/useLocaleStore';

interface QuestionInputProps {
  type: QuestionType;
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
}

const QuestionInput: React.FC<QuestionInputProps> = ({ type, value, onChange, disabled }) => {
  const { t } = useLocaleStore();

  const handleRadioChange = (val: string | number) => {
    if (!disabled && onChange) {
      onChange(val);
    }
  };

  switch (type) {
    case 'Binary':
      return (
        <div className="flex justify-center gap-4 md:gap-8 pt-4">
          {[
            {
              emoji: '👍',
              label: t('builder.label_yes'),
              val: 'Yes',
              color:
                'hover:bg-success/5 hover:text-success peer-checked:bg-success peer-checked:text-white border-success/20',
            },
            {
              emoji: '👎',
              label: t('builder.label_no'),
              val: 'No',
              color:
                'hover:bg-error/5 hover:text-error peer-checked:bg-error peer-checked:text-white border-error/20',
            },
          ].map((item) => (
            <label
              key={item.val}
              className={`flex-1 max-w-[160px] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} group/binary`}
            >
              <input
                type="radio"
                disabled={disabled}
                className="sr-only peer"
                onChange={() => handleRadioChange(item.val)}
                checked={value === item.val}
              />
              <div
                className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${item.color} ${disabled ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <span className="text-4xl group-hover/binary:scale-110 transition-transform">
                  {item.emoji}
                </span>
                <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
              </div>
            </label>
          ))}
        </div>
      );

    case 'LikertAgreement':
      return (
        <div className="grid grid-cols-5 gap-2 md:gap-4 pt-4">
          {[
            { emoji: '😠', label: t('builder.likert_agree_1'), val: 1 },
            { emoji: '🙁', label: t('builder.likert_agree_2'), val: 2 },
            { emoji: '😐', label: t('builder.likert_agree_3'), val: 3 },
            { emoji: '🙂', label: t('builder.likert_agree_4'), val: 4 },
            { emoji: '🤩', label: t('builder.likert_agree_5'), val: 5 },
          ].map((item) => (
            <label
              key={item.val}
              className={`flex flex-col items-center gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} group/likert`}
            >
              <input
                type="radio"
                disabled={disabled}
                className="sr-only peer"
                onChange={() => handleRadioChange(item.val)}
                checked={value === item.val}
              />
              <div
                className={`text-3xl md:text-5xl transition-all duration-200 group-hover/likert:scale-125 grayscale hover:grayscale-0 peer-checked:grayscale-0 peer-checked:scale-125 ${disabled ? 'grayscale' : ''}`}
              >
                {item.emoji}
              </div>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 peer-checked:text-primary transition-colors text-center leading-tight h-8 flex items-center justify-center uppercase tracking-tighter">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      );

    case 'LikertFrequency':
      return (
        <div className="grid grid-cols-5 gap-2 md:gap-4 pt-4">
          {[
            { emoji: '🌑', label: t('builder.likert_freq_1'), val: 1 },
            { emoji: '🌘', label: t('builder.likert_freq_2'), val: 2 },
            { emoji: '🌗', label: t('builder.likert_freq_3'), val: 3 },
            { emoji: '🌖', label: t('builder.likert_freq_4'), val: 4 },
            { emoji: '🌕', label: t('builder.likert_freq_5'), val: 5 },
          ].map((item) => (
            <label
              key={item.val}
              className={`flex flex-col items-center gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} group/likert`}
            >
              <input
                type="radio"
                disabled={disabled}
                className="sr-only peer"
                onChange={() => handleRadioChange(item.val)}
                checked={value === item.val}
              />
              <div
                className={`text-3xl md:text-5xl transition-all duration-200 group-hover/likert:scale-125 opacity-40 hover:opacity-100 peer-checked:opacity-100 peer-checked:scale-125 ${disabled ? 'grayscale cursor-not-allowed' : ''}`}
              >
                {item.emoji}
              </div>
              <span className="text-[9px] md:text-[10px] font-bold text-slate-400 peer-checked:text-primary transition-colors text-center leading-tight h-8 flex items-center justify-center uppercase tracking-tighter text-wrap">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      );

    case 'Emoticons':
      return (
        <div className="grid grid-cols-5 gap-2 md:gap-6 pt-4">
          {[
            { emoji: '😡', label: t('respondent.rating_1'), val: 1 },
            { emoji: '🙁', label: t('respondent.rating_2'), val: 2 },
            { emoji: '😐', label: t('respondent.rating_3'), val: 3 },
            { emoji: '🙂', label: t('respondent.rating_4'), val: 4 },
            { emoji: '🤩', label: t('respondent.rating_5'), val: 5 },
          ].map((item) => (
            <label
              key={item.val}
              className={`flex flex-col items-center gap-3 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} group/emoji`}
            >
              <input
                type="radio"
                disabled={disabled}
                className="sr-only peer"
                onChange={() => handleRadioChange(item.val)}
                checked={value === item.val}
              />
              <div
                className={`text-4xl md:text-5xl transition-transform duration-200 group-hover/emoji:scale-125 grayscale hover:grayscale-0 peer-checked:grayscale-0 peer-checked:scale-125 ${disabled ? 'grayscale' : ''}`}
              >
                {item.emoji}
              </div>
              <span className="text-[10px] md:text-xs font-medium text-slate-400 peer-checked:text-primary transition-colors uppercase tracking-wider text-center">
                {item.label}
              </span>
            </label>
          ))}
        </div>
      );

    case 'Slider':
    default:
      return (
        <div className="pt-10 px-4">
          <input
            type="range"
            min="1"
            max="10"
            disabled={disabled}
            className={`w-full h-2 bg-secondary-container rounded-lg appearance-none ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} accent-secondary transition-all`}
            value={(value as number) || 5}
            onChange={(e) => !disabled && onChange && onChange(parseInt(e.target.value))}
          />
          <div className="flex justify-between mt-6 px-1">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-on-surface">1</span>
              <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-semibold">
                {t('respondent.slider_min')}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm font-bold text-on-surface">10</span>
              <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-semibold">
                {t('respondent.slider_max')}
              </span>
            </div>
          </div>
        </div>
      );
  }
};

export default QuestionInput;
