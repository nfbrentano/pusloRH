import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSurveyStore } from '../store/useSurveyStore';
import { ShieldCheck, HelpCircle, Bell, Send, CheckCircle2, Lock } from 'lucide-react';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { useLocaleStore } from '../store/useLocaleStore';

const Respondent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { surveys, questions, addResponse } = useSurveyStore();
  const { t } = useLocaleStore();
  
  const survey = surveys.find(s => s.id === id);
  const surveyQuestions = questions.filter(q => q.surveyId === id);
  
  const [answers, setAnswers] = useState<Record<string, { value: any, comment?: string }>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!survey) {
    return <div className="p-20 text-center font-headline text-2xl">{t('respondent.not_found')}</div>;
  }

  // Date Validation
  const today = startOfDay(new Date());
  const open = parseISO(survey.openDate);
  const close = endOfDay(parseISO(survey.closeDate));
  
  const isActive = isWithinInterval(today, { start: open, end: close });

  if (!isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="bg-surface-container-lowest p-12 rounded-[2.5rem] shadow-xl max-w-lg text-center space-y-6">
          <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold font-headline text-on-surface">{t('respondent.out_of_date')}</h2>
          <p className="text-on-surface-variant text-lg">
            {t('respondent.out_of_date_description')}
          </p>
          <p className="text-sm text-slate-400">
            {t('respondent.period')}: {survey.openDate} {t('respondent.survey_to_date') || 'até'} {survey.closeDate}
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="bg-surface-container-lowest p-12 rounded-[2.5rem] shadow-xl max-w-lg text-center space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-secondary-container text-secondary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold font-headline text-on-surface">{t('respondent.success_title')}</h2>
          <p className="text-on-surface-variant text-lg">
            {t('respondent.success_message')}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary font-bold hover:underline"
          >
            {t('respondent.send_another')}
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(answers).forEach(([qId, data]) => {
      addResponse({
        surveyId: id!,
        questionId: qId,
        value: data.value,
        comment: data.comment
      });
    });
    setSubmitted(true);
  };

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

  return (
    <div className="bg-surface font-body text-on-surface antialiased">
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-8 h-16 w-full shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold tracking-tighter text-blue-800 font-headline">PulsoRH</span>
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

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <section className="mb-16">
          <div className="flex flex-col gap-4">
            <span className="text-secondary font-headline font-bold uppercase tracking-widest text-xs">{t('respondent.internal_survey')}</span>
            <h1 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl text-on-surface leading-tight tracking-tight">
              {survey.title}
            </h1>
            <div className="mt-4 max-w-2xl">
              <p className="text-on-surface-variant text-lg leading-relaxed">
                {survey.description || t('respondent.default_description')}
              </p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="space-y-8">
          {surveyQuestions.map((q, index) => (
            <div key={q.id} className="bg-surface-container-lowest rounded-xl p-8 md:p-12 transition-all duration-300 hover:shadow-lg group">
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <span className="bg-primary-fixed text-primary px-3 py-1 rounded-lg font-bold font-headline text-sm">
                    {String(index+1).padStart(2, '0')}
                  </span>
                  <h2 className="font-headline font-bold text-2xl text-on-surface leading-snug">
                    {q.text}
                  </h2>
                </div>

                {q.type === 'Emoticons' ? (
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
                          name={`q-${q.id}`}
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
                ) : (
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
                )}

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
              onClick={handleSubmit}
              className="bg-signature-gradient group flex items-center justify-center gap-4 py-6 px-12 rounded-xl shadow-xl hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <span className="font-headline font-extrabold text-xl text-white tracking-tight">{t('respondent.send_responses')}</span>
              <Send className="text-white w-6 h-6 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-secondary" />
              {t('respondent.privacy_policy')}
            </p>
          </div>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-2 bg-signature-gradient"></div>
      {/* Decorative Blur Backgrounds */}
      <div className="fixed top-0 right-0 -z-10 w-1/2 h-1/2 bg-secondary-container/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-1/3 h-1/3 bg-primary-container/10 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
};

export default Respondent;
