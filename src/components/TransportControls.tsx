// ============================================
// justBeat - 播放控制组件
// ============================================

import { useState, useRef, useEffect } from 'react';
import { useDrumMachine } from '@/context/DrumMachineContext';
import { useDrumMachine as useDrumMachineControl } from '@/hooks/useDrumMachine';
import { GenreSelector } from './GenreSelector';
import { PRESET_PATTERNS } from '@/constants/config';

export function TransportControls() {
  const { state, setPlaying, clearAll, randomize, loadPreset } = useDrumMachine();
  const { start, stop } = useDrumMachineControl();
  const { isPlaying } = state;
  const [showPresets, setShowPresets] = useState(false);
  const presetsRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭下拉
  useEffect(() => {
    if (!showPresets) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (presetsRef.current && !presetsRef.current.contains(e.target as Node)) {
        setShowPresets(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPresets]);

  const handlePlayClick = () => {
    if (isPlaying) {
      stop();
      setPlaying(false);
    } else {
      start();
      setPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* 播放/暂停按钮 */}
      <button
        onClick={handlePlayClick}
        className={`
          px-6 py-2 rounded-md font-bold text-sm uppercase tracking-wider
          transition-all duration-100
          ${isPlaying 
            ? 'bg-neon-orange text-white hover:bg-orange-500' 
            : 'bg-neon-green text-industrial-900 hover:bg-green-400'
          }
        `}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </button>

      {/* 清除按钮 */}
      <button
        onClick={clearAll}
        className="
          px-4 py-2 rounded-md font-medium text-sm
          bg-industrial-600 text-gray-300
          hover:bg-industrial-500 hover:text-white
          transition-colors
        "
        title="清除所有鼓点"
      >
        Clear
      </button>

      {/* 随机生成按钮 */}
      <button
        onClick={randomize}
        className="
          px-4 py-2 rounded-md font-medium text-sm
          bg-industrial-600 text-gray-300
          hover:bg-industrial-500 hover:text-white
          transition-colors
        "
        title="随机生成节奏"
      >
        Random
      </button>

      {/* 预设 Pattern */}
      <div className="relative" ref={presetsRef}>
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="
            px-4 py-2 rounded-md font-medium text-sm
            bg-industrial-600 text-gray-300
            hover:bg-industrial-500 hover:text-white
            transition-colors
          "
          title="加载预设节奏"
        >
          Preset
        </button>
        {showPresets && (
          <div className="absolute top-full left-0 mt-1 bg-industrial-600 rounded-md shadow-lg border border-industrial-500 z-10 min-w-[140px]">
            {PRESET_PATTERNS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  loadPreset(preset.pattern);
                  setShowPresets(false);
                }}
                className="
                  block w-full text-left px-4 py-2 text-sm text-gray-300
                  hover:bg-industrial-500 hover:text-white
                  first:rounded-t-md last:rounded-b-md
                  transition-colors
                "
              >
                {preset.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Genre 选择器 */}
      <div className="ml-2 border-l border-industrial-500 pl-3">
        <GenreSelector />
      </div>
    </div>
  );
}
