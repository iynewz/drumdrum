// ============================================
// justBeat - 音量控制组件
// ============================================

import { useDrumMachine } from '@/context/DrumMachineContext';
import { useDrumMachine as useDrumMachineControl } from '@/hooks/useDrumMachine';

export function VolumeControl() {
  const { state } = useDrumMachine();
  const { toggleMute } = useDrumMachineControl();
  const { isMuted } = state;

  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    toggleMute(newMuted);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Mute 按钮 */}
      <button
        onClick={handleMuteToggle}
        className={`
          px-4 py-2 rounded-md font-medium text-sm uppercase tracking-wider
          transition-all duration-100
          ${isMuted
            ? 'bg-neon-red text-white'
            : 'bg-industrial-600 text-gray-300 hover:bg-industrial-500'
          }
        `}
        title={isMuted ? '取消静音' : '静音鼓机'}
      >
        {isMuted ? 'Muted' : 'Mute'}
      </button>

      {/* 状态指示 */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <div 
          className={`
            w-2 h-2 rounded-full
            ${isMuted ? 'bg-neon-red' : 'bg-neon-green animate-pulse'}
          `} 
        />
        <span>{isMuted ? 'Drums Off' : 'Drums On'}</span>
      </div>
    </div>
  );
}
