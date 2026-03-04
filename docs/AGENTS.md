# justBeat - AGENTS.md

> 项目背景、技术决策和开发指南

---

## 1. 项目概述

**justBeat** 是一款即时音乐创作小游戏。用户通过简单的点击操作，为无鼓金属乐背景音轨添加鼓点节奏，将原本略显焦虑的"无鼓金属乐"转化为充满力量感的完整金属摇滚。

**核心理念**: 用户即是鼓手，无需音乐理论，点击即可创作。

---

## 2. 技术栈

| 层级 | 技术 | 版本/说明 |
|------|------|----------|
| 框架 | React | 18+ |
| 构建工具 | Vite | 最新稳定版 |
| 样式 | Tailwind CSS | 3.x |
| 音频引擎 | Tone.js | 14.x |
| 状态管理 | React Context + useReducer | 内置 |
| 语言 | TypeScript | 5.x |

---

## 3. 为什么选择 Tone.js

Tone.js 是一个基于 Web Audio API 的高级音频框架，为 justBeat 提供了以下优势：

### 3.1 内置 Transport 系统
- 无需自己实现复杂的 lookahead scheduler
- 内置 `Tone.Transport` 提供精确的 BPM 同步
- `Tone.Loop` 和 `Tone.Sequence` 简化节拍逻辑

### 3.2 内置合成器
```typescript
// Kick - 底鼓
new Tone.MembraneSynth()

// Snare - 军鼓  
new Tone.NoiseSynth({ noise: { type: 'white' } })

// Hi-Hat - 踩镲
new Tone.MetalSynth()
```

### 3.3 与 Backing Track 同步
```typescript
// 统一使用 Tone.Transport 的 BPM
Tone.Transport.bpm.value = backingTrack.bpm
// Backing Track 和 Drum Machine 共享同一时间线
```

### 3.4 代码对比

**原生 Web Audio API** (~200 行):
```typescript
// 需要手动实现 scheduler
// 需要手动创建 oscillator + gain node
// 需要手动计算 nextNoteTime
// ...
```

**Tone.js** (~50 行):
```typescript
const kick = new Tone.MembraneSynth().toDestination()
const loop = new Tone.Loop((time) => {
  if (pattern[currentStep]) kick.triggerAttackRelease("C1", "8n", time)
}, "16n").start(0)
Tone.Transport.start()
```

---

## 4. 项目结构

```
src/
├── components/           # React 组件
│   ├── DrumGrid.tsx     # 16-step 鼓机网格
│   ├── StepCell.tsx     # 单个步进按钮
│   ├── TransportControls.tsx  # 播放控制
│   └── VolumeControl.tsx      # 音量控制
├── hooks/               # 自定义 Hooks
│   ├── useToneEngine.ts # Tone.js 初始化与管理
│   ├── useDrumMachine.ts # 鼓机逻辑
│   └── useBackingTrack.ts # 背景音乐控制
├── audio/               # 音频相关
│   ├── drumSynths.ts    # 鼓合成器配置
│   └── tracks.ts        # Backing Track 数据
├── context/             # React Context
│   └── DrumMachineContext.tsx
├── types/               # TypeScript 类型
│   └── index.ts
├── constants/           # 常量
│   └── config.ts
└── App.tsx
```

---

## 5. 关键实现细节

### 5.1 Tone.js 初始化模式

Tone.js 需要用户交互才能启动 AudioContext。采用以下模式：

```typescript
// hooks/useToneEngine.ts
export const useToneEngine = () => {
  const [isReady, setIsReady] = useState(false)
  
  const initAudio = async () => {
    await Tone.start()  // 必须在用户交互后调用
    setIsReady(true)
  }
  
  // ...
}
```

### 5.2 16-Step Sequencer 实现

使用 `Tone.Sequence` 替代手动调度：

```typescript
const sequence = new Tone.Sequence(
  (time, step) => {
    // step: 0-15
    if (kickPattern[step]) kick.triggerAttackRelease("C1", "8n", time)
    if (snarePattern[step]) snare.triggerAttackRelease("8n", time)
    if (hihatPattern[step]) hihat.triggerAttackRelease("32n", time, 0.3)
    
    // 同步 UI
    Tone.Draw.schedule(() => setCurrentStep(step), time)
  },
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  "16n"
)
```

