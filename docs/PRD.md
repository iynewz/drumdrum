# justBeat - PRD 产品需求文档

> 把焦虑的无鼓金属乐，变成你的力量节拍

---

## 1. 产品概述

### 1.1 核心理念
justBeat 是一款即时音乐创作小游戏。用户通过简单的点击操作，为无鼓金属乐背景音轨添加鼓点节奏，将原本略显焦虑的"无鼓金属乐"转化为充满力量感的完整金属摇滚。

**用户即是鼓手，无需音乐理论，点击即可创作。**

### 1.2 目标用户
- 音乐爱好者，但没有专业音乐背景
- 喜欢金属/摇滚风格的听众
- 想要快速获得音乐创作成就感的 casual 玩家

### 1.3 产品定位
- **类型**：Web 音乐创作小游戏
- **风格**：复古工业风
- **核心体验**：即时反馈、简单上手、强烈的对比冲击感

---

## 2. 核心功能需求

### 2.1 背景音乐系统 (Backing Track System)

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 自动播放 | 进入页面后自动随机播放一首 Backing Track | P0 |
| 曲目库 | Dreamless Metal / Heavy Rock Drumless Backing Track 风格 | P0 |
| BPM 检测 | 每首曲目预设 BPM，确保与 Drum Machine 同步 | P0 |
| 音量控制 | 可调整背景音乐音量 | P1 |
| 切歌功能 | 随机切换不同 Backing Track | P2 |

**技术要点**：
- 与 Drum Machine 解耦设计，方便后续扩展更多曲目
- 使用 Web Audio API 或 Howler.js 播放
- 确保音频加载后的即时播放能力

### 2.2 鼓机系统 (Drum Machine)

| 功能 | 描述 | 优先级 |
|------|------|--------|
| 自动启动 | 进入页面后自动按照 BPM 开始运行 | P0 |
| 网格界面 | 4/4拍，16个 Step，3种音色（Kick/Snare/Hi-Hat） | P0 |
| 点击编辑 | 点击 Grid 添加/删除鼓点，下一循环生效 | P0 |
| Mute 功能 | 可静音/取消静音 Drum Machine | P0 |
| 当前步指示 | 视觉高亮显示当前播放的 Step | P0 |

**音色配置**：
- **Kick（底鼓）**：深沉有力的低音鼓
- **Snare（军鼓）**：清脆响亮的军鼓
- **Hi-Hat（踩镲）**：金属质感的闭合踩镲

**技术要点**：
- 使用 Web Audio API 合成或采样播放
- 精确的时间同步，防止错位
- 使用 lookahead + scheduler 模式确保节拍稳定

### 2.3 视觉设计系统

**风格**：复古工业风 (Retro Industrial)

| 元素 | 描述 |
|------|------|
| 配色 | 深灰/黑色背景 + 霓虹绿/橙色点缀 + 金属质感 |
| 字体 | 等宽字体或工业风格无衬线字体 |
| 网格 | 16-step 横向排列，3行纵向排列（对应3种音色） |
| 按钮状态 | 关闭：暗色/灰色；开启：亮色脉冲；当前步：高亮边框 |
| 动效 | 播放时的脉冲效果、点击反馈 |

---

## 3. 技术架构

### 3.1 技术栈

| 层级 | 技术选择 | 说明 |
|------|----------|------|
| UI 框架 | React 18+ | 组件化开发，状态管理 |
| 样式方案 | Tailwind CSS + CSS Modules | 快速开发 + 局部样式 |
| 音频引擎 | Web Audio API | 精确时间控制，无需额外依赖 |
| 状态管理 | React Context + useReducer | 音频状态与 UI 状态同步 |
| 构建工具 | Vite | 快速开发体验 |

### 3.2 音频架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                      Audio Context                           │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Backing     │  │   Drum       │  │   Scheduler      │  │
│  │  Track       │  │   Engine     │  │   (Lookahead)    │  │
│  │  Player      │  │              │  │                  │  │
│  │  (Howler/    │  │  • Kick      │  │  • nextNoteTime  │  │
│  │   Web Audio) │  │  • Snare     │  │  • scheduleAhead │  │
│  │              │  │  • Hi-Hat    │  │  • currentStep   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**时间同步方案**：
- 使用 Web Audio API 的 `currentTime` 作为唯一时间源
- 采用 Chris Wilson 的 "A Tale of Two Clocks" 模式
- Lookahead: 100ms，ScheduleAhead: 0.1s

### 3.3 数据模型

```typescript
// 节拍配置
interface BeatPattern {
  kick: boolean[];    // 16个boolean
  snare: boolean[];   // 16个boolean
  hihat: boolean[];   // 16个boolean
}

// 音频配置
interface AudioConfig {
  bpm: number;
  isPlaying: boolean;
  isMuted: boolean;
  currentStep: number;
  volume: number;
}

// Backing Track
interface BackingTrack {
  id: string;
  name: string;
  bpm: number;
  url: string;
  genre: 'metal' | 'rock';
}
```

---

## 4. 交互流程

### 4.1 用户旅程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  进入    │───▶│ 自动播放  │───▶│ 点击添加  │───▶│ 享受     │
│ 页面     │    │ 背景+鼓机 │    │ 鼓点      │    │ 节奏感   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                    │
                                    ▼
                              ┌──────────┐
                              │ 可 Mute  │
                              │ 鼓机对比  │
                              └──────────┘
```

### 4.2 核心交互

| 操作 | 反馈 |
|------|------|
| 点击 Grid Cell | 立即改变状态，下一循环听到声音 |
| Toggle Mute | 立即静音/恢复鼓机声音 |
| 当前 Step 播放 | Grid 列高亮显示 |

---

## 5. 后续功能规划

### 5.1 近期优化 (Next Sprint)

| 功能 | 描述 | 价值 |
|------|------|------|
| 新手引导 | UI 提示从 Snare 开始尝试 | 降低上手门槛 |
| 播放控制 | Play/Pause、Clear All、随机生成 | 提升控制感 |
| 更多音色 | Tom、Crash、Open Hi-Hat 等 | 丰富创作可能 |

### 5.2 中期功能 (Future)

| 功能 | 描述 | 价值 |
|------|------|------|
| URL Share | 将节拍编码到 URL，分享链接 | 社交传播 |
| 预设节拍 | 提供几种经典金属节奏型 | 降低创作门槛 |
| 录音导出 | 录制创作并下载 | 内容产出 |

### 5.3 远期愿景

| 功能 | 描述 |
|------|------|
| 更多曲风 | Djent、Thrash、Prog Metal 等 |
| 用户上传 | 允许用户上传自己的 Backing Track |
| 社区功能 | 排行榜、作品展示 |

---

## 6. 成功指标

| 指标 | 目标 |
|------|------|
| 首次创作时间 | < 10 秒 |
| 单用户单次停留 | > 2 分钟 |
| 功能理解度 | 用户无需说明即可操作 |
| 音频同步精度 | < 5ms 误差 |

---

## 7. 命名建议

当前候选：**justBeat**

其他备选：
- **DrumForge** - 锻造鼓点
- **BeatCraft** - 节拍工艺
- **MetalMind** - 金属心智
- **PulseDrum** - 脉冲鼓
- **DrumlessHero** - 无鼓英雄

---

## 8. 附录

### 8.1 参考资源

- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Scheduling: https://web.dev/articles/audio-scheduling
- 808 Drum Sounds: https://splice.com/sounds/loop/808-drum-kit

### 8.2 类似产品参考

- https://react-808.surge.sh/
- https://io808.com/
- https://patternsketch.com/

---

*文档版本: v1.0*  
*最后更新: 2026-03-04*
