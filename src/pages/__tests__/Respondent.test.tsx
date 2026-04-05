/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Respondent from '../Respondent';
import { renderWithProviders } from '../../test/testUtils';

// Mock hooks
vi.mock('../../hooks/useSurveys', () => ({
  useSurvey: vi.fn(),
  useSubmitResponse: vi.fn(),
}));

// Mock stores
vi.mock('../../store/useLocaleStore', () => ({
  useLocaleStore: vi.fn(() => ({
    t: (key: string) => key,
    locale: 'pt',
  })),
}));

// Mock Auth
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: vi.fn(() => ({ user: null })),
}));

// Import mocked modules
import { useSurvey, useSubmitResponse } from '../../hooks/useSurveys';

describe('Respondent Page', () => {
  const mockSurvey = {
    id: 'survey-123',
    title: 'Employee Satisfaction',
    description: 'Tell us how you feel',
    openDate: '2026-01-01',
    closeDate: '2026-12-31',
    isActive: true,
    questions: [
      { id: 'q1', text: 'How happy are you?', type: 'Emoticons', allowComment: true },
      { id: 'q2', text: 'Yes or No?', type: 'Binary', allowComment: false },
    ],
  };

  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useSubmitResponse as any).mockReturnValue({ mutateAsync: mockMutateAsync, isPending: false });
  });

  it('should render questions correctly', async () => {
    (useSurvey as any).mockReturnValue({ data: mockSurvey, isLoading: false });
    renderWithProviders(<Respondent />, { route: '/respondent/survey-123' });

    await waitFor(() => {
      expect(screen.getByText('Employee Satisfaction')).toBeInTheDocument();
      expect(screen.getByText('How happy are you?')).toBeInTheDocument();
    });

    expect(screen.getByText('🤩')).toBeInTheDocument();
  });

  it('should handle submission successfully', async () => {
    (useSurvey as any).mockReturnValue({ data: mockSurvey, isLoading: false });
    renderWithProviders(<Respondent />, { route: '/respondent/survey-123' });

    await waitFor(() => {
      expect(screen.getByText('Employee Satisfaction')).toBeInTheDocument();
    });

    const option = screen.getByText('respondent.rating_5');
    fireEvent.click(option);

    const submitBtn = screen.getByText('respondent.send_responses');
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('respondent.success_title')).toBeInTheDocument();
    });
  });
});
