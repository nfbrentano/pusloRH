import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type QuestionType = 'Emoticons' | 'Slider' | 'Binary' | 'LikertAgreement' | 'LikertFrequency';

export interface Question {
  id: string;
  surveyId: string;
  text: string;
  type: QuestionType;
  allowComment: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  openDate: string;
  closeDate: string;
  expectedResponses: number;
  isActive: boolean;
  createdAt: string;
}

export interface Response {
  id: string;
  surveyId: string;
  questionId: string;
  value: number | string;
  comment?: string;
  createdAt: string;
}

interface SurveyState {
  surveys: Survey[];
  questions: Question[];
  responses: Response[];
  searchQuery: string;
  statusFilter: 'all' | 'open' | 'closed';
  
  // Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: 'all' | 'open' | 'closed') => void;
  addSurvey: (survey: Survey, questions: Omit<Question, 'surveyId'>[]) => void;
  deleteSurvey: (id: string) => void;
  addResponse: (response: Omit<Response, 'id' | 'createdAt'>) => void;
  getSurveyResponses: (surveyId: string) => Response[];
  getSurveyQuestions: (surveyId: string) => Question[];
  updateSurvey: (id: string, survey: Partial<Survey>, questions: Omit<Question, 'surveyId'>[]) => void;
}

export const useSurveyStore = create<SurveyState>()(
  persist(
    (set, get) => ({
      surveys: [
        {
          id: '1',
          title: 'Engajamento Semestral 2026',
          description: 'Pesquisa para medir o nível de satisfação e engajamento dos colaboradores.',
          openDate: '2026-01-01',
          closeDate: '2026-12-31',
          expectedResponses: 1500,
          isActive: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Clima Organizacional Q1',
          description: 'Avaliação trimestral do clima e cultura da empresa.',
          openDate: '2026-01-01',
          closeDate: '2026-04-30',
          expectedResponses: 1000,
          isActive: true,
          createdAt: new Date().toISOString(),
        }
      ],
      questions: [
        {
          id: 'q1',
          surveyId: '1',
          text: 'Como você se sente em relação ao seu equilíbrio entre vida pessoal e profissional hoje?',
          type: 'Emoticons',
          allowComment: true,
        },
        {
          id: 'q2',
          surveyId: '1',
          text: '"Recebo feedback construtivo e recorrente da minha liderança direta."',
          type: 'Slider',
          allowComment: false,
        }
      ],
      responses: [],
      searchQuery: '',
      statusFilter: 'all',

      setSearchQuery: (query) => set({ searchQuery: query }),
      setStatusFilter: (status) => set({ statusFilter: status }),

      addSurvey: (survey, questionsData) => {
        const newQuestions = questionsData.map(q => ({
          ...q,
          surveyId: survey.id
        }));
        const newSurvey = {
          ...survey,
          isActive: survey.isActive ?? true,
        };
        set((state) => ({
          surveys: [newSurvey, ...state.surveys],
          questions: [...state.questions, ...newQuestions]
        }));
      },

      deleteSurvey: (id) => set((state) => ({
        surveys: state.surveys.filter(s => s.id !== id),
        questions: state.questions.filter(q => q.surveyId !== id),
        responses: state.responses.filter(r => r.surveyId !== id)
      })),

      addResponse: (responseData) => {
        const newResponse: Response = {
          ...responseData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          responses: [...state.responses, newResponse]
        }));
      },

      getSurveyResponses: (surveyId) => {
        return get().responses.filter(r => r.surveyId === surveyId);
      },

      getSurveyQuestions: (surveyId) => {
        return get().questions.filter(q => q.surveyId === surveyId);
      },

      updateSurvey: (id, surveyData, questionsData) => {
        set((state) => ({
          surveys: state.surveys.map(s => s.id === id ? { ...s, ...surveyData } : s),
          questions: [
            ...state.questions.filter(q => q.surveyId !== id),
            ...questionsData.map(q => ({ ...q, surveyId: id }))
          ]
        }));
      }
    }),
    {
      name: 'pulso-rh-storage',
    }
  )
);
