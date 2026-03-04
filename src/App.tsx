// ============================================
// justBeat - 主应用组件
// ============================================

import { useState, useCallback } from 'react';
import { DrumMachineProvider } from '@/context/DrumMachineContext';
import { DrumGrid } from '@/components/DrumGrid';
import { TransportControls } from '@/components/TransportControls';
import { VolumeControl } from '@/components/VolumeControl';
import { StartOverlay } from '@/components/StartOverlay';
import { useDrumMachine } from '@/context/DrumMachineContext';
import { useDrumMachine as useDrumMachineControl } from '@/hooks/useDrumMachine';

// 内部组件，使用 hook
function AppContent() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const { state } = useDrumMachine();
  const { start } = useDrumMachineControl();

  // 启动应用并开始播放
  const handleStart = useCallback(async () => {
    setIsStarted(true);
    setShowOverlay(false);
    
    // 延迟一点后开始播放，让 UI 先渲染
    setTimeout(() => {
      start();
    }, 100);
  }, [start]);

  return (
    <>
      {/* 启动遮罩层 */}
      {showOverlay && <StartOverlay onStart={handleStart} />}

      <div className="min-h-screen bg-industrial-900 text-gray-200 flex flex-col items-center justify-center p-4">
        {/* 标题 */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-wider mb-2">
            <span className="text-neon-green">just</span>
            <span className="text-white">Beat</span>
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            把焦虑的无鼓金属乐，变成你的力量节拍
          </p>
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
                <span className="text-gray-400">{state.currentTrack.bpm} BPM</span>
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

        {/* 底部说明 */}
        <footer className="mt-8 text-center text-gray-500 text-xs">
          <p>点击网格添加鼓点 · 下一循环生效 · 无需音乐理论，即刻创作</p>
        </footer>
      </div>
    </>
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