### 5.3 Backing Track 与鼓机同步

```typescript
// 两者共享 Tone.Transport
const startPlayback = () => {
  // Backing track
  backingTrackPlayer.sync().start(0)
  
  // Drum sequence
  drumSequence.start(0)
  
  // 统一启动
  Tone.Transport.start()
}
```

### 5.4 Mute 实现

使用 Tone.js 的音量节点：

```typescript
const drumBus = new Tone.Volume(-10).toDestination()

// 连接所有鼓到 bus
kick.connect(drumBus)
snare.connect(drumBus)
hihat.connect(drumBus)

// Mute 控制
drumBus.mute = isMuted
```

---

## 6. 样式规范

### 6.1 配色方案 (复古工业风)

```css
:root {
  /* 背景 */
  --bg-primary: #1a1a1a;
  --bg-secondary: #2d2d2d;
  --bg-panel: #242424;
  
  /* 强调色 */
  --accent-primary: #00ff88;    /* 霓虹绿 - 开启状态 */
  --accent-secondary: #ff6b35;  /* 橙色 - 当前步 */
  --accent-muted: #666666;      /* 灰色 - 关闭状态 */
  
  /* 文字 */
  --text-primary: #e0e0e0;
  --text-secondary: #888888;
}
```

### 6.2 字体

- 主字体：`system-ui, -apple-system, monospace`
- 数字/标签：等宽字体

### 6.3 动效规范

| 效果 | 时长 | 缓动 |
|------|------|------|
| Cell 状态切换 | 100ms | ease-out |
| 当前步高亮 | 50ms | linear |
| 按钮按下 | 50ms | ease-in |
| 脉冲效果 | 随 BPM | - |

---

## 7. Backing Track 要求

### 7.1 音频规格
- 格式：MP3 (128kbps+) 或 OGG
- 时长：30-60 秒循环
- 风格：Drumless Metal / Heavy Rock Backing Track

### 7.2 预设曲目 (MVP)

```typescript
export const backingTracks = [
  {
    id: 'metal-1',
    name: 'Heavy Riff',
    bpm: 140,
    url: '/tracks/metal-140.mp3',
    genre: 'metal'
  },
  {
    id: 'rock-1', 
    name: 'Hard Rock',
    bpm: 120,
    url: '/tracks/rock-120.mp3',
    genre: 'rock'
  }
]
```

---

## 8. 开发注意事项

### 8.1 音频自动播放策略

浏览器限制音频自动播放，必须：
1. 页面显示"点击开始"遮罩层
2. 用户点击后初始化 Tone.js (`await Tone.start()`)
3. 然后开始播放

### 8.2 内存管理

Tone.js 对象需要正确释放：

```typescript
useEffect(() => {
  const synth = new Tone.MembraneSynth()
  
  return () => {
    synth.dispose()  // 清理
  }
}, [])
```

### 8.3 性能优化

- 使用 `Tone.Draw` 替代直接 setState 更新 UI
- 合成器实例复用，不重复创建
- 使用 `React.memo` 优化 Grid 渲染

---

## 9. 常见问题

### Q: Tone.js 和 Web Audio API 的区别？
A: Tone.js 是基于 Web Audio API 的高级封装，提供更简单的 API 和内置功能。对于 justBeat 的鼓机需求，Tone.js 能大幅减少代码量。

### Q: 为什么不用现成的采样？
A: 使用 Tone.js 合成器可以：
1. 减少网络请求和加载时间
2. 实时调整音色参数
3. 无需管理音频文件资源

### Q: 移动端支持如何？
A: Tone.js 支持移动端，但需要注意：
1. 必须用户交互才能启动音频
2. 后台切换可能导致音频中断
3. MVP 优先桌面端体验

---

## 10. 参考资源

- Tone.js 文档: https://tonejs.github.io/docs/
- Tone.js 示例: https://tonejs.github.io/examples/
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Transport 调度: https://tonejs.github.io/docs/14.8.49/Transport

---

*最后更新: 2026-03-04*  
*Tone.js 版本: 14.x*
