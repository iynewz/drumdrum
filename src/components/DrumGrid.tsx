// ============================================
// justBeat - 鼓机网格组件
// ============================================

import { useDrumMachine } from "@/context/DrumMachineContext";
import { StepCell } from "./StepCell";
import type { DrumType } from "@/types";

const DRUM_TYPES: DrumType[] = ["kick", "snare", "hihat"];
const TOTAL_STEPS = 16;

export function DrumGrid() {
  const { state, toggleStep } = useDrumMachine();
  const { pattern, currentStep, isPlaying } = state;

  // 计算扫描线位置 (0-100%)
  const scanLinePosition = ((currentStep + 0.5) / TOTAL_STEPS) * 100;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[600px] px-8 py-6 relative">
        {/* 网格 */}
        <div className="space-y-3 relative">
          {DRUM_TYPES.map((drumType) => (
            <div key={drumType} className="grid grid-cols-16 gap-1 relative">
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

          {/* 扫描竖线 - 跟随当前播放位置 */}
          <div
            className={`
              absolute top-[-8px] bottom-[-8px] w-0.5 pointer-events-none z-10
              transition-all duration-75 ease-linear
              ${
                isPlaying
                  ? "bg-neon-orange shadow-[0_0_15px_rgba(255,107,53,1),0_0_30px_rgba(255,107,53,0.5)] opacity-100"
                  : "opacity-0"
              }
            `}
            style={{
              left: `${scanLinePosition}%`,
              transform: "translateX(-50%)",
            }}
          >
            {/* 扫描线顶部指示器 */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-orange rounded-full shadow-[0_0_10px_rgba(255,107,53,1)]" />
            {/* 扫描线底部指示器 */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-neon-orange rounded-full shadow-[0_0_10px_rgba(255,107,53,1)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
