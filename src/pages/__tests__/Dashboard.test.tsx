/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from '../Dashboard';
import { renderWithProviders } from '../../test/testUtils';

// Mock hooks
vi.mock('../../hooks/useSurveys', () => ({
  useSurveys: vi.fn(),
}));

// Mock store
vi.mock('../../store/useLocaleStore', () => ({
  useLocaleStore: vi.fn(() => ({
    t: (key: string) => key,
    locale: 'pt',
  })),
}));

// Mock Auth Store for roles
vi.mock('../../store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock components to avoid store logic in nested components
vi.mock('../../components/Sidebar', () => ({
  default: () => <div data-testid="sidebar-mock">Sidebar</div>,
}));

vi.mock('../../components/Header', () => ({
  default: ({ title }: { title: string }) => <header data-testid="header-mock">{title}</header>,
}));

// Import mocked modules
import { useSurveys } from '../../hooks/useSurveys';
import { useAuthStore } from '../../store/useAuthStore';

describe('Dashboard Page', () => {
  const mockSurveys = [
    {
      id: '1',
      title: 'Survey 1',
      description: 'Desc 1',
      isActive: true,
      openDate: '2026-01-01',
      closeDate: '2026-12-31',
    },
    {
      id: '2',
      title: 'Survey 2',
      description: 'Desc 2',
      isActive: false,
      openDate: '2024-01-01',
      closeDate: '2024-02-01',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state', () => {
    (useSurveys as any).mockReturnValue({ isLoading: true });
    (useAuthStore as any).mockReturnValue({ user: { role: 'ADMIN' } });

    renderWithProviders(<Dashboard />);
    expect(screen.getByText(/dashboard.loading/i)).toBeInTheDocument();
  });

  it('should render surveys list for Admin', async () => {
    (useSurveys as any).mockReturnValue({ data: mockSurveys, isLoading: false });
    (useAuthStore as any).mockReturnValue({ user: { role: 'ADMIN' } });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Survey 1')).toBeInTheDocument();
      expect(screen.getByText('Survey 2')).toBeInTheDocument();
    });

    const activeBadges = screen.getAllByText('dashboard.status_active');
    expect(activeBadges.length).toBeGreaterThan(0);
  });

  it('should render surveys list for User', async () => {
    (useSurveys as any).mockReturnValue({ data: mockSurveys, isLoading: false });
    (useAuthStore as any).mockReturnValue({ user: { role: 'USER' } });

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Survey 1')).toBeInTheDocument();
      expect(screen.getByText('Survey 2')).toBeInTheDocument();
    });

    expect(screen.queryByText('dashboard.new_survey')).not.toBeInTheDocument();
  });

  it('should handle copying link', async () => {
    (useSurveys as any).mockReturnValue({ data: [mockSurveys[0]], isLoading: false });
    (useAuthStore as any).mockReturnValue({ user: { role: 'ADMIN' } });

    // navigator.clipboard is mocked in setup.ts
    const writeTxt = vi.spyOn(navigator.clipboard, 'writeText');

    renderWithProviders(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Survey 1')).toBeInTheDocument();
    });

    const copyBtn = screen.getByText('dashboard.copy_link');
    fireEvent.click(copyBtn);

    expect(writeTxt).toHaveBeenCalledWith(expect.stringContaining('/respondent/1'));
  });
});
