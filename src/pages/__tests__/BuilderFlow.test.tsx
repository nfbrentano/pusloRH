import { describe, it, expect, vi, beforeEach, afterEach, type MockedFunction } from 'vitest';
import { screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import Builder from '../Builder';
import { renderWithProviders } from '../../test/testUtils';

// Mock hooks
vi.mock('../../hooks/useSurveys', () => ({
  useSurvey: vi.fn(),
  useCreateSurvey: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
  useUpdateSurvey: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
  })),
}));

// Mock window.alert
vi.spyOn(window, 'alert').mockImplementation(() => {});

import { useSurvey, useCreateSurvey } from '../../hooks/useSurveys';

describe('Builder Integration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // @ts-expect-error - Complex return type for useSurvey hook mock
    (useSurvey as MockedFunction<typeof useSurvey>).mockReturnValue({
      isLoading: false,
      data: null,
    });
  });

  afterEach(cleanup);

  it('should allow a full survey creation flow with multiple questions', async () => {
    const createMutation = vi.fn().mockResolvedValue({ id: 'new-survey-id' });
    // @ts-expect-error - Complex return type for useCreateSurvey hook mock
    (useCreateSurvey as MockedFunction<typeof useCreateSurvey>).mockReturnValue({
      mutateAsync: createMutation,
      isPending: false,
    });

    renderWithProviders(<Builder />, { route: '/builder' });

    // 1. Fill basic info
    const titleInput = screen.getByPlaceholderText(/builder.survey_title_placeholder/i);
    fireEvent.change(titleInput, { target: { value: 'Engajamento 2024' } });

    const openDateLabel = screen.getByText('builder.open_date');
    const openDate = openDateLabel.parentElement?.querySelector('input');
    if (!openDate) throw new Error('Open date input not found');
    fireEvent.change(openDate, { target: { value: '2024-01-01' } });

    const closeDateLabel = screen.getByText('builder.close_date');
    const closeDate = closeDateLabel.parentElement?.querySelector('input');
    if (!closeDate) throw new Error('Close date input not found');
    fireEvent.change(closeDate, { target: { value: '2024-12-31' } });

    // 2. Edit first question
    const firstQuestionInput = screen.getByPlaceholderText(/builder.question_placeholder/i);
    fireEvent.change(firstQuestionInput, { target: { value: 'Como você se sente hoje?' } });

    // 3. Add second question
    const addBtn = screen.getByText(/\+ builder.add_question/i);
    fireEvent.click(addBtn);

    const questions = screen.getAllByPlaceholderText(/builder.question_placeholder/i);
    expect(questions).toHaveLength(2);
    fireEvent.change(questions[1], { target: { value: 'Você recomendaria nossa empresa?' } });

    // 4. Change type of second question to Binary
    const binButtons = screen.getAllByText('builder.type_binary');
    fireEvent.click(binButtons[1]); // The second card's binary button

    // 5. Open preview and verify RespondentField is working (via PreviewModal)
    const previewBtns = screen.getAllByText('common.preview');
    fireEvent.click(previewBtns[0]); // Click the one in the header

    await waitFor(() => {
      expect(screen.getByText('Engajamento 2024')).toBeInTheDocument();
      // Verify question texts are in preview
      expect(screen.getByText('Como você se sente hoje?')).toBeInTheDocument();
      expect(screen.getByText('Você recomendaria nossa empresa?')).toBeInTheDocument();
    });

    // 6. Close preview
    const closePreviewBtn = screen.getByText('respondent.preview_exit');
    fireEvent.click(closePreviewBtn);

    // 7. Save
    const saveBtn = screen.getByText('builder.save_new');
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(createMutation).toHaveBeenCalled();
      const payload = createMutation.mock.calls[0][0];
      expect(payload.title).toBe('Engajamento 2024');
      expect(payload.questions).toHaveLength(2);
      expect(payload.questions[1].type).toBe('Binary');
    });
  });
});
