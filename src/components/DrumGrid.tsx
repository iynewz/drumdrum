// ============================================
// justBeat - 鼓机网格组件
// ============================================

import { useDrumMachine } from '@/context/DrumMachineContext';
import { StepCell } from './StepCell';
import type { DrumType } from '@/types';

const DRUM_TYPES: DrumType[] = ['kick', 'snare', 'hihat'];

export function DrumGrid() {
  const { state, toggleStep } = useDrumMachine();
  const { pattern, currentStep } = state;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] px-8 py-4 relative">
        {/* 网格 */}
        <div className="space-y-3">
          {DRUM_TYPES.map((drumType) => (
            <div key={drumType} className="grid grid-cols-16 gap-1">
              {pattern[drumType].map((isActive, stepIndex) => (
                <StepCell
                  key={`${drumType}-${stepIndex}`}
                  drumType={drumType}
                  step={stepIndex}
                  isActive={isActive}
                  isCurrent={currentStep === stepIndex}
                  onToggle={toggleStep}
                />
              ))}
            </div>
          ))}
        </div>

        {/* 分割线 - 每4步 */}
        <div className="absolute top-0 bottom-0 left-[calc(25%+16px)] w-px bg-industrial-500 opacity-30" />
        <div className="absolute top-0 bottom-0 left-[calc(50%+16px)] w-px bg-industrial-500 opacity-30" />
        <div className="absolute top-0 bottom-0 left-[calc(75%+16px)] w-px bg-industrial-500 opacity-30" />
      </div>
    </div>
  );
}
