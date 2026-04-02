import React, { useState } from 'react';
import type { Question } from '../store/useSurveyStore';
import { X, Send, ShieldCheck, Lock, HelpCircle, Bell } from 'lucide-react';
import { useLocaleStore } from '../store/useLocaleStore';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  questions: Omit<Question, 'surveyId'>[];
}

const PreviewModal: React.FC<PreviewModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  questions 
}) => {
  const { t } = useLocaleStore();
  const [answers, setAnswers] = useState<Record<string, { value: any, comment?: string }>>({});

  if (!isOpen) return null;

  const handleValueChange = (qId: string, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], value }
    }));
  };

  const handleCommentChange = (qId: string, comment: string) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: { ...prev[qId], comment }
    }));
  };

  const renderQuestionInput = (q: any) => {
    switch (q.type) {
      case 'Binary':
        return (
          <div className="flex justify-center gap-4 md:gap-8 pt-4">
            {[
              { emoji: '👍', label: t('builder.label_yes'), val: 'Yes', color: 'hover:bg-success/5 hover:text-success peer-checked:bg-success peer-checked:text-white border-success/20' },
              { emoji: '👎', label: t('builder.label_no'), val: 'No', color: 'hover:bg-error/5 hover:text-error peer-checked:bg-error peer-checked:text-white border-error/20' },
            ].map((item) => (
              <label key={item.val} className="flex-1 max-w-[160px] cursor-pointer group/binary">
                <input 
                  type="radio" 
                  name={`preview-q-${q.id}`}
                  className="sr-only peer"
                  onChange={() => handleValueChange(q.id, item.val)}
                  checked={answers[q.id]?.value === item.val}
                />
                <div className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${item.color}`}>
                  <span className="text-4xl group-hover/binary:scale-110 transition-transform">{item.emoji}</span>
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
              <label key={item.val} className="flex flex-col items-center gap-3 cursor-pointer group/likert">
                <input 
                  type="radio" 
                  name={`preview-q-${q.id}`}
                  className="sr-only peer"
                  onChange={() => handleValueChange(q.id, item.val)}
                  checked={answers[q.id]?.value === item.val}
                />
                <div className="text-3xl md:text-5xl transition-all duration-200 group-hover/likert:scale-125 grayscale hover:grayscale-0 peer-checked:grayscale-0 peer-checked:scale-125">
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
              <label key={item.val} className="flex flex-col items-center gap-3 cursor-pointer group/likert">
                <input 
                  type="radio" 
                  name={`preview-q-${q.id}`}
                  className="sr-only peer"
                  onChange={() => handleValueChange(q.id, item.val)}
                  checked={answers[q.id]?.value === item.val}
                />
                <div className="text-3xl md:text-5xl transition-all duration-200 group-hover/likert:scale-125 opacity-40 hover:opacity-100 peer-checked:opacity-100 peer-checked:scale-125">
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
              <label key={item.val} className="flex flex-col items-center gap-3 cursor-pointer group/emoji">
                <input 
                  type="radio" 
                  name={`preview-q-${q.id}`}
                  className="sr-only peer"
                  onChange={() => handleValueChange(q.id, item.val)}
                  checked={answers[q.id]?.value === item.val}
                />
                <div className="text-4xl md:text-5xl transition-transform duration-200 group-hover/emoji:scale-125 grayscale hover:grayscale-0 peer-checked:grayscale-0 peer-checked:scale-125">
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
              className="w-full h-2 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-secondary"
              value={answers[q.id]?.value || 5}
              onChange={(e) => handleValueChange(q.id, parseInt(e.target.value))}
            />
            <div className="flex justify-between mt-6 px-1">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-on-surface">1</span>
                <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-semibold">{t('respondent.slider_min')}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-sm font-bold text-on-surface">10</span>
                <span className="text-[10px] uppercase tracking-tighter text-slate-500 font-semibold">{t('respondent.slider_max')}</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-on-background/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-surface w-full h-full max-w-6xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative border border-outline-variant/20">
        
        {/* Preview Banner */}
        <div className="bg-primary text-white py-2 px-6 flex items-center justify-between shadow-lg z-10">
          <div className="flex items-center gap-2">
            <div className="animate-pulse w-2 h-2 rounded-full bg-secondary-fixed"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t('respondent.preview_mode')}</span>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-[10px] font-bold transition-all"
          >
            <X className="w-3 h-3" />
            <span>{t('respondent.preview_exit')}</span>
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Mock Header from Respondent */}
          <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-8 h-16 w-full border-b border-outline-variant/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold tracking-tighter text-blue-800 font-headline">PulsoRH</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-1 text-slate-500 font-medium text-sm">
                <Lock className="w-4 h-4" />
                <span>{t('respondent.anonymous_response')}</span>
              </div>
              <div className="flex items-center gap-2">
                <HelpCircle className="text-slate-600 p-2 rounded-full w-9 h-9" />
                <Bell className="text-slate-600 p-2 rounded-full w-9 h-9" />
              </div>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <section className="mb-16">
              <div className="flex flex-col gap-4">
                <span className="text-secondary font-headline font-bold uppercase tracking-widest text-xs">{t('respondent.internal_survey')}</span>
                <h1 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl text-on-surface leading-tight tracking-tight">
                  {title || t('builder.survey_title')}
                </h1>
                <div className="mt-4 max-w-2xl">
                  <p className="text-on-surface-variant text-lg leading-relaxed">
                    {description || t('respondent.default_description')}
                  </p>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              {questions.map((q, index) => (
                <div key={q.id} className="bg-surface-container-lowest rounded-xl p-8 md:p-12 transition-all duration-300 border border-outline-variant/10">
                  <div className="flex flex-col gap-8">
                    <div className="flex items-start gap-4">
                      <span className="bg-primary-fixed text-primary px-3 py-1 rounded-lg font-bold font-headline text-sm">
                        {String(index+1).padStart(2, '0')}
                      </span>
                      <h2 className="font-headline font-bold text-2xl text-on-surface leading-snug">
                        {q.text || t('builder.question_placeholder')}
                      </h2>
                    </div>

                    {renderQuestionInput(q)}

                    {q.allowComment && (
                      <div className="relative mt-4">
                        <textarea 
                          className="w-full bg-surface-container-low border-0 rounded-xl p-6 font-body text-on-surface focus:ring-2 focus:ring-primary-container transition-all resize-none placeholder:text-slate-400" 
                          placeholder={t('respondent.comment_placeholder')}
                          rows={3}
                          value={answers[q.id]?.comment || ''}
                          onChange={(e) => handleCommentChange(q.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-12 pb-24 flex flex-col items-center gap-8">
                <div className="w-full h-px bg-surface-container-high max-w-xs"></div>
                <button 
                  type="button"
                  disabled
                  className="bg-signature-gradient flex items-center justify-center gap-4 py-6 px-12 rounded-xl shadow-xl opacity-50 cursor-not-allowed"
                >
                  <span className="font-headline font-extrabold text-xl text-white tracking-tight">{t('respondent.send_responses')}</span>
                  <Send className="text-white w-6 h-6" />
                </button>
                <div className="bg-primary/5 text-primary text-[10px] font-bold px-4 py-2 rounded-full border border-primary/20">
                  {t('respondent.preview_send_disabled')}
                </div>
                <p className="text-slate-400 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-secondary" />
                  {t('respondent.privacy_policy')}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Background Decorative */}
      <div className="fixed top-0 right-0 -z-10 w-1/2 h-1/2 bg-secondary-container/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-primary-container/10 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
};

export default PreviewModal;
