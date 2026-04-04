import axios from 'axios';
import type { SurveyInput, ResponseInput } from '../types';
import { useAuthStore } from '../store/useAuthStore';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// Inject JWT token on every request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Surveys
export const getSurveys = async () => {
  const { data } = await api.get('/surveys');
  return data;
};

export const getSurvey = async (id: string) => {
  const { data } = await api.get(`/surveys/${id}`);
  return data;
};

export const createSurvey = async (surveyData: SurveyInput) => {
  const { data } = await api.post('/surveys', surveyData);
  return data;
};

export const updateSurvey = async (id: string, surveyData: Partial<SurveyInput>) => {
  const { data } = await api.put(`/surveys/${id}`, surveyData);
  return data;
};

// Responses
export const submitResponse = async (surveyId: string, responses: ResponseInput[]) => {
  const { data } = await api.post('/responses', { surveyId, responses });
  return data;
};

export default api;
