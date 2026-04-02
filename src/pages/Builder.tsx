import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSurveyStore } from '../store/useSurveyStore';
import type { Question } from '../store/useSurveyStore';
import Layout from '../components/Layout';
import { useLocaleStore } from '../store/useLocaleStore';
import { 
  Calendar, 
  Trash2, 
  Plus, 
  Settings as SettingsIcon, 
  Save, 
  Eye, 
  MessageSquare,
  Smile,
  SlidersHorizontal,
  X
} from 'lucide-react';
import PreviewModal from '../components/PreviewModal';

const Builder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { surveys, questions: allQuestions, addSurvey, updateSurvey } = useSurveyStore();
  const { t } = useLocaleStore();

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Initial State for a new survey
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [openDate, setOpenDate] = useState('');
  const [closeDate, setCloseDate] = useState('');
  const [expectedResponses, setExpectedResponses] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  
  const [questions, setQuestions] = useState<Omit<Question, 'surveyId'>[]>([
    {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      type: 'Emoticons',
      allowComment: true,
    }
  ]);

  // Load existing survey if editing
  useEffect(() => {
    if (id) {
      const existingSurvey = surveys.find(s => s.id === id);
      const existingQuestions = allQuestions.filter(q => q.surveyId === id);
      
      if (existingSurvey) {
        setTitle(existingSurvey.title);
        setDescription(existingSurvey.description);
        setOpenDate(existingSurvey.openDate);
        setCloseDate(existingSurvey.closeDate);
        setExpectedResponses(existingSurvey.expectedResponses || 0);
        setIsActive(existingSurvey.isActive !== false); // Default to true
        
        if (existingQuestions.length > 0) {
          setQuestions(existingQuestions.map(({ surveyId, ...q }) => q));
        }
      }
    }
  }, [id, surveys, allQuestions]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Math.random().toString(36).substr(2, 9),
        text: '',
        type: 'Emoticons',
        allowComment: false,
      }
    ]);
  };

  const removeQuestion = (qId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== qId));
    }
  };

  const updateQuestion = (qId: string, updates: Partial<Omit<Question, 'surveyId'>>) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, ...updates } : q));
  };

  const handleSave = () => {
    if (!title || !openDate || !closeDate) {
      alert(t('builder.validation_error') || 'Por favor preencha o título e as datas.');
      return;
    }

    if (id) {
      updateSurvey(id, { title, description, openDate, closeDate, expectedResponses, isActive }, questions);
    } else {
      const newSurvey = {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        openDate,
        closeDate,
        expectedResponses,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      addSurvey(newSurvey, questions);
    }
    
    navigate('/dashboard');
  };

  return (
    <Layout title={id ? t('builder.edit_title') : t('builder.new_title')}>
      {/* Top Bar for Builder */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-surface/80 backdrop-blur-md md:pl-72 pointer-events-none">
        <div className="flex items-center gap-4 ml-auto pointer-events-auto">
          {id && (
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium border ${
                isActive 
                  ? 'text-slate-500 border-outline-variant/30 hover:bg-slate-50' 
                  : 'text-success bg-success/5 border-success/20 hover:bg-success/10'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-error' : 'bg-success animate-pulse'}`}></div>
              <span>{isActive ? t('builder.inactivate_survey') : t('builder.activate_survey')}</span>
            </button>
          )}
          <button 
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 hover:text-error px-4 py-2 rounded-lg transition-all font-medium hover:bg-error/5"
          >
            <X className="w-5 h-5" />
            <span>{t('common.cancel')}</span>
          </button>
          <button 
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="flex items-center gap-2 text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors font-medium border border-outline-variant/30 bg-white/50"
          >
            <Eye className="w-5 h-5" />
            <span>{t('common.preview')}</span>
          </button>
          <button 
            type="button"
            onClick={handleSave}
            className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{id ? t('builder.save_changes') : t('builder.save_new')}</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        {/* General Settings */}
        <section className="bg-surface-container-lowest rounded-xl p-8 space-y-6 shadow-sm border border-outline-variant/15">
          <div className="flex items-center gap-3 border-b border-surface-container pb-4">
            <SettingsIcon className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold font-headline text-on-surface">{t('builder.general_settings')}</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-full">
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">{t('builder.survey_title')}</label>
              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20" 
                placeholder={t('builder.survey_title_placeholder')}
              />
            </div>
            <div className="col-span-full">
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">{t('builder.description')}</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary/20" 
                placeholder={t('builder.description_placeholder')}
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">{t('builder.open_date')}</label>
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
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">{t('builder.close_date')}</label>
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
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">{t('builder.expected_responses')}</label>
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

        {/* Question Area */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-headline text-on-surface">Perguntas</h3>
            <span className="text-sm font-medium text-slate-500">{t('builder.total_questions', { count: questions.length })}</span>
          </div>

          {questions.map((q, index) => (
            <div key={q.id} className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/15 group relative">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-full hidden group-focus-within:block group-hover:block transition-all"></div>
              
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex-grow">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-primary mb-2">
                    {t('builder.question_label')} {String(index + 1).padStart(2, '0')}
                  </label>
                  <input 
                    value={q.text}
                    onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                    className="w-full text-lg font-semibold bg-transparent border-none p-0 focus:ring-0 text-on-surface placeholder:text-slate-300" 
                    placeholder={t('builder.question_placeholder')}
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="text-slate-300 hover:text-error transition-colors p-2 rounded-lg hover:bg-error-container/20"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-3">{t('builder.response_type')}</label>
                  <div className="flex bg-surface-container-low p-1 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => updateQuestion(q.id, { type: 'Emoticons' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                        q.type === 'Emoticons' ? 'bg-white shadow-sm text-primary font-bold' : 'text-slate-500 font-medium'
                      }`}
                    >
                      <Smile className="w-5 h-5" />
                      <span>Emoticons</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => updateQuestion(q.id, { type: 'Slider' })}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all ${
                        q.type === 'Slider' ? 'bg-white shadow-sm text-primary font-bold' : 'text-slate-500 font-medium'
                      }`}
                    >
                      <SlidersHorizontal className="w-5 h-5" />
                      <span>Slider</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-surface-container-low/50 px-5 py-3 rounded-xl border border-dashed border-outline-variant/30">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="text-slate-400 w-5 h-5" />
                    <span className="text-sm font-semibold text-on-surface-variant">{t('builder.allow_comment')}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={q.allowComment}
                      onChange={(e) => updateQuestion(q.id, { allowComment: e.target.checked })}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Question Button */}
          <button 
            type="button"
            onClick={addQuestion}
            className="w-full py-8 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm">+ {t('builder.add_question')}</span>
          </button>
        </section>
      </div>

      <PreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        description={description}
        questions={questions}
      />
    </Layout>
  );
};

export default Builder;
