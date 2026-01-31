import { create } from 'zustand';
import { Section } from '@/lib/types';

type DeviceView = 'mobile' | 'tablet' | 'desktop';

interface BuilderState {
  currentPageId: string | null;
  selectedSectionId: string | null;
  deviceView: DeviceView;
  history: Section[][];
  historyIndex: number;
  setCurrentPage: (pageId: string) => void;
  selectSection: (sectionId: string | null) => void;
  setDeviceView: (view: DeviceView) => void;
  addToHistory: (sections: Section[]) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  currentPageId: null,
  selectedSectionId: null,
  deviceView: 'desktop',
  history: [],
  historyIndex: -1,
  
  setCurrentPage: (pageId) => {
    set({ 
      currentPageId: pageId,
      selectedSectionId: null,
      history: [],
      historyIndex: -1,
    });
  },
  
  selectSection: (sectionId) => {
    set({ selectedSectionId: sectionId });
  },
  
  setDeviceView: (view) => {
    set({ deviceView: view });
  },
  
  addToHistory: (sections) => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(sections);
      
      // Keep only last 20 states
      if (newHistory.length > 20) {
        newHistory.shift();
      }
      
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },
  
  undo: () => {
    set((state) => {
      if (state.historyIndex > 0) {
        return { historyIndex: state.historyIndex - 1 };
      }
      return state;
    });
  },
  
  redo: () => {
    set((state) => {
      if (state.historyIndex < state.history.length - 1) {
        return { historyIndex: state.historyIndex + 1 };
      }
      return state;
    });
  },
  
  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },
  
  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },
}));
