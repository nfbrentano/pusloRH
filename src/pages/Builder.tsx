import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSurvey, useCreateSurvey, useUpdateSurvey } from '../hooks/useSurveys';
import type { Question, SurveyInput, Survey, QuestionType } from '../types';
import Layout from '../components/Layout';
import { useLocaleStore } from '../store/useLocaleStore';
import { Plus, Loader2 } from 'lucide-react';
import PreviewModal from '../components/PreviewModal';
import BuilderHeader from '../components/builder/BuilderHeader';
import SurveySettings from '../components/builder/SurveySettings';
import QuestionEditorCard from '../components/builder/QuestionEditorCard';

const Builder: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t } = useLocaleStore();

  const { data: existingSurvey, isLoading } = useSurvey(id || null);
  const createMutation = useCreateSurvey();
  const updateMutation = useUpdateSurvey(id!);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState<
    Omit<Survey, 'id' | 'createdAt' | 'questions'> & {
      questions: (Omit<Question, 'surveyId'> & { type: QuestionType })[];
    }
  >(() => ({
    title: '',
    description: '',
    openDate: '',
    closeDate: '',
    expectedResponses: 0,
    isActive: true,
    questions: [
      {
        id: Math.random().toString(36).substr(2, 9),
        text: '',
        type: 'Emoticons',
        allowComment: true,
      },
    ],
  }));

  const hasInitialized = useRef(false);

  // Sync with fetched data
  useEffect(() => {
    if (existingSurvey && !hasInitialized.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: existingSurvey.title,
        description: existingSurvey.description,
        openDate: existingSurvey.openDate,
        closeDate: existingSurvey.closeDate,
        expectedResponses: existingSurvey.expectedResponses,
        isActive: existingSurvey.isActive,
        questions: (existingSurvey.questions || []).map((q) => ({
          ...q,
          type: q.type as QuestionType,
        })),
      });
      hasInitialized.current = true;
    } else if (!id && !hasInitialized.current) {
      hasInitialized.current = true;
    }
  }, [existingSurvey, id]);

  const updateField = <K extends keyof typeof formData>(field: K, value: (typeof formData)[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: Math.random().toString(36).substr(2, 9),
          text: '',
          type: 'Emoticons',
          allowComment: false,
        },
      ],
    }));
  };

  const removeQuestion = (qId: string) => {
    if (formData.questions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        questions: prev.questions.filter((q) => q.id !== qId),
      }));
    }
  };

  const updateQuestion = (qId: string, updates: Partial<Omit<Question, 'surveyId'>>) => {
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === qId ? { ...q, ...updates } : q)),
    }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.openDate || !formData.closeDate) {
      alert(t('builder.validation_error') || 'Por favor preencha o título e as datas.');
      return;
    }

    const payload: SurveyInput = {
      title: formData.title,
      description: formData.description,
      openDate: formData.openDate,
      closeDate: formData.closeDate,
      expectedResponses: formData.expectedResponses,
      isActive: formData.isActive,
      questions: formData.questions.map(({ text, type, allowComment }) => ({
        text,
        type,
        allowComment,
      })),
    };

    try {
      if (id) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      navigate('/dashboard');
    } catch {
      alert('Erro ao salvar pesquisa.');
    }
  };

  if (id && isLoading) {
    return (
      <Layout title={t('builder.edit_title')}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="font-bold">Carregando dados da pesquisa...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={id ? t('builder.edit_title') : t('builder.new_title')}>
      <BuilderHeader
        id={id}
        isActive={formData.isActive}
        setIsActive={(val) => updateField('isActive', val)}
        onPreview={() => setIsPreviewOpen(true)}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      <div className="max-w-4xl mx-auto px-8 py-10 space-y-8">
        <SurveySettings
          title={formData.title}
          setTitle={(val) => updateField('title', val)}
          description={formData.description}
          setDescription={(val) => updateField('description', val)}
          openDate={formData.openDate}
          setOpenDate={(val) => updateField('openDate', val)}
          closeDate={formData.closeDate}
          setCloseDate={(val) => updateField('closeDate', val)}
          expectedResponses={formData.expectedResponses}
          setExpectedResponses={(val) => updateField('expectedResponses', val)}
        />

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold font-headline text-on-surface">Perguntas</h3>
            <span className="text-sm font-medium text-slate-500">
              {t('builder.total_questions', { count: formData.questions.length })}
            </span>
          </div>

          {formData.questions.map((q, index) => (
            <QuestionEditorCard
              key={q.id}
              question={q}
              index={index}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
            />
          ))}

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
        title={formData.title}
        description={formData.description}
        questions={formData.questions}
      />
    </Layout>
  );
};

export default Builder;
