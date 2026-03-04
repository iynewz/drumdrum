// ============================================
// justBeat - 单个步进按钮组件
// ============================================

import { memo } from 'react';
import type { DrumType } from '@/types';

interface StepCellProps {
  drumType: DrumType;
  step: number;
  isActive: boolean;
  isCurrent: boolean;
  onToggle: (drumType: DrumType, step: number) => void;
}

// 鼓类型标签
const DRUM_LABELS: Record<DrumType, string> = {
  kick: 'BD',
  snare: 'SD',
  hihat: 'HH',
};

// 鼓类型颜色
const DRUM_COLORS: Record<DrumType, { active: string }> = {
  kick: {
    active: 'bg-neon-green shadow-[0_0_10px_rgba(0,255,136,0.5)]',
  },
  snare: {
    active: 'bg-neon-orange shadow-[0_0_10px_rgba(255,107,53,0.5)]',
  },
  hihat: {
    active: 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]',
  },
};

export const StepCell = memo(function StepCell({
  drumType,
  step,
  isActive,
  isCurrent,
  onToggle,
}: StepCellProps) {
  const colors = DRUM_COLORS[drumType];
  
  // 计算样式
  const baseClasses = `
    relative w-full aspect-square rounded-md
    border-2 transition-all duration-75
    flex items-center justify-center
    text-xs font-bold select-none
  `;
  
  // 激活状态
  const stateClasses = isActive
    ? `${colors.active} text-industrial-900 border-transparent scale-95`
    : 'bg-industrial-600 border-industrial-500 text-gray-600 hover:bg-industrial-500 hover:border-industrial-400';
  
  // 当前步：轻微高亮边框（扫描线提供主要视觉反馈）
  const currentClasses = isCurrent && !isActive
    ? 'border-neon-orange/50 bg-industrial-500/50'
    : '';

  // 只在每组的第一个显示数字 (0, 4, 8, 12)
  const showBeatNumber = step % 4 === 0;
  const beatNumber = Math.floor(step / 4) + 1;

  return (
    <button
      className={`${baseClasses} ${stateClasses} ${currentClasses}`}
      onClick={() => onToggle(drumType, step)}
      aria-label={`${DRUM_LABELS[drumType]} step ${step + 1}`}
      aria-pressed={isActive}
    >
      {/* 每组的第一个显示数字 1, 2, 3, 4 */}
      {showBeatNumber && drumType === 'kick' && (
        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 font-bold">
          {beatNumber}
        </span>
      )}
      
      {/* 只在第一列显示鼓类型标签 */}
      {step === 0 && (
        <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs text-gray-400 w-6 text-right">
          {DRUM_LABELS[drumType]}
        </span>
      )}
    </button>
  );
});
