import React from 'react';
import { useSurveyStore } from '../store/useSurveyStore';
import Layout from '../components/Layout';
import { Calendar, Edit, Filter, Link, PlusCircle, Download } from 'lucide-react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { useState } from 'react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { surveys, getSurveyResponses, searchQuery, statusFilter, setStatusFilter } = useSurveyStore();
  const { t } = useLocaleStore();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const handleGenerateLink = (id: string) => {
    const url = `${window.location.origin}/responder/${id}`;
    navigator.clipboard.writeText(url);
    alert(t('dashboard.generate_link_success'));
  };

  const handleExportCSV = (surveyId: string) => {
    const survey = surveys.find(s => s.id === surveyId);
    const responses = getSurveyResponses(surveyId);
    
    if (!survey || responses.length === 0) {
      alert(t('dashboard.no_responses_error'));
      return;
    }

    const headers = ['ID', 'Question_ID', 'Value', 'Comment', 'CreatedAt'];
    const csvContent = [
      headers.join(','),
      ...responses.map(r => [
        r.id,
        r.questionId,
        `"${r.value}"`,
        `"${r.comment || ''}"`,
        r.createdAt
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `respostas_${survey.title.replace(/\s+/g, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const getStatus = (survey: any) => {
    if (survey.isActive === false) return 'inactive';
    const today = startOfDay(new Date());
    const open = parseISO(survey.openDate);
    const close = endOfDay(parseISO(survey.closeDate));
    return isWithinInterval(today, { start: open, end: close }) ? 'open' : 'closed';
  };

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase());
    const surveyStatus = getStatus(survey);
    const matchesStatus = statusFilter === 'all' || surveyStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <Layout title={t('sidebar.dashboard')}>
      {/* Header Actions */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="max-w-2xl">
          <p className="text-primary font-semibold tracking-wider uppercase text-xs mb-2">{t('dashboard.operational_overview')}</p>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
            {t('dashboard.title').split('{org}')[0]}
            <span className="text-primary italic">{t('dashboard.org_highlight')}</span>
            {t('dashboard.title').split('{org}')[1]}
          </h2>
        </div>
        <div className="flex space-x-3 relative">
          <div className="relative">
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className="bg-white text-primary border border-primary/10 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-sm hover:bg-surface-container-low transition-all"
            >
              <Filter className="w-5 h-5" />
              <span>{t('dashboard.filter')}</span>
              {statusFilter !== 'all' && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              )}
            </button>
            
            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-outline-variant/20 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-2 space-y-1">
                  {[
                    { id: 'all', label: t('dashboard.filter_all') },
                    { id: 'open', label: t('dashboard.filter_open') },
                    { id: 'closed', label: t('dashboard.filter_closed') },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setStatusFilter(option.id as any);
                        setIsFilterMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                        statusFilter === option.id 
                          ? 'bg-primary text-white' 
                          : 'text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <RouterLink 
            to="/builder"
            className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t('dashboard.create_new')}</span>
          </RouterLink>
        </div>
      </div>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        {filteredSurveys.map((survey) => {
          const status = getStatus(survey);
          const isActive = status === 'open';
          const isInactive = status === 'inactive';
          
          return (
            <div key={survey.id} className={`group rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
              isInactive ? 'bg-surface-container-low opacity-80' : 'bg-surface-container-lowest'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container' 
                    : isInactive
                      ? 'bg-slate-200 text-slate-600'
                      : 'bg-surface-container-high text-on-surface-variant'
                }`}>
                  {isActive ? t('dashboard.status_open') : isInactive ? t('dashboard.status_inactive') : t('dashboard.filter_closed')}
                </span>
              <div className="flex space-x-1">
                <button 
                  onClick={() => navigate(`/builder/${survey.id}`)}
                  className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                  title={t('dashboard.edit_survey')}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleExportCSV(survey.id)}
                  className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors"
                  title={t('dashboard.export_responses')}
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                {survey.title}
              </h3>
              <div className="flex items-center text-xs text-on-surface-variant">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{t('dashboard.last_response')}: {t('common.today')}, 14:20</span>
              </div>
            </div>

            {(() => {
              const currentResponses = getSurveyResponses(survey.id).length;
              const totalExpected = survey.expectedResponses || 1; // Fallback to avoid division by zero
              const percentage = Math.min(Math.round((currentResponses / totalExpected) * 100), 100);
              const circumference = 176;
              const offset = circumference - (percentage / 100) * circumference;

              return (
                <div key={`progress-${survey.id}`}>
                  <div className="flex items-center space-x-6 mb-8">
                    {/* Progress Circle Dynamic */}
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle className="text-surface-container-high" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="6"></circle>
                        <circle 
                          className="text-secondary transition-all duration-1000 ease-out" 
                          cx="32" cy="32" 
                          fill="transparent" 
                          r="28" 
                          stroke="currentColor" 
                          strokeDasharray={circumference} 
                          strokeDashoffset={offset} 
                          strokeWidth="6"
                          strokeLinecap="round"
                        ></circle>
                      </svg>
                      <span className="absolute text-sm font-bold text-on-surface">{percentage}%</span>
                    </div>
                    <div>
                      <p className="text-2xl font-black text-on-surface">
                        {currentResponses.toLocaleString()}
                      </p>
                      <p className="text-xs text-on-surface-variant font-medium">{t('dashboard.responses_collected')}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            <button 
              onClick={() => handleGenerateLink(survey.id)}
              className="w-full py-4 bg-primary-container/10 text-primary rounded-2xl font-bold flex items-center justify-center space-x-2 group-hover:bg-primary group-hover:text-white transition-all"
            >
              <Link className="w-5 h-5" />
              <span>{t('dashboard.generate_link')}</span>
            </button>
          </div>
          );
        })}

        {/* Action Card */}
        <RouterLink 
          to="/builder"
          className="group bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/50 transition-all"
        >
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
            <PlusCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-on-surface">{t('dashboard.launch_title')}</h3>
            <p className="text-sm text-on-surface-variant px-8">{t('dashboard.launch_description')}</p>
          </div>
          <span className="text-primary font-bold text-sm flex items-center">
            {t('dashboard.get_started')}
            <span className="material-symbols-outlined ml-1">arrow_forward</span>
          </span>
        </RouterLink>
      </div>
    </Layout>
  );
};

export default Dashboard;
