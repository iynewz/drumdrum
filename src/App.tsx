// ============================================
// justBeat - 主应用组件
// ============================================

import { useState, useCallback } from "react";
import { DrumMachineProvider } from "@/context/DrumMachineContext";
import { DrumGrid } from "@/components/DrumGrid";
import { TransportControls } from "@/components/TransportControls";
import { VolumeControl } from "@/components/VolumeControl";
import { StartOverlay } from "@/components/StartOverlay";


// 内部组件，使用 hook
function AppContent() {
  const [showOverlay, setShowOverlay] = useState(true);

  const handleStart = useCallback(() => {
    setShowOverlay(false);
  }, []);

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
          <p>iynewz made with love </p>
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
