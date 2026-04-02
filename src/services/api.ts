import axios from 'axios';
import type { SurveyInput, ResponseInput } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

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
