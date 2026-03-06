// ============================================
// justBeat - Tone.js 引擎管理 Hook
// ============================================

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import * as Tone from "tone";
import type { DrumPattern } from "@/types";
import {
  triggerKick,
  triggerSnare,
  triggerHiHat,
  setDrumMuted,
  disposeDrumSynths,
} from "@/audio/drumSynths";
import { DEFAULT_BPM } from "@/constants/config";

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

export function useToneEngine(
  options: UseToneEngineOptions,
): UseToneEngineReturn {
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

  // 使用 ref 存储 onStep 回调，避免依赖变化导致重建 sequence
  const onStepRef = useRef(onStep);
  useEffect(() => {
    onStepRef.current = onStep;
  }, [onStep]);

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
        if (onStepRef.current) {
          Tone.Draw.schedule(() => {
            onStepRef.current?.(step);
          }, time);
        }
      },
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      "16n",
    );

    sequence.start(0);
    sequenceRef.current = sequence;
    initializedRef.current = true;

    return () => {
      console.log("🧹 [ToneEngine] Cleanup triggered! 正在清理..."); // 加这一行！
      sequenceRef.current?.stop();
      sequenceRef.current?.dispose();
      sequenceRef.current = null;
      initializedRef.current = false;
      console.log("✅ [ToneEngine] Cleanup done"); // 加这一行！
    };
  }, [isAudioReady]);

  // ============================================
  // 播放控制
  // ============================================

  const start = useCallback(() => {
    if (!initializedRef.current) {
      console.warn("[ToneEngine] Cannot start: not initialized");
      return;
    }

    console.log("[ToneEngine] Drum sequence ready");
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    if (!initializedRef.current) return;

    setIsPlaying(false);

    // 重置 step 显示 (使用 ref 获取最新回调)
    if (onStepRef.current) {
      onStepRef.current(-1);
    }
  }, []);

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
      // 组件卸载时停止并清理
      if (initializedRef.current) {
        Tone.Transport.stop();
        setIsPlaying(false);
        if (onStepRef.current) {
          onStepRef.current(-1);
        }
      }
      disposeDrumSynths();
    };
    // 故意不依赖 stop，避免循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BPM 变化时更新
  useEffect(() => {
    console.log("⏱️ [ToneEngine] BPM updated to:", bpm);

    if (!isAudioReady) return;

    if (initializedRef.current) {
      Tone.Transport.bpm.value = bpm;
    }
  }, [bpm]);

  // ============================================
  // 稳定返回对象引用
  // ============================================
  return useMemo(
    () => ({
      isPlaying,
      start,
      stop,
      setMuted,
      updatePattern,
    }),
    [isPlaying, start, stop, setMuted, updatePattern],
  );
}
