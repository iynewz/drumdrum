// ============================================
// justBeat - 常量配置
// ============================================

import type { BackingTrack, DrumPattern, SynthConfig } from '@/types';

/** 步进数 */
export const STEPS = 16;

/** 默认 BPM */
export const DEFAULT_BPM = 120;

/** 默认空模式 */
export const DEFAULT_PATTERN: DrumPattern = {
  kick: Array(STEPS).fill(false),
  snare: Array(STEPS).fill(false),
  hihat: Array(STEPS).fill(false),
};

/** Backing Track 列表 */
export const BACKING_TRACKS: BackingTrack[] = [
  {
    id: 'metal-140',
    name: 'Heavy Metal Riff',
    bpm: 140,
    url: '/tracks/metal-140.mp3',
    genre: 'metal',
  },
  {
    id: 'rock-120',
    name: 'Hard Rock Groove',
    bpm: 120,
    url: '/tracks/rock-120.mp3',
    genre: 'rock',
  },
  {
    id: 'metal-160',
    name: 'Fast Thrash',
    bpm: 160,
    url: '/tracks/metal-160.mp3',
    genre: 'metal',
  },
];

/** 默认曲目 */
export const DEFAULT_TRACK = BACKING_TRACKS[0];

/** 合成器配置 */
export const SYNTH_CONFIG: SynthConfig = {
  kick: {
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: { type: 'sine' },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4,
    },
  },
  snare: {
    noise: { type: 'white' },
    envelope: {
      attack: 0.005,
      decay: 0.1,
      sustain: 0,
      release: 0.1,
    },
  },
  hihat: {
    envelope: {
      attack: 0.001,
      decay: 0.05,
      release: 0.01,
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  },
};

/** 音量默认值 */
export const DEFAULT_VOLUME = {
  master: -10, // dB
  drum: -5,    // dB
  backing: -12, // dB
};

/** 本地存储键名 */
export const STORAGE_KEYS = {
  pattern: 'justbeat_pattern',
  muted: 'justbeat_muted',
};
