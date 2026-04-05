import React from 'react';
import type { Question } from '../../types';
import { useLocaleStore } from '../../store/useLocaleStore';
import QuestionInput from '../SurveyQuestion/QuestionInput';

interface QuestionResponseCardProps {
  question: Question;
  index: number;
  value?: string | number;
  comment?: string;
  onValueChange: (value: string | number) => void;
  onCommentChange: (comment: string) => void;
}

const QuestionResponseCard: React.FC<QuestionResponseCardProps> = ({
  question,
  index,
  value,
  comment,
  onValueChange,
  onCommentChange,
}) => {
  const { t } = useLocaleStore();

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 transition-all duration-300 hover:shadow-lg group">
      <div className="flex flex-col gap-8">
        <div className="flex items-start gap-4">
          <span className="bg-primary-fixed text-primary px-3 py-1 rounded-lg font-bold font-headline text-sm">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h2 className="font-headline font-bold text-2xl text-on-surface leading-snug">
            {question.text}
          </h2>
        </div>

        <QuestionInput type={question.type} value={value} onChange={onValueChange} />

        {question.allowComment && (
          <div className="relative mt-4">
            <textarea
              id={`comment-${question.id}`}
              name={`comment-${question.id}`}
              className="w-full bg-surface-container-low border-0 rounded-xl p-6 font-body text-on-surface focus:ring-2 focus:ring-primary-container transition-all resize-none placeholder:text-slate-400"
              placeholder={t('respondent.comment_placeholder')}
              rows={3}
              value={comment || ''}
              onChange={(e) => onCommentChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionResponseCard;
