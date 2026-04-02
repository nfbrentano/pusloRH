import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useSurveys } from '../hooks/useSurveys';
import { useSurveyStore } from '../store/useSurveyStore';
import Layout from '../components/Layout';
import type { Survey } from '../types';
import {
  Calendar,
  Edit,
  Filter,
  Link,
  PlusCircle,
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useLocaleStore } from '../store/useLocaleStore';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: surveys = [], isLoading, isError } = useSurveys();
  const { searchQuery, statusFilter, setStatusFilter } = useSurveyStore();
  const { t } = useLocaleStore();
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const handleGenerateLink = (id: string) => {
    const url = `${window.location.origin}/responder/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copiado para a área de transferência!');
  };

  const handleExportCSV = () => {
    // In a real app, we might fetch responses from backend here.
    // For now, keep it simple or show a "Coming Soon" for real CSV if responses aren't in memory.
    alert('Exportação de dados reais em desenvolvimento.');
  };

  const getStatus = (survey: Survey): 'open' | 'closed' | 'inactive' => {
    if (survey.isActive === false) return 'inactive';
    const today = startOfDay(new Date());
    const open = parseISO(survey.openDate);
    const close = endOfDay(parseISO(survey.closeDate));
    return isWithinInterval(today, { start: open, end: close }) ? 'open' : 'closed';
  };

  const filteredSurveys = (surveys as Survey[]).filter((survey: Survey) => {
    const status = getStatus(survey);
    if (!isAdmin) {
      return status === 'open';
    }
    const matchesSearch = survey.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <Layout title={t('sidebar.dashboard')}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-on-surface-variant font-bold animate-pulse">
            Carregando seus pulsos corporativos...
          </p>
        </div>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout title={t('sidebar.dashboard')}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-error-container/10 rounded-3xl border border-error/20">
          <AlertCircle className="w-16 h-16 text-error mb-4" />
          <h3 className="text-2xl font-bold text-on-surface mb-2">Erro de Conexão</h3>
          <p className="text-on-surface-variant max-w-md">
            Não foi possível conectar ao servidor. Verifique se o backend está rodando em
            http://localhost:3001.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t('sidebar.dashboard')}>
      {/* Header Actions */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="max-w-2xl">
          <p className="text-primary font-semibold tracking-wider uppercase text-xs mb-2">
            {isAdmin ? t('dashboard.operational_overview') : 'Seu Painel de Colaborador'}
          </p>
          <h2 className="text-4xl font-extrabold text-on-surface tracking-tight leading-tight">
            {isAdmin ? (
              <>
                {t('dashboard.title').split('{org}')[0]}
                <span className="text-primary italic">{t('dashboard.org_highlight')}</span>
                {t('dashboard.title').split('{org}')[1]}
              </>
            ) : (
              <>
                Como está o seu <span className="text-primary italic">pulso</span> hoje?
              </>
            )}
          </h2>
        </div>

        {isAdmin && (
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
                          setStatusFilter(option.id as 'all' | 'open' | 'closed');
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
        )}
      </div>

      {/* Surveys Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 px-4">
        {filteredSurveys.map((survey) => {
          const status = getStatus(survey);
          const isActive = status === 'open';
          const isInactive = status === 'inactive';

          if (isAdmin) {
            return (
              <div
                key={survey.id}
                className={`group rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                  isInactive ? 'bg-surface-container-low opacity-80' : 'bg-surface-container-lowest'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-secondary-container text-on-secondary-container'
                        : isInactive
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-surface-container-high text-on-surface-variant'
                    }`}
                  >
                    {isActive
                      ? t('dashboard.status_open')
                      : isInactive
                        ? t('dashboard.status_inactive')
                        : t('dashboard.filter_closed')}
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
                      onClick={() => handleExportCSV()}
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
                    <span>Início: {parseISO(survey.openDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {(() => {
                  // In a real app, stats would come from backend
                  const currentResponses = 0; // Simplified for now
                  const totalExpected = survey.expectedResponses || 1;
                  const percentage = Math.min(
                    Math.round((currentResponses / totalExpected) * 100),
                    100
                  );
                  const circumference = 176;
                  const offset = circumference - (percentage / 100) * circumference;

                  return (
                    <div key={`progress-${survey.id}`}>
                      <div className="flex items-center space-x-6 mb-8">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              className="text-surface-container-high"
                              cx="32"
                              cy="32"
                              fill="transparent"
                              r="28"
                              stroke="currentColor"
                              strokeWidth="6"
                            ></circle>
                            <circle
                              className="text-secondary transition-all duration-1000 ease-out"
                              cx="32"
                              cy="32"
                              fill="transparent"
                              r="28"
                              stroke="currentColor"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              strokeWidth="6"
                              strokeLinecap="round"
                            ></circle>
                          </svg>
                          <span className="absolute text-sm font-bold text-on-surface">
                            {percentage}%
                          </span>
                        </div>
                        <div>
                          <p className="text-2xl font-black text-on-surface">
                            {currentResponses.toLocaleString()}
                          </p>
                          <p className="text-xs text-on-surface-variant font-medium">
                            {t('dashboard.responses_collected')}
                          </p>
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
          } else {
            // USER VIEW: Simplified card for responding
            return (
              <div
                key={survey.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex flex-col"
              >
                <div className="mb-6 flex justify-between items-center">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Disponível
                    </span>
                  </div>
                </div>

                <div className="mb-10 flex-1">
                  <h3 className="text-xl font-black text-on-surface mb-2 font-headline group-hover:text-primary transition-colors">
                    {survey.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 font-medium">
                    {survey.description ||
                      'Sua opinião é fundamental para construirmos uma empresa melhor.'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Prazo: {parseISO(survey.closeDate).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/responder/${survey.id}`)}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Responder Agora</span>
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          }
        })}

        {isAdmin && (
          <RouterLink
            to="/builder"
            className="group bg-surface-container-low border-2 border-dashed border-outline-variant/30 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
              <PlusCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-on-surface">{t('dashboard.launch_title')}</h3>
              <p className="text-sm text-on-surface-variant px-8">
                {t('dashboard.launch_description')}
              </p>
            </div>
            <span className="text-primary font-bold text-sm flex items-center">
              {t('dashboard.get_started')}
              <span className="material-symbols-outlined ml-1">arrow_forward</span>
            </span>
          </RouterLink>
        )}
      </div>
    </Layout>
  );
};

// Helper component for USER view icon
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export default Dashboard;
