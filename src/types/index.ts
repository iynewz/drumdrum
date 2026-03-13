// ============================================
// justBeat - TypeScript 类型定义
// ============================================

/** 鼓点模式 - 16步，每步 true/false */
export type StepPattern = boolean[];

/** 完整鼓机模式 */
export interface DrumPattern {
  kick: StepPattern;
  snare: StepPattern;
  hihat: StepPattern;
}

/** 音色类型 */
export type DrumType = 'kick' | 'snare' | 'hihat';

/** 音乐风格 */
export type Genre = 'metal' | 'rock';

/** Backing Track 定义 */
export interface BackingTrack {
  id: string;
  name: string;
  bpm: number;
  url: string;
  genre: Genre;
}

/** 音频配置 */
export interface AudioConfig {
  bpm: number;
  isPlaying: boolean;
  isMuted: boolean;
  currentStep: number;
  volume: number;
}

/** Drum Machine 状态 */
export interface DrumMachineState {
  pattern: DrumPattern;
  isPlaying: boolean;
  isMuted: boolean;
  currentStep: number;
  bpm: number;
  currentTrack: BackingTrack;
  genre: Genre;
}

/** Drum Machine Action */
export type DrumMachineAction =
  | { type: 'TOGGLE_STEP'; drumType: DrumType; step: number }
  | { type: 'SET_PLAYING'; isPlaying: boolean }
  | { type: 'SET_MUTED'; isMuted: boolean }
  | { type: 'SET_CURRENT_STEP'; step: number }
  | { type: 'CLEAR_ALL' }
  | { type: 'RANDOMIZE' }
  | { type: 'SET_TRACK'; track: BackingTrack }
  | { type: 'SET_GENRE'; genre: Genre; track: BackingTrack }
  | { type: 'SET_BPM'; bpm: number }
  | { type: 'LOAD_PRESET'; pattern: DrumPattern };

/** 合成器配置 */
export interface SynthConfig {
  kick: {
    pitchDecay: number;
    octaves: number;
    oscillator: { type: string };
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    };
  };
  snare: {
    noise: { type: 'white' | 'pink' | 'brown' };
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    };
  };
  hihat: {
    envelope: {
      attack: number;
      decay: number;
      release: number;
    };
    harmonicity: number;
    modulationIndex: number;
    resonance: number;
    octaves: number;
  };
}
