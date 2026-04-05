import React from 'react';
import { useLocaleStore } from '../../store/useLocaleStore';

interface SurveyIntroProps {
  title: string;
  description: string;
}

const SurveyIntro: React.FC<SurveyIntroProps> = ({ title, description }) => {
  const { t } = useLocaleStore();

  return (
    <section className="mb-16">
      <div className="flex flex-col gap-4">
        <span className="text-secondary font-headline font-bold uppercase tracking-widest text-xs">
          {t('respondent.internal_survey')}
        </span>
        <h1 className="font-headline font-extrabold text-4xl md:text-5xl lg:text-6xl text-on-surface leading-tight tracking-tight">
          {title}
        </h1>
        <div className="mt-4 max-w-2xl">
          <p className="text-on-surface-variant text-lg leading-relaxed">
            {description || t('respondent.default_description')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default SurveyIntro;
