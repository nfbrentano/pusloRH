import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Global Mocks for Zustand Stores
vi.mock('../store/useAuthStore', () => ({
  useAuthStore: Object.assign(
    vi.fn(() => ({
      user: { id: '1', name: 'Test User', role: 'ADMIN', email: 'test@test.com' },
      logout: vi.fn(),
    })),
    {
      getState: vi.fn(() => ({
        user: { id: '1', name: 'Test User', role: 'ADMIN', email: 'test@test.com' },
      })),
      subscribe: vi.fn(),
    }
  ),
}));

vi.mock('../store/useLocaleStore', () => ({
  useLocaleStore: vi.fn(() => ({
    t: (key: string) => key,
    locale: 'pt',
    setLocale: vi.fn(),
  })),
}));

vi.mock('../store/useSurveyStore', () => ({
  useSurveyStore: vi.fn(() => ({
    searchQuery: '',
    statusFilter: 'all',
    setStatusFilter: vi.fn(),
    setSearchQuery: vi.fn(),
  })),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});
