# Bug 修复：点击开始后背景音乐不播放

## 问题描述

用户点击"开始"按钮后，鼓机 UI 正常显示（红色进度条在走），但背景音乐（`tracks/metal-120.mp3`）听不到声音。

## 根因分析

此 bug 由**两个独立问题**共同导致：

### Bug 1：Tone.Player 未连接音频输出

`useDrumMachine.ts` 的 `initBackingTrack` 中，`Tone.Player` 创建后**没有连接到 `Tone.Destination`**，导致即使 Player 在播放，音频信号也无法到达扬声器。

对比鼓声合成器的写法（正确）：
```typescript
// drumSynths.ts — 鼓声正确连接到输出
drumBus = new Tone.Volume(DEFAULT_VOLUME.drum).toDestination();
kickSynth = new Tone.MembraneSynth({...}).connect(drumBus);
```

而 backing track 的 Player（错误）：
```typescript
// useDrumMachine.ts — 缺少 .toDestination()
const player = new Tone.Player({
  url: track.url,
  loop: true,
  autostart: false,
  volume: -8,
});
// ← 没有 .toDestination()，音频无处可去
```

**修复**：添加 `.toDestination()`：
```typescript
const player = new Tone.Player({
  url: track.url,
  loop: true,
  autostart: false,
  volume: -8,
}).toDestination();
```

### Bug 2：React 闭包陈旧（stale closure）

`App.tsx` 中用 `setTimeout(() => start(), 100)` 调用 `start()`，但 `start` 函数在闭包中捕获的 `isAudioReady` 仍为 `false`（`initAudio()` 的状态更新尚未在 React 渲染中生效），导致 `start()` 直接 return。

```
时间线：
─────────────────────────────────────────────────────
 t0: 用户点击"开始"
 t1: initAudio() → setIsAudioReady(true)  [状态入队，未生效]
 t2: onStart() → handleStart() → setTimeout(start, 100)
     此时 start 闭包中 isAudioReady = false ❌
 t3: React 重新渲染，isAudioReady 生效为 true
     新的 start 函数被创建（isAudioReady = true）
     但 setTimeout 中引用的仍是旧的 start ❌
 t4: 100ms 后，旧 start() 执行 → isAudioReady = false → return
     backing track 从未初始化 ❌
─────────────────────────────────────────────────────
```

**修复**：用 `useEffect` + `shouldAutoStart` 状态标志替代 `setTimeout`，确保在 React 重新渲染后、`isAudioReady` 为 `true` 时才调用 `start()`：
```typescript
const [shouldAutoStart, setShouldAutoStart] = useState(false);

useEffect(() => {
  if (shouldAutoStart && isAudioReady) {
    start();   // ← 此时 start 是最新闭包，isAudioReady = true ✅
    setShouldAutoStart(false);
  }
}, [shouldAutoStart, isAudioReady, start]);

const handleStart = useCallback(() => {
  setIsStarted(true);
  setShowOverlay(false);
  setShouldAutoStart(true);
}, []);
```

## 涉及文件

- `src/hooks/useDrumMachine.ts` — Player 添加 `.toDestination()`
- `src/App.tsx` — 用 `useEffect` 替代 `setTimeout` 修复闭包问题

## 经验教训

1. **Tone.js 的 Player 不会自动连接到音频输出**，必须显式调用 `.toDestination()` 或 `.connect(node)`。
2. 在 React 中，**不要依赖 `setTimeout` 来等待状态更新生效**。闭包中捕获的值不会因为延迟执行而更新，应使用 `useEffect` 响应状态变化。
