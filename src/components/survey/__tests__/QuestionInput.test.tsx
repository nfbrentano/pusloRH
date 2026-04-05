import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import QuestionInput from '../QuestionInput';

describe('QuestionInput', () => {
  afterEach(cleanup);

  it('renders Binary question type correctly', () => {
    const onChange = vi.fn();
    render(<QuestionInput type="Binary" onChange={onChange} />);

    expect(screen.getByText('builder.label_yes')).toBeInTheDocument();
    expect(screen.getByText('builder.label_no')).toBeInTheDocument();
  });

  it('calls onChange with "Yes" when clicking yes in Binary type', () => {
    const onChange = vi.fn();
    render(<QuestionInput type="Binary" onChange={onChange} />);

    const yesButton = screen.getByText('builder.label_yes').parentElement!;
    fireEvent.click(yesButton);

    expect(onChange).toHaveBeenCalledWith('Yes');
  });

  it('renders Emoticons type correctly', () => {
    render(<QuestionInput type="Emoticons" />);
    // Check for some emoticons
    expect(screen.getByText('🤩')).toBeInTheDocument();
    expect(screen.getByText('😡')).toBeInTheDocument();
  });

  it('renders Slider type correctly', () => {
    render(<QuestionInput type="Slider" value={7} />);
    const slider = screen.getByRole('slider') as HTMLInputElement;
    expect(slider.value).toBe('7');
  });

  it('calls onChange when slider value changes', () => {
    const onChange = vi.fn();
    render(<QuestionInput type="Slider" onChange={onChange} />);
    const slider = screen.getByRole('slider');

    fireEvent.change(slider, { target: { value: '8' } });
    expect(onChange).toHaveBeenCalledWith(8);
  });

  it('is disabled when disabled prop is true', () => {
    const onChange = vi.fn();
    render(<QuestionInput type="Binary" disabled onChange={onChange} />);

    const inputs = screen.getAllByRole('radio');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });
});
