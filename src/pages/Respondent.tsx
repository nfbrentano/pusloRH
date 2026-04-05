import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSurvey, useSubmitResponse } from '../hooks/useSurveys';
import type { Question } from '../types';
import { CheckCircle2, Lock, Loader2, AlertCircle } from 'lucide-react';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { useLocaleStore } from '../store/useLocaleStore';
import RespondentHeader from '../components/respondent/RespondentHeader';
import SurveyIntro from '../components/respondent/SurveyIntro';
import QuestionResponseCard from '../components/respondent/QuestionResponseCard';
import RespondentFooter from '../components/respondent/RespondentFooter';

const Respondent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: survey, isLoading, isError } = useSurvey(id || null);
  const submitMutation = useSubmitResponse();
  const { t } = useLocaleStore();

  const [answers, setAnswers] = useState<
    Record<string, { value: string | number; comment?: string }>
  >({});
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="font-bold text-on-surface-variant">Abrindo formulário de pesquisa...</p>
      </div>
    );
  }

  if (isError || !survey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-center p-8 space-y-6">
        <AlertCircle className="w-16 h-16 text-error" />
        <h2 className="text-3xl font-bold text-on-surface">{t('respondent.not_found')}</h2>
        <p className="text-on-surface-variant max-w-md">
          Não conseguimos encontrar esta pesquisa em nossa base de dados.
        </p>
      </div>
    );
  }

  // Date Validation
  const today = startOfDay(new Date());
  const open = parseISO(survey.openDate);
  const close = endOfDay(parseISO(survey.closeDate));

  const isActiveDate = isWithinInterval(today, { start: open, end: close });
  const isActuallyActive = survey.isActive !== false && isActiveDate;

  if (!isActuallyActive) {
    const isInactive = survey.isActive === false;
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <div className="bg-surface-container-lowest p-12 rounded-[2.5rem] shadow-xl max-w-lg text-center space-y-6">
          <div className="w-20 h-20 bg-error-container text-error rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-extrabold font-headline text-on-surface">
            {isInactive ? t('respondent.inactive_title') : t('respondent.out_of_date')}
          </h2>
          <p className="text-on-surface-variant text-lg">
            {isInactive
              ? t('respondent.inactive_description')
              : t('respondent.out_of_date_description')}
          </p>
          {!isInactive && (
            <p className="text-sm text-slate-400">
              {t('respondent.period')}: {survey.openDate} {t('respondent.survey_to_date') || 'até'}{' '}
              {survey.closeDate}
            </p>
          )}
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
          <h2 className="text-3xl font-extrabold font-headline text-on-surface">
            {t('respondent.success_title')}
          </h2>
          <p className="text-on-surface-variant text-lg">{t('respondent.success_message')}</p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedResponses = Object.entries(answers).map(([qId, data]) => ({
      questionId: qId,
      value: data.value,
      comment: data.comment,
    }));

    try {
      await submitMutation.mutateAsync({
        surveyId: id!,
        responses: formattedResponses,
      });
      setSubmitted(true);
    } catch {
      alert('Erro ao enviar respostas.');
    }
  };

  const handleValueChange = (qId: string, value: string | number) => {
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
    <div className="bg-surface font-body text-on-surface antialiased">
      <RespondentHeader />

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <SurveyIntro title={survey.title} description={survey.description} />

        <form onSubmit={handleSubmit} className="space-y-8">
          {(survey.questions || []).map((q: Question, index: number) => (
            <QuestionResponseCard
              key={q.id}
              question={q}
              index={index}
              value={answers[q.id]?.value}
              comment={answers[q.id]?.comment}
              onValueChange={(val) => handleValueChange(q.id, val)}
              onCommentChange={(comment) => handleCommentChange(q.id, comment)}
            />
          ))}

          <RespondentFooter onSubmit={handleSubmit} isPending={submitMutation.isPending} />
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
