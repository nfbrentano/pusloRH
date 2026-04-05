import React, { useState } from 'react';
import type { Question } from '../types';
import { X, Send, ShieldCheck, Lock, HelpCircle, Bell } from 'lucide-react';
import { useLocaleStore } from '../store/useLocaleStore';
import RespondentField from './survey/RespondentField';

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
  questions,
}) => {
  const { t } = useLocaleStore();
  const [answers, setAnswers] = useState<Record<string, { value: unknown; comment?: string }>>({});

  if (!isOpen) return null;

  const handleValueChange = (qId: string, value: unknown) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], value },
    }));
  };

  const handleCommentChange = (qId: string, comment: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], comment },
    }));
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-on-background/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-surface w-full h-full max-w-6xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden relative border border-outline-variant/20">
        {/* Preview Banner */}
        <div className="bg-primary text-white py-2 px-6 flex items-center justify-between shadow-lg z-10">
          <div className="flex items-center gap-2">
            <div className="animate-pulse w-2 h-2 rounded-full bg-secondary-fixed"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {t('respondent.preview_mode')}
            </span>
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
                <HelpCircle className="text-slate-600 p-2 rounded-full w-9 h-9" />
                <Bell className="text-slate-600 p-2 rounded-full w-9 h-9" />
              </div>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
            <section className="mb-16">
              <div className="flex flex-col gap-4">
                <span className="text-secondary font-headline font-bold uppercase tracking-widest text-xs">
                  {t('respondent.internal_survey')}
                </span>
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
                <RespondentField
                  key={q.id}
                  index={index}
                  question={q as Question}
                  value={answers[q.id]?.value as string | number}
                  comment={answers[q.id]?.comment}
                  onValueChange={(val) => handleValueChange(q.id, val)}
                  onCommentChange={(comment) => handleCommentChange(q.id, comment)}
                />
              ))}

              <div className="pt-12 pb-24 flex flex-col items-center gap-8">
                <div className="w-full h-px bg-surface-container-high max-w-xs"></div>
                <button
                  type="button"
                  disabled
                  className="bg-signature-gradient flex items-center justify-center gap-4 py-6 px-12 rounded-xl shadow-xl opacity-50 cursor-not-allowed"
                >
                  <span className="font-headline font-extrabold text-xl text-white tracking-tight">
                    {t('respondent.send_responses')}
                  </span>
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
