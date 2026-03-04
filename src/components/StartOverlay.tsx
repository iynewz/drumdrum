// ============================================
// justBeat - 启动遮罩层
// ============================================

import { useState, useCallback } from 'react';
import { useDrumMachine } from '@/context/DrumMachineContext';

interface StartOverlayProps {
  onStart: () => void;
}

export function StartOverlay({ onStart }: StartOverlayProps) {
  const [isStarting, setIsStarting] = useState(false);
  const { initAudio } = useDrumMachine();

  const handleClick = useCallback(async () => {
    setIsStarting(true);
    try {
      await initAudio();
      onStart();
    } catch (error) {
      console.error('Failed to start audio:', error);
      setIsStarting(false);
    }
  }, [initAudio, onStart]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-industrial-900/95 backdrop-blur-sm">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-neon-green">just</span>
          <span className="text-white">Beat</span>
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          调到合适音量，准备！
        </p>
        <button
          onClick={handleClick}
          disabled={isStarting}
          className="
            px-8 py-3 rounded-lg font-bold text-lg
            bg-neon-green text-industrial-900
            hover:bg-green-400 hover:scale-105
            active:scale-95
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:scale-100
          "
        >
          {isStarting ? '启动中...' : '开始'}
        </button>
      </div>
    </div>
  );
}
