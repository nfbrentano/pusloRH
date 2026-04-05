/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Builder from '../Builder';
import { renderWithProviders } from '../../test/testUtils';

// Mock hooks
vi.mock('../../hooks/useSurveys', () => ({
  useSurvey: vi.fn(),
  useCreateSurvey: vi.fn(),
  useUpdateSurvey: vi.fn(),
}));

// Mock stores
vi.mock('../../store/useLocaleStore', () => ({
  useLocaleStore: vi.fn(() => ({
    t: (key: string) => key,
    locale: 'pt',
  })),
}));

// Mock components
vi.mock('../../components/Sidebar', () => ({
  default: () => <div data-testid="sidebar-mock">Sidebar</div>,
}));

vi.mock('../../components/Header', () => ({
  default: ({ title }: { title: string }) => <header data-testid="header-mock">{title}</header>,
}));

// Import mocked modules
import { useSurvey, useCreateSurvey, useUpdateSurvey } from '../../hooks/useSurveys';

describe('Builder Page', () => {
  const mockCreateMutateAsync = vi.fn();
  const mockUpdateMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useCreateSurvey as any).mockReturnValue({
      mutateAsync: mockCreateMutateAsync,
      isPending: false,
    });
    (useUpdateSurvey as any).mockReturnValue({
      mutateAsync: mockUpdateMutateAsync,
      isPending: false,
    });
  });

  it('should start with an empty form for a new survey', async () => {
    (useSurvey as any).mockReturnValue({ isLoading: false, data: null });
    renderWithProviders(<Builder />, { route: '/builder' });

    await waitFor(() => {
      expect(screen.getByTestId('header-mock')).toHaveTextContent('builder.new_title');
    });

    expect(screen.getByText('builder.save_new')).toBeInTheDocument();
  });

  it('should load existing survey data', async () => {
    const mockSurvey = {
      id: 'survey-123',
      title: 'Old Title',
      description: 'Old Description',
      openDate: '2026-01-01',
      closeDate: '2030-12-31',
      isActive: true,
      questions: [{ id: 'q1', text: 'Existing Question', type: 'Emoticons', allowComment: true }],
    };

    (useSurvey as any).mockReturnValue({ data: mockSurvey, isLoading: false });
    renderWithProviders(<Builder />, { route: '/builder/survey-123' });

    await waitFor(() => {
      const titleInput = screen.getByPlaceholderText('builder.survey_title_placeholder');
      expect(titleInput).toHaveValue('Old Title');
    });
  });

  it('should add questions', async () => {
    (useSurvey as any).mockReturnValue({ isLoading: false, data: null });
    renderWithProviders(<Builder />, { route: '/builder' });

    await waitFor(() => {
      expect(screen.getByTestId('header-mock')).toHaveTextContent('builder.new_title');
    });

    const addBtn = screen.getByText(/\+ builder.add_question/i);
    fireEvent.click(addBtn);

    await waitFor(() => {
      expect(screen.queryByText(/builder\.question_label.*02/i)).toBeInTheDocument();
    });
  });

  it('should validate and save new survey', async () => {
    (useSurvey as any).mockReturnValue({ isLoading: false, data: null });
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderWithProviders(<Builder />, { route: '/builder' });

    await waitFor(() => {
      expect(screen.getByTestId('header-mock')).toHaveTextContent('builder.new_title');
    });

    const saveBtn = screen.getByText('builder.save_new');
    fireEvent.click(saveBtn);

    expect(alertSpy).toHaveBeenCalledWith('builder.validation_error');
  });
});
