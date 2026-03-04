// ============================================
// justBeat - Drum Machine 状态管理
// ============================================

import { createContext, useContext, useReducer, useCallback, useRef, useState, ReactNode } from 'react';
import type { 
  DrumType, 
  DrumMachineState, 
  DrumMachineAction,
  BackingTrack,
  Genre
} from '@/types';
import { DEFAULT_PATTERN, STEPS, DEFAULT_TRACK } from '@/constants/config';
import { initDrumSynths } from '@/audio/drumSynths';
import * as Tone from 'tone';

// ============================================
// Initial State
// ============================================

const initialState: DrumMachineState = {
  pattern: DEFAULT_PATTERN,
  isPlaying: false,
  isMuted: false,
  currentStep: -1,
  bpm: DEFAULT_TRACK.bpm,
  currentTrack: DEFAULT_TRACK,
  genre: DEFAULT_TRACK.genre,
};

// ============================================
// Reducer
// ============================================

function drumMachineReducer(state: DrumMachineState, action: DrumMachineAction): DrumMachineState {
  switch (action.type) {
    case 'TOGGLE_STEP': {
      const { drumType, step } = action;
      const newPattern = { ...state.pattern };
      newPattern[drumType] = [...newPattern[drumType]];
      newPattern[drumType][step] = !newPattern[drumType][step];
      return { ...state, pattern: newPattern };
    }

    case 'SET_PLAYING':
      return { ...state, isPlaying: action.isPlaying };

    case 'SET_MUTED':
      return { ...state, isMuted: action.isMuted };

    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.step };

    case 'SET_TRACK':
      return { 
        ...state, 
        currentTrack: action.track,
        bpm: action.track.bpm,
      };

    case 'SET_GENRE':
      return {
        ...state,
        genre: action.genre,
        currentTrack: action.track,
        bpm: action.track.bpm,
      };

    case 'SET_BPM':
      return { ...state, bpm: action.bpm };

    case 'CLEAR_ALL':
      return {
        ...state,
        pattern: {
          kick: Array(STEPS).fill(false),
          snare: Array(STEPS).fill(false),
          hihat: Array(STEPS).fill(false),
        },
      };

    case 'RANDOMIZE': {
      const randomPattern = (density: number): boolean[] =>
        Array(STEPS)
          .fill(false)
          .map(() => Math.random() < density);

      return {
        ...state,
        pattern: {
          kick: randomPattern(0.25),
          snare: randomPattern(0.25),
          hihat: randomPattern(0.5),
        },
      };
    }

    default:
      return state;
  }
}

// ============================================
// Context
// ============================================

interface DrumMachineContextType {
  state: DrumMachineState;
  toggleStep: (drumType: DrumType, step: number) => void;
  setPlaying: (isPlaying: boolean) => void;
  setMuted: (isMuted: boolean) => void;
  setCurrentStep: (step: number) => void;
  setTrack: (track: BackingTrack) => void;
  setGenre: (genre: Genre, track: BackingTrack) => void;
  clearAll: () => void;
  randomize: () => void;
  initAudio: () => Promise<void>;
  isAudioReady: boolean;
}

const DrumMachineContext = createContext<DrumMachineContextType | null>(null);

// ============================================
// Provider
// ============================================

interface DrumMachineProviderProps {
  children: ReactNode;
}

export function DrumMachineProvider({ children }: DrumMachineProviderProps) {
  const [state, dispatch] = useReducer(drumMachineReducer, initialState);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const audioInitializedRef = useRef(false);

  // 初始化音频引擎
  const initAudio = useCallback(async () => {
    if (audioInitializedRef.current) return;
    
    await Tone.start();
    initDrumSynths();
    audioInitializedRef.current = true;
    setIsAudioReady(true);
  }, []);

  const toggleStep = useCallback((drumType: DrumType, step: number) => {
    dispatch({ type: 'TOGGLE_STEP', drumType, step });
  }, []);

  const setPlaying = useCallback((isPlaying: boolean) => {
    dispatch({ type: 'SET_PLAYING', isPlaying });
  }, []);

  const setMuted = useCallback((isMuted: boolean) => {
    dispatch({ type: 'SET_MUTED', isMuted });
  }, []);

  const setCurrentStep = useCallback((step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', step });
  }, []);

  const setTrack = useCallback((track: BackingTrack) => {
    dispatch({ type: 'SET_TRACK', track });
  }, []);

  const setGenre = useCallback((genre: Genre, track: BackingTrack) => {
    dispatch({ type: 'SET_GENRE', genre, track });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const randomize = useCallback(() => {
    dispatch({ type: 'RANDOMIZE' });
  }, []);

  const value: DrumMachineContextType = {
    state,
    toggleStep,
    setPlaying,
    setMuted,
    setCurrentStep,
    setTrack,
    setGenre,
    clearAll,
    randomize,
    initAudio,
    isAudioReady,
  };

  return (
    <DrumMachineContext.Provider value={value}>
      {children}
    </DrumMachineContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

export function useDrumMachine() {
  const context = useContext(DrumMachineContext);
  if (!context) {
    throw new Error('useDrumMachine must be used within a DrumMachineProvider');
  }
  return context;
}
