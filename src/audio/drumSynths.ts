// ============================================
// justBeat - 鼓声音色合成配置
// ============================================

import * as Tone from 'tone';
import { SYNTH_CONFIG, DEFAULT_VOLUME } from '@/constants/config';

// ============================================
// 合成器实例
// ============================================

let kickSynth: Tone.MembraneSynth | null = null;
let snareSynth: Tone.NoiseSynth | null = null;
let hihatSynth: Tone.MetalSynth | null = null;
let drumBus: Tone.Volume | null = null;

// ============================================
// 初始化
// ============================================

export function initDrumSynths(): void {
  // 创建总线用于统一控制音量
  drumBus = new Tone.Volume(DEFAULT_VOLUME.drum).toDestination();

  // Kick - 底鼓 (MembraneSynth 模拟鼓皮振动)
  kickSynth = new Tone.MembraneSynth({
    pitchDecay: SYNTH_CONFIG.kick.pitchDecay,
    octaves: SYNTH_CONFIG.kick.octaves,
    oscillator: SYNTH_CONFIG.kick.oscillator as { type: 'sine' | 'square' | 'sawtooth' | 'triangle' },
    envelope: SYNTH_CONFIG.kick.envelope,
  }).connect(drumBus);

  // Snare - 军鼓 (NoiseSynth 模拟噪声)
  snareSynth = new Tone.NoiseSynth({
    noise: SYNTH_CONFIG.snare.noise,
    envelope: SYNTH_CONFIG.snare.envelope,
  }).connect(drumBus);

  // Hi-Hat - 踩镲 (MetalSynth 模拟金属质感)
  hihatSynth = new Tone.MetalSynth({
    envelope: SYNTH_CONFIG.hihat.envelope,
    harmonicity: SYNTH_CONFIG.hihat.harmonicity,
    modulationIndex: SYNTH_CONFIG.hihat.modulationIndex,
    resonance: SYNTH_CONFIG.hihat.resonance,
    octaves: SYNTH_CONFIG.hihat.octaves,
  }).connect(drumBus);
  hihatSynth.frequency.value = 200;

  // 设置初始音量
  kickSynth.volume.value = 0;
  snareSynth.volume.value = -5;
  hihatSynth.volume.value = -10;
}

// ============================================
// 触发播放
// ============================================

export function triggerKick(time?: number): void {
  if (!kickSynth) return;
  // C1 = 32.70 Hz，标准底鼓音高
  if (time !== undefined) {
    kickSynth.triggerAttackRelease('C1', '8n', time);
  } else {
    kickSynth.triggerAttackRelease('C1', '8n');
  }
}

export function triggerSnare(time?: number): void {
  if (!snareSynth) return;
  snareSynth.triggerAttackRelease('8n', time);
}

export function triggerHiHat(time?: number): void {
  if (!hihatSynth) return;
  // 踩镲音量稍小
  if (time !== undefined) {
    hihatSynth.triggerAttackRelease('32n', time, 0.3);
  } else {
    hihatSynth.triggerAttackRelease('32n', Tone.now(), 0.3);
  }
}

// ============================================
// 控制
// ============================================

export function setDrumMuted(muted: boolean): void {
  if (drumBus) {
    drumBus.mute = muted;
  }
}

export function setDrumVolume(volume: number): void {
  if (drumBus) {
    drumBus.volume.value = volume;
  }
}

// ============================================
// 清理
// ============================================

export function disposeDrumSynths(): void {
  kickSynth?.dispose();
  snareSynth?.dispose();
  hihatSynth?.dispose();
  drumBus?.dispose();
  
  kickSynth = null;
  snareSynth = null;
  hihatSynth = null;
  drumBus = null;
}
