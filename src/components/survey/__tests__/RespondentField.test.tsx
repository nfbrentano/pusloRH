import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import RespondentField from '../RespondentField';
import type { Question } from '../../../types';

const mockQuestion: Question = {
  id: 'q-1',
  surveyId: 's-1',
  text: 'How happy are you at work?',
  type: 'Emoticons',
  allowComment: true,
};

describe('RespondentField', () => {
  afterEach(cleanup);

  it('renders question text and formatted index correctly', () => {
    render(<RespondentField question={mockQuestion} index={0} />);

    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('How happy are you at work?')).toBeInTheDocument();
  });

  it('renders a comment area if allowComment is true', () => {
    render(<RespondentField question={mockQuestion} index={0} />);

    // Check for comment textarea
    const commentArea = screen.getByPlaceholderText('respondent.comment_placeholder');
    expect(commentArea).toBeInTheDocument();
  });

  it('does not render comment area if allowComment is false', () => {
    render(<RespondentField question={{ ...mockQuestion, allowComment: false }} index={0} />);

    const commentArea = screen.queryByPlaceholderText('respondent.comment_placeholder');
    expect(commentArea).not.toBeInTheDocument();
  });

  it('calls onCommentChange when text is typed in the textarea', () => {
    const onCommentChange = vi.fn();
    render(<RespondentField question={mockQuestion} index={0} onCommentChange={onCommentChange} />);

    const commentArea = screen.getByPlaceholderText('respondent.comment_placeholder');
    fireEvent.change(commentArea, { target: { value: 'This is my feedback' } });

    expect(onCommentChange).toHaveBeenCalledWith('This is my feedback');
  });

  it('respects the disabled prop for both input and comment areas', () => {
    render(<RespondentField question={mockQuestion} index={0} disabled />);

    const commentArea = screen.getByPlaceholderText('respondent.comment_placeholder');
    expect(commentArea).toBeDisabled();

    const inputs = screen.getAllByRole('radio');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
