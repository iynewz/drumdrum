// ============================================
// justBeat - 背景音乐控制 Hook
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';
import type { BackingTrack } from '@/types';
import { DEFAULT_VOLUME } from '@/constants/config';

interface UseBackingTrackOptions {
  track: BackingTrack;
  autoPlay?: boolean;
}

interface UseBackingTrackReturn {
  isLoaded: boolean;
  isPlaying: boolean;
  volume: number;
  load: () => Promise<void>;
  play: () => void;
  pause: () => void;
  stop: () => void;
  setVolume: (volume: number) => void;
}

export function useBackingTrack(options: UseBackingTrackOptions): UseBackingTrackReturn {
  const { track, autoPlay = false } = options;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME.backing);
  
  const playerRef = useRef<Tone.Player | null>(null);

  // ============================================
  // 加载音频
  // ============================================
  
  const load = useCallback(async () => {
    if (playerRef.current) return;
    
    const player = new Tone.Player({
      url: track.url,
      loop: true,
      autostart: false,
      volume: DEFAULT_VOLUME.backing,
    });
    
    // 等待加载完成
    await Tone.loaded();
    
    playerRef.current = player;
    setIsLoaded(true);
    
    if (autoPlay) {
      player.sync().start(0);
    }
  }, [track.url, autoPlay]);

  // ============================================
  // 播放控制
  // ============================================
  
  const play = useCallback(() => {
    if (!playerRef.current || !isLoaded) return;
    
    // 同步到 Transport 并播放
    playerRef.current.sync().start(0);
    setIsPlaying(true);
  }, [isLoaded]);

  const pause = useCallback(() => {
    if (!playerRef.current) return;
    
    playerRef.current.stop();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    if (!playerRef.current) return;
    
    playerRef.current.stop();
    playerRef.current.unsync();
    setIsPlaying(false);
  }, []);

  // ============================================
  // 音量控制
  // ============================================
  
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (playerRef.current) {
      playerRef.current.volume.value = newVolume;
    }
  }, []);

  // ============================================
  // 清理
  // ============================================
  
  useEffect(() => {
    return () => {
      stop();
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, [stop]);

  return {
    isLoaded,
    isPlaying,
    volume,
    load,
    play,
    pause,
    stop,
    setVolume,
  };
}
