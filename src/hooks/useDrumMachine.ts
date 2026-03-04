// ============================================
// justBeat - Drum Machine 主控制 Hook
// ============================================

import { useCallback, useEffect } from 'react';
import { useDrumMachine as useDrumMachineContext } from '@/context/DrumMachineContext';
import { useToneEngine } from './useToneEngine';

export function useDrumMachine() {
  const { state, setPlaying, setMuted, setCurrentStep, isAudioReady } = useDrumMachineContext();
  
  // Tone.js 引擎
  const toneEngine = useToneEngine({
    bpm: state.bpm,
    isAudioReady,
    onStep: setCurrentStep,
  });

  // ============================================
  // 同步 pattern 到引擎
  // ============================================
  
  useEffect(() => {
    toneEngine.updatePattern(state.pattern);
  }, [state.pattern, toneEngine]);

  // ============================================
  // 播放控制
  // ============================================
  
  const start = useCallback(() => {
    if (!isAudioReady) return;
    
    toneEngine.start();
    setPlaying(true);
  }, [isAudioReady, toneEngine, setPlaying]);

  const stop = useCallback(() => {
    if (!isAudioReady) return;
    
    toneEngine.stop();
    setPlaying(false);
  }, [isAudioReady, toneEngine, setPlaying]);

  const togglePlay = useCallback(() => {
    if (state.isPlaying) {
      stop();
    } else {
      start();
    }
  }, [state.isPlaying, start, stop]);

  // ============================================
  // 静音控制
  // ============================================
  
  const toggleMute = useCallback((muted: boolean) => {
    toneEngine.setMuted(muted);
    setMuted(muted);
  }, [toneEngine, setMuted]);

  return {
    // 状态
    state,
    isAudioReady,
    
    // 播放控制
    start,
    stop,
    togglePlay,
    
    // 静音控制
    toggleMute,
  };
}
