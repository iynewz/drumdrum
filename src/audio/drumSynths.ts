// ============================================
// justBeat - 鼓声音色合成配置
// ============================================

import * as Tone from "tone";
import { DEFAULT_VOLUME } from "@/constants/config";

// ============================================
// 合成器实例
// ============================================

let kickSynth: Tone.MembraneSynth | null = null;
let snareSynth: Tone.NoiseSynth | null = null;
let snareToneSynth: Tone.MembraneSynth | null = null;
let hihatSynth: Tone.MetalSynth | null = null;
let drumBus: Tone.Volume | null = null;

// ============================================
// 初始化
// ============================================

export function initDrumSynths(): void {
  // 创建总线用于统一控制音量
  drumBus = new Tone.Volume(DEFAULT_VOLUME.drum).toDestination();

  // Kick - 底鼓
  kickSynth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: { type: "sine" },
    envelope: {
      attack: 0.001,
      decay: 0.4,
      sustain: 0.01,
      release: 1.4,
    },
  }).connect(drumBus);
  kickSynth.volume.value = 0;

  // Snare - 军鼓 (噪声层)
  snareSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: {
      attack: 0.005,
      decay: 0.2,
      sustain: 0,
      release: 0.1,
    },
  }).connect(drumBus);
  snareSynth.volume.value = -3;

  // Snare - 军鼓 (音调层)
  snareToneSynth = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 4,
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.001,
      decay: 0.1,
      sustain: 0,
      release: 0.1,
    },
  }).connect(drumBus);
  snareToneSynth.volume.value = -10;

  // Hi-Hat - 踩镲
  // MetalSynth 参数调整：更高的频率和共振
  hihatSynth = new Tone.MetalSynth({
    envelope: {
      attack: 0.001,
      decay: 0.08,
      release: 0.02,
    },
    harmonicity: 12,
    modulationIndex: 20,
    resonance: 8000,
    octaves: 2,
  }).connect(drumBus);
  hihatSynth.frequency.value = 800; // 设置基础频率
  hihatSynth.volume.value = -6;
}

// ============================================
// 触发播放
// ============================================

export function triggerKick(time?: number): void {
  console.log(`trigger kick at ${time || "now"}`);

  if (!kickSynth) return;
  if (time !== undefined) {
    kickSynth.triggerAttackRelease("C1", "8n", time); 
  } else {
    kickSynth.triggerAttackRelease("C1", "8n");
  }
}

export function triggerSnare(time?: number): void {
  if (!snareSynth || !snareToneSynth) return;

  if (time !== undefined) {
    snareSynth.triggerAttackRelease("8n", time);
    snareToneSynth.triggerAttackRelease("G2", "16n", time);
  } else {
    snareSynth.triggerAttackRelease("8n");
    snareToneSynth.triggerAttackRelease("G2", "16n");
  }
}

export function triggerHiHat(time?: number): void {
  console.log("trigger hh"); //
  if (!hihatSynth) return;

  // MetalSynth.triggerAttackRelease(duration, time?, velocity?)
  // 注意：MetalSynth 不需要 note 参数，音高由 frequency 设置
  if (time !== undefined) {
    hihatSynth.triggerAttackRelease("32n", time, 0.8);
  } else {
    hihatSynth.triggerAttackRelease("32n", Tone.now(), 0.8);
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
  snareToneSynth?.dispose();
  hihatSynth?.dispose();
  drumBus?.dispose();

  kickSynth = null;
  snareSynth = null;
  snareToneSynth = null;
  hihatSynth = null;
  drumBus = null;
}
