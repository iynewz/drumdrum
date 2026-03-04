// ============================================
// justBeat - Tone.js 引擎管理 Hook
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import type { DrumPattern } from '@/types';
import { 
  triggerKick, 
  triggerSnare, 
  triggerHiHat,
  setDrumMuted,
  disposeDrumSynths 
} from '@/audio/drumSynths';
import { DEFAULT_BPM } from '@/constants/config';

interface UseToneEngineOptions {
  bpm?: number;
  isAudioReady: boolean;
  onStep?: (step: number) => void;
}

interface UseToneEngineReturn {
  isPlaying: boolean;
  start: () => void;
  stop: () => void;
  setMuted: (muted: boolean) => void;
  updatePattern: (pattern: DrumPattern) => void;
}

export function useToneEngine(options: UseToneEngineOptions): UseToneEngineReturn {
  const { bpm = DEFAULT_BPM, isAudioReady, onStep } = options;
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  // 使用 ref 存储 pattern，避免重新创建 sequence
  const patternRef = useRef<DrumPattern>({
    kick: Array(16).fill(false),
    snare: Array(16).fill(false),
    hihat: Array(16).fill(false),
  });
  
  const sequenceRef = useRef<Tone.Sequence | null>(null);
  const initializedRef = useRef(false);

  // ============================================
  // 初始化 Sequence (当音频准备好后)
  // ============================================
  
  useEffect(() => {
    if (!isAudioReady || initializedRef.current) return;
    
    // 设置 BPM
    Tone.Transport.bpm.value = bpm;
    
    // 创建 16-step sequence
    const sequence = new Tone.Sequence(
      (time, step) => {
        // 播放当前 step 的鼓点
        if (patternRef.current.kick[step]) {
          triggerKick(time);
        }
        if (patternRef.current.snare[step]) {
          triggerSnare(time);
        }
        if (patternRef.current.hihat[step]) {
          triggerHiHat(time);
        }
        
        // 同步更新 UI (使用 Tone.Draw 确保与音频同步)
        if (onStep) {
          Tone.Draw.schedule(() => {
            onStep(step);
          }, time);
        }
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      '16n'
    );
    
    sequence.start(0);
    sequenceRef.current = sequence;
    initializedRef.current = true;
    
    return () => {
      sequence.dispose();
      sequenceRef.current = null;
      initializedRef.current = false;
    };
  }, [isAudioReady, bpm, onStep]);

  // ============================================
  // 播放控制
  // ============================================
  
  const start = useCallback(() => {
    if (!initializedRef.current) return;
    
    Tone.Transport.start();
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (!initializedRef.current) return;
    
    Tone.Transport.stop();
    setIsPlaying(false);
    
    // 重置 step 显示
    if (onStep) {
      onStep(-1);
    }
  }, [onStep]);

  // ============================================
  // 静音控制
  // ============================================
  
  const setMuted = useCallback((muted: boolean) => {
    setDrumMuted(muted);
  }, []);

  // ============================================
  // 更新 Pattern
  // ============================================
  
  const updatePattern = useCallback((pattern: DrumPattern) => {
    patternRef.current = pattern;
  }, []);

  // ============================================
  // 清理
  // ============================================
  
  useEffect(() => {
    return () => {
      stop();
      disposeDrumSynths();
    };
  }, [stop]);

  // BPM 变化时更新
  useEffect(() => {
    if (initializedRef.current) {
      Tone.Transport.bpm.value = bpm;
    }
  }, [bpm]);

  return {
    isPlaying,
    start,
    stop,
    setMuted,
    updatePattern,
  };
}
