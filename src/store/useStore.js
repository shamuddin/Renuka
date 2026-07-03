import { create } from 'zustand';

// Global state for the whole experience.
// scroll: 0..1 normalized progress along the journey (drives the camera).
export const useStore = create((set) => ({
  // journey progress (0 = start, 1 = finale)
  scroll: 0,
  setScroll: (scroll) => set({ scroll }),

  // asset loading
  ready: false,
  setReady: (ready) => set({ ready }),

  // audio
  audioOn: false,
  toggleAudio: () => set((s) => ({ audioOn: !s.audioOn })),

  // which chapter is currently in focus (0-based index, -1 = intro)
  activeChapter: -1,
  setActiveChapter: (activeChapter) => set({ activeChapter }),

  // has the finale been triggered
  finaleUnlocked: false,
  unlockFinale: () => set({ finaleUnlocked: true }),

  // performance tier detected at runtime ('high' | 'low')
  perf: 'high',
  setPerf: (perf) => set({ perf }),

  // free-look camera (orbit/pan/zoom) for inspecting the scene
  freeCam: false,
  toggleFreeCam: () => set((s) => ({ freeCam: !s.freeCam })),

  // island mini-games
  activeGame: null, // chapter id of the open game, or null
  gamesWon: {}, // { [chapterId]: true }
  openGame: (id) => set({ activeGame: id }),
  closeGame: () => set({ activeGame: null }),
  winGame: (id) =>
    set((s) => ({ gamesWon: { ...s.gamesWon, [id]: true } })),
}));

// The day our story began.
export const START_DATE = new Date('2025-07-14T00:00:00');
