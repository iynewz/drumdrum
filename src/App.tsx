// ============================================
// justBeat - 主应用组件
// ============================================

import { useState, useCallback, useEffect } from "react";
import { DrumMachineProvider } from "@/context/DrumMachineContext";
import { DrumGrid } from "@/components/DrumGrid";
import { TransportControls } from "@/components/TransportControls";
import { VolumeControl } from "@/components/VolumeControl";
import { StartOverlay } from "@/components/StartOverlay";
import { useDrumMachine } from "@/context/DrumMachineContext";
import { useDrumMachine as useDrumMachineControl } from "@/hooks/useDrumMachine";
import { ParticleBackground } from "@/components/ParticleBackground";

// 内部组件，使用 hook
function AppContent() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [shouldAutoStart, setShouldAutoStart] = useState(false);
  const { state, isAudioReady } = useDrumMachine();
  const { start } = useDrumMachineControl();

  // 当 isAudioReady 变为 true 且需要自动开始时，启动播放
  useEffect(() => {
    if (shouldAutoStart && isAudioReady) {
      start();
      setShouldAutoStart(false);
    }
  }, [shouldAutoStart, isAudioReady, start]);

  // 启动应用并标记需要自动开始
  const handleStart = useCallback(() => {
    setIsStarted(true);
    setShowOverlay(false);
    setShouldAutoStart(true);
  }, []);

  return (
    <div className="min-h-screen bg-industrial-900">
      {/* 背景粒子动画 */}
      <ParticleBackground />

      {/* 启动遮罩层 */}
      {showOverlay && <StartOverlay onStart={handleStart} />}

      <div className="relative z-10 min-h-screen text-gray-200 flex flex-col items-center justify-center p-4">
        {/* 标题 */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-2">
            <span className="text-neon-green">just</span>
            <span className="text-white">Beat</span>
          </h1>
        </header>

        {/* 主控制面板 */}
        <main className="w-full max-w-4xl bg-industrial-700 rounded-lg p-6 shadow-2xl border border-industrial-500">
          {/* 当前曲目信息 */}
          {isStarted && (
            <div className="mb-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Now Playing:</span>
                <span className="text-neon-green font-medium">
                  {state.currentTrack.name}
                </span>
                <span className="text-gray-600">|</span>
                <span className="text-gray-400">
                  {state.currentTrack.bpm} BPM
                </span>
              </div>
            </div>
          )}

          {/* 控制栏 */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-industrial-500">
            <TransportControls />
            <VolumeControl />
          </div>

          {/* 鼓机网格 */}
          <DrumGrid />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <DrumMachineProvider>
      <AppContent />
    </DrumMachineProvider>
  );
}

export default App;
