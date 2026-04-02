import { create } from 'zustand';

interface SurveyState {
  searchQuery: string;
  statusFilter: 'all' | 'open' | 'closed';

  // Actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: 'all' | 'open' | 'closed') => void;
}

/**
 * useSurveyStore now only manages UI-level global state like filters and search.
 * Data persistence and synchronization is handled by TanStack Query and the live Node.js backend.
 */
export const useSurveyStore = create<SurveyState>((set) => ({
  searchQuery: '',
  statusFilter: 'all',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
}));
