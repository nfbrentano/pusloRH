import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSurveys, getSurvey, createSurvey, updateSurvey, submitResponse } from '../services/api';
import type { SurveyInput, ResponseInput } from '../types';

// Fetch All Surveys
export const useSurveys = () => {
  return useQuery({
    queryKey: ['surveys'],
    queryFn: getSurveys,
  });
};

// Fetch Single Survey
export const useSurvey = (id: string | null) => {
  return useQuery({
    queryKey: ['survey', id],
    queryFn: () => (id ? getSurvey(id) : null),
    enabled: !!id,
  });
};

// Create Survey Mutation
export const useCreateSurvey = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSurvey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });
};

// Update Survey Mutation
export const useUpdateSurvey = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SurveyInput>) => updateSurvey(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey', id] });
    },
  });
};

// Submit Response Mutation
export const useSubmitResponse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ surveyId, responses }: { surveyId: string; responses: ResponseInput[] }) =>
      submitResponse(surveyId, responses),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      queryClient.invalidateQueries({ queryKey: ['survey', variables.surveyId] });
    },
  });
};
