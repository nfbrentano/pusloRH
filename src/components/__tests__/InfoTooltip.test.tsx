import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import InfoTooltip from '../InfoTooltip';

describe('InfoTooltip', () => {
  afterEach(cleanup);

  it('should not show tooltip text by default', () => {
    render(<InfoTooltip text="Test message" />);
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should show tooltip text on mouse enter', async () => {
    render(<InfoTooltip text="Test message" />);
    const icon = screen.getByTestId('info-icon');

    // The icon is within a div that has the events
    const trigger = icon.parentElement!;

    fireEvent.mouseEnter(trigger);

    expect(await screen.findByText('Test message')).toBeInTheDocument();
  });

  it('should hide tooltip text on mouse leave', async () => {
    render(<InfoTooltip text="Test message" />);
    const icon = screen.getByTestId('info-icon');
    const trigger = icon.parentElement!;

    fireEvent.mouseEnter(trigger);
    expect(await screen.findByText('Test message')).toBeInTheDocument();

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });
});
