// ============================================
// justBeat - Drum Machine 主控制 Hook
// ============================================

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDrumMachine as useDrumMachineContext } from '@/context/DrumMachineContext';
import { useToneEngine } from './useToneEngine';
import * as Tone from 'tone';
import type { BackingTrack, Genre } from '@/types';
import { BACKING_TRACKS } from '@/constants/config';

export function useDrumMachine() {
  const { 
    state, 
    setPlaying, 
    setMuted, 
    setCurrentStep, 
    setTrack,
    setGenre,
    isAudioReady 
  } = useDrumMachineContext();
  
  const backingPlayerRef = useRef<Tone.Player | null>(null);
  const currentTrackRef = useRef<BackingTrack>(state.currentTrack);
  const isPlayingRef = useRef(state.isPlaying);
  const bpmRef = useRef(state.bpm);

  // 更新当前 track ref
  useEffect(() => {
    currentTrackRef.current = state.currentTrack;
  }, [state.currentTrack]);
  
  // 更新 isPlaying ref
  useEffect(() => {
    isPlayingRef.current = state.isPlaying;
  }, [state.isPlaying]);
  
  // 更新 BPM ref
  useEffect(() => {
    bpmRef.current = state.bpm;
  }, [state.bpm]);
  
  // Tone.js 引擎
  const toneEngine = useToneEngine({
    bpm: state.bpm,
    isAudioReady,
    onStep: setCurrentStep,
  });
  
  // 使用 ref 存储 toneEngine，避免 effect 依赖问题
  const toneEngineRef = useRef(toneEngine);
  useEffect(() => {
    toneEngineRef.current = toneEngine;
  }, [toneEngine]);

  // ============================================
  // 初始化 Backing Track
  // ============================================
  const initBackingTrack = useCallback(async (track: BackingTrack) => {
    // 先清理旧的 player
    if (backingPlayerRef.current) {
      backingPlayerRef.current.stop();
      backingPlayerRef.current.unsync();
      backingPlayerRef.current.dispose();
      backingPlayerRef.current = null;
    }

    try {
      console.log('[DrumMachine] Loading backing track:', track.url);
      
      const player = new Tone.Player({
        url: track.url,
        loop: true,
        autostart: false,
        volume: -8,
      });

      // 等待这个特定 player 加载完成
      await player.load(track.url);
      console.log('[DrumMachine] Backing track loaded successfully');
      
      backingPlayerRef.current = player;
      
      // 同步到 Transport，但不立即启动
      player.sync().start(0);
      
      return true;
    } catch (error) {
      console.error('[DrumMachine] Failed to load backing track:', error);
      return false;
    }
  }, []);

  // ============================================
  // 播放控制
  // ============================================
  
  const start = useCallback(async () => {
    if (!isAudioReady) {
      console.warn('[DrumMachine] Cannot start: audio not ready');
      return;
    }

    // 如果 backing track 未初始化，先初始化
    if (!backingPlayerRef.current) {
      console.log('[DrumMachine] Initializing backing track...');
      const success = await initBackingTrack(currentTrackRef.current);
      if (!success) {
        console.error('[DrumMachine] Failed to initialize backing track');
      }
    }
    
    // 确保 Transport 已停止，然后重新开始
    Tone.Transport.stop();
    Tone.Transport.position = 0;
    
    // 设置 BPM
    Tone.Transport.bpm.value = bpmRef.current;
    
    console.log('[DrumMachine] Starting playback at BPM:', bpmRef.current);
    
    // 启动 Transport (这会同时启动所有 sync 的 player 和 sequence)
    Tone.Transport.start();
    
    setPlaying(true);
  }, [isAudioReady, initBackingTrack, setPlaying]);

  const stop = useCallback(() => {
    if (!isAudioReady) return;
    
    Tone.Transport.stop();
    toneEngineRef.current.stop();
    setPlaying(false);
  // 使用 ref 避免依赖 toneEngine
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAudioReady, setPlaying]);

  // ============================================
  // 静音控制
  // ============================================
  
  const toggleMute = useCallback((muted: boolean) => {
    toneEngineRef.current.setMuted(muted);
    setMuted(muted);
  // 使用 ref 避免依赖 toneEngine
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMuted]);

  // ============================================
  // 切换 Track
  // ============================================
  const changeTrack = useCallback(async (track: BackingTrack) => {
    const wasPlaying = isPlayingRef.current;
    
    // 如果正在播放，先停止
    if (wasPlaying) {
      Tone.Transport.stop();
    }

    // 更新 track
    setTrack(track);
    
    // 重新初始化 backing track
    const success = await initBackingTrack(track);
    
    if (success && wasPlaying) {
      // 如果之前在播放，继续播放新 track
      Tone.Transport.bpm.value = track.bpm;
      Tone.Transport.position = 0;
      Tone.Transport.start();
    }
  }, [setTrack, initBackingTrack]);

  // ============================================
  // 切换 Genre
  // ============================================
  const changeGenre = useCallback(async (newGenre: Genre) => {
    // 找到新 genre 下的第一首 track
    const track = BACKING_TRACKS.find(t => t.genre === newGenre);
    if (!track) return;

    const wasPlaying = isPlayingRef.current;
    
    // 如果正在播放，先停止
    if (wasPlaying) {
      Tone.Transport.stop();
    }

    // 更新 genre 和 track
    setGenre(newGenre, track);
    
    // 重新初始化 backing track
    const success = await initBackingTrack(track);
    
    if (success && wasPlaying) {
      // 如果之前在播放，继续播放
      Tone.Transport.bpm.value = track.bpm;
      Tone.Transport.position = 0;
      Tone.Transport.start();
    }
  }, [setGenre, initBackingTrack]);

  // ============================================
  // 同步 pattern 到引擎
  // ============================================
  useEffect(() => {
    toneEngineRef.current.updatePattern(state.pattern);
    // 只依赖 pattern，toneEngine 用 ref 获取
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pattern]);

  // ============================================
  // 同步 BPM 到 Transport
  // ============================================
  useEffect(() => {
    if (isAudioReady) {
      Tone.Transport.bpm.value = state.bpm;
    }
  }, [state.bpm, isAudioReady]);

  // ============================================
  // 清理
  // ============================================
  useEffect(() => {
    return () => {
      // 直接调用而不是依赖 stop 回调，避免循环
      if (isAudioReady) {
        Tone.Transport.stop();
      }
      backingPlayerRef.current?.stop();
      backingPlayerRef.current?.unsync();
      backingPlayerRef.current?.dispose();
      backingPlayerRef.current = null;
    };
    // 故意不依赖 stop，避免循环依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // 稳定返回对象引用
  // ============================================
  return useMemo(() => ({
    // 状态
    state,
    isAudioReady,
    
    // 播放控制
    start,
    stop,
    
    // 静音控制
    toggleMute,
    
    // Track/Genre 控制
    changeTrack,
    changeGenre,
    initBackingTrack,
  }), [state, isAudioReady, start, stop, toggleMute, changeTrack, changeGenre, initBackingTrack]);
}
