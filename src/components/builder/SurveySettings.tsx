import React from 'react';
import { Settings as SettingsIcon, Calendar, Plus } from 'lucide-react';
import { useLocaleStore } from '../../store/useLocaleStore';

interface SurveySettingsProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  openDate: string;
  setOpenDate: (val: string) => void;
  closeDate: string;
  setCloseDate: (val: string) => void;
  expectedResponses: number;
  setExpectedResponses: (val: number) => void;
}

const SurveySettings: React.FC<SurveySettingsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  openDate,
  setOpenDate,
  closeDate,
  setCloseDate,
  expectedResponses,
  setExpectedResponses,
}) => {
  const { t } = useLocaleStore();

  return (
    <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6 shadow-sm border border-outline-variant/15">
      <div className="flex items-center gap-3 border-b border-surface-container pb-4">
        <SettingsIcon className="text-primary w-5 h-5" />
        <h3 className="text-lg font-bold font-headline text-on-surface">
          {t('builder.general_settings')}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full">
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">
            {t('builder.survey_title')}
          </label>
          <input
            id="survey-title"
            name="survey-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20"
            placeholder={t('builder.survey_title_placeholder')}
          />
        </div>
        <div className="col-span-full">
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">
            {t('builder.description')}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20"
            placeholder={t('builder.description_placeholder')}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">
            {t('builder.open_date')}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="date"
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">
            {t('builder.close_date')}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="date"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface-variant mb-2">
            {t('builder.expected_responses')}
          </label>
          <div className="relative">
            <Plus className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
            <input
              type="number"
              value={expectedResponses || ''}
              onChange={(e) => setExpectedResponses(Number(e.target.value))}
              className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-primary/20"
              placeholder={t('builder.expected_placeholder')}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SurveySettings;
