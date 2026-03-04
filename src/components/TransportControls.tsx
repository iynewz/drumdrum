// ============================================
// justBeat - 播放控制组件
// ============================================

import { useDrumMachine } from '@/context/DrumMachineContext';
import { useDrumMachine as useDrumMachineControl } from '@/hooks/useDrumMachine';

export function TransportControls() {
  const { state, setPlaying, clearAll, randomize } = useDrumMachine();
  const { start, stop } = useDrumMachineControl();
  const { isPlaying } = state;

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
    <div className="flex items-center gap-3">
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
    </div>
  );
}
