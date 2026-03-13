# justBeat - PRD 产品需求文档

> 把焦虑的无鼓金属乐，变成你的力量节拍

---

## 1. 产品概述

### 1.1 核心理念

justBeat 是一款即时音乐创作小游戏。用户通过简单的点击操作，为无鼓金属乐背景音轨添加鼓点节奏，将原本略显焦虑的"无鼓金属乐"转化为充满力量感的完整金属摇滚。

**用户即是鼓手，无需音乐理论，点击即可创作。**

### 1.2 为什么这个产品有效

金属乐本身就嘈杂、有张力，当你把鼓轨抽掉，剩下的吉他 riff 和贝斯会给人一种"缺了什么"的焦虑感。用户亲手在 16-step 网格上点出鼓点，把节奏"补回去"——这个过程本身就带来强烈的成就感和释压效果。

关键设计洞察：
- **容错性极高**：底下有金属乐伴奏兜着，用户随便点都不会太难听
- **零门槛创作**：不需要懂乐理、不需要会打鼓，点格子就行
- **即时反馈**：下一个循环立刻听到自己的创作融入音乐中
- **对比冲击**：Mute 鼓机后对比有/无鼓点的差异，感受自己创造的价值

### 1.3 目标用户
- 音乐爱好者，但没有专业音乐背景
- 喜欢金属/摇滚风格的听众
- 想要快速获得音乐创作成就感的 casual 玩家
- 需要释放压力、摸鱼解压的上班族

### 1.4 产品定位
- **类型**：Web 音乐创作小游戏
- **风格**：复古工业风
- **核心体验**：即时反馈、简单上手、强烈的对比冲击感

---

## 2. 核心功能需求

### 2.1 背景音乐系统 (Backing Track System)

| 功能 | 描述 | 优先级 | 状态 |
|------|------|--------|------|
| 自动播放 | 点击"开始"后立即播放 Backing Track | P0 | ✅ |
| 曲目库 | Drumless Metal / Heavy Rock Backing Track | P0 | ⚠️ 仅1首可用 |
| BPM 同步 | 每首曲目预设 BPM，与 Drum Machine 自动同步 | P0 | ✅ |
| 音量控制 | Mute 开关 | P1 | ✅ |
| Genre 切换 | Metal / Rock 分类切换 | P1 | ✅ |
| 曲目切换 | 在同一 Genre 内切换不同曲目 | P2 | ✅ 框架就绪 |

**当前状态**：配置了 5 首曲目，但仅 `metal-120.mp3` 实际存在。其余 4 首会 404。**急需补充更多伴奏素材**，这是提升可玩性的最大杠杆。

**技术实现**：
- 使用 Tone.js `Player` 加载音频，通过 `.sync().start(0)` 与 `Tone.Transport` 同步
- Player 需显式调用 `.toDestination()` 连接音频输出
- 音频文件放在 `/tracks/` 目录，由 Vite 作为静态资源服务

### 2.2 鼓机系统 (Drum Machine)

| 功能 | 描述 | 优先级 | 状态 |
|------|------|--------|------|
| 网格界面 | 4/4拍，16 Step × 3 音色 (Kick/Snare/Hi-Hat) | P0 | ✅ |
| 点击编辑 | 点击 Grid 添加/删除鼓点，下一循环生效 | P0 | ✅ |
| 当前步指示 | 红色高亮显示当前播放 Step | P0 | ✅ |
| Mute 功能 | 静音/恢复 Drum Machine | P0 | ✅ |
| Clear All | 一键清除所有鼓点 | P1 | ✅ |
| Random | 随机生成节奏 pattern | P1 | ✅ |

**音色配置**（纯合成，不依赖采样文件）：
- **Kick（底鼓）**：`Tone.MembraneSynth` — 深沉有力的低频
- **Snare（军鼓）**：`Tone.NoiseSynth` + `Tone.MembraneSynth` 双层混合 — 噪声层+音调层
- **Hi-Hat（踩镲）**：`Tone.MetalSynth` — 高频金属质感

**关键技术决策**：
- `Tone.Sequence` 通过 `patternRef.current` 读取 pattern（不依赖 React state），pattern 变更在下一个 step 即刻生效，无需重建 Sequence
- 所有合成器经由共享的 `Tone.Volume` 总线路由到 `Tone.Destination`，便于统一音量控制
- 使用 `Tone.Draw` 将 UI step 指示与音频时间精确对齐

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
| 样式方案 | Tailwind CSS | 快速开发 + 实用类优先 |
| 音频引擎 | Tone.js | 封装 Web Audio API，提供 Transport/Sequence/Synth 等高级抽象 |
| 状态管理 | React Context + useReducer | 音频状态与 UI 状态同步 |
| 构建工具 | Vite | 快速开发体验 |
| 路径别名 | `@/` → `src/` | 在 vite.config.ts 和 tsconfig.json 中统一配置 |

### 3.2 音频架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Tone.js AudioContext                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐     ┌──────────────────────────────────┐  │
│  │  Tone.Player │────▶│         Tone.Destination         │  │
│  │  (Backing    │     │         (Speaker Output)         │  │
│  │   Track)     │     │                                  │  │
│  │  .sync()     │     │                                  │  │
│  │  .start(0)   │     │                                  │  │
│  └──────────────┘     └──────────────────────────────────┘  │
│                                         ▲                    │
│  ┌──────────────────────────────────┐   │                    │
│  │  Tone.Sequence (16-step, "16n") │   │                    │
│  │  reads patternRef.current       │   │                    │
│  │  triggers:                      │   │                    │
│  │   ├─ MembraneSynth (kick) ──────┤   │                    │
│  │   ├─ NoiseSynth (snare) ────────┼──▶│ Tone.Volume Bus   │
│  │   ├─ MembraneSynth (snare) ─────┤   │                    │
│  │   └─ MetalSynth (hihat) ────────┤   │                    │
│  └──────────────────────────────────┘   │                    │
│                                          │                    │
│  ┌──────────────────────────────────┐   │                    │
│  │       Tone.Transport            │   │                    │
│  │  (统一时钟，驱动 Sequence +     │   │                    │
│  │   Player 同步播放)              │   │                    │
│  └──────────────────────────────────┘   │                    │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 应用架构

```
┌─ App ─────────────────────────────────────────┐
│  ┌─ DrumMachineProvider (Context) ──────────┐ │
│  │  state: pattern, isPlaying, bpm, genre…  │ │
│  │  actions: toggleStep, setPlaying, etc.   │ │
│  │                                          │ │
│  │  ┌─ AppContent ────────────────────────┐ │ │
│  │  │  ┌ StartOverlay (initAudio)       │ │ │
│  │  │  ┌ TransportControls (Start/Stop) │ │ │
│  │  │  ┌ DrumGrid (16×3 step cells)     │ │ │
│  │  │  ┌ VolumeControl (Mute)           │ │ │
│  │  │  ┌ GenreSelector                  │ │ │
│  │  │                                    │ │ │
│  │  │  Hooks:                            │ │ │
│  │  │  ├ useDrumMachine (orchestration)  │ │ │
│  │  │  ├ useToneEngine (Sequence管理)    │ │ │
│  │  │  └ useBackingTrack (Player管理)    │ │ │
│  │  └────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

### 3.4 数据模型

```typescript
interface DrumPattern {
  kick: boolean[];    // 16 个 boolean
  snare: boolean[];
  hihat: boolean[];
}

interface DrumMachineState {
  pattern: DrumPattern;
  isPlaying: boolean;
  isMuted: boolean;
  currentStep: number;  // -1 表示未播放
  bpm: number;
  currentTrack: BackingTrack;
  genre: Genre;
}

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
│  进入    │───▶│ 点击开始  │───▶│ 嘈杂的   │───▶│ 点击网格  │
│ 页面     │    │ (解锁    │    │ 无鼓金属乐│    │ 叠加鼓点  │
│          │    │  Audio)  │    │ 自动响起  │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                     │
                                                     ▼
                                               ┌──────────┐
                                               │ 节奏感！  │
                                               │ 成就感！  │
                                               │ (Mute对比)│
                                               └──────────┘
```

### 4.2 核心交互

| 操作 | 反馈 |
|------|------|
| 点击"开始" | Backing Track 立即播放，Transport 启动 |
| 点击 Grid Cell | 状态翻转，下一循环听到/消失 |
| Toggle Mute | 立即静音/恢复鼓机声音（Backing Track 不受影响） |
| 当前 Step 播放 | Grid 列高亮红色指示 |
| Random | 随机生成 pattern，立即在下一循环生效 |
| 切换 Genre | 停止当前 Track → 加载新 Track → 继续播放 |

---

## 5. 功能规划

### 5.1 P0 — 补齐内容（最高优先级）

当前最大短板是**伴奏素材不足**。配置了 5 首但仅 1 首可用，这直接限制了可玩性和留存。

| 任务 | 描述 | 价值 |
|------|------|------|
| 补充 Backing Track | 至少准备 3-5 首不同风格/BPM 的无鼓伴奏 | 可玩性翻倍 |
| 验证所有配置曲目 | 确保 config 中的每首 track 都有对应文件 | 消除 404 错误 |

建议补充的伴奏方向：
- Metal 120 BPM ✅（已有）
- Metal 140 BPM — 更快节奏，适合 thrash 风格
- Metal 160 BPM — 极速，适合 blast beat 练习
- Rock 100 BPM — 慢速经典摇滚，入门友好
- Rock 120 BPM — 中速硬摇滚

### 5.2 P1 — 降低门槛，提升上手体验

| 功能 | 描述 | 价值 |
|------|------|------|
| 预设 Pattern | 提供几种经典鼓点模式供一键加载 | 让新手有起点，不用从空白开始 |
| 新手引导 | 首次进入时提示 "Try clicking on Snare row!" | 降低认知门槛 |

**预设 Pattern 定义**（16 步，0-indexed，步 0/4/8/12 = 拍 1/2/3/4）：

| 名称 | Kick | Snare | Hi-hat | 风格说明 |
|------|------|-------|--------|----------|
| Basic Rock | 0, 8 | 4, 12 | 0,2,4,6,8,10,12,14 | 最经典的 4/4 摇滚节奏。Kick 踩 1、3 拍，Snare 反拍 2、4 拍，Hi-hat 打 8 分音符稳定节奏 |
| Metal Drive | 0,2,4,6,8,10,12,14 | 4, 12 | 0,2,4,6,8,10,12,14 | 双踩底鼓每 8 分音符轰炸，Snare 保持反拍，金属乐标配驱动力 |
| Blast Beat | 0,2,4,6,8,10,12,14 | 1,3,5,7,9,11,13,15 | 0,2,4,6,8,10,12,14 | Kick+HiHat 打偶数步，Snare 打奇数步，交替轮击形成机关枪般的极端金属效果 |
| Syncopated | 0, 3, 6, 10 | 4, 12 | 0,2,4,6,8,10,12,14 | Kick 故意错位正拍（落在"a of 1""and of 2""and of 3"），制造律动错位感，Hi-hat 稳定提供参照脉冲 |

### 5.3 P2 — 社交与传播

| 功能 | 描述 | 价值 |
|------|------|------|
| URL 分享 | 将 pattern 编码到 URL 参数 | 一键分享自己的创作 |
| 录音导出 | 录制一段循环并下载为音频文件 | 用户可以把作品带走 |

**URL 分享方案**：Pattern 是 3×16 = 48 个 boolean，可以编码为 6 字节的 hex 字符串放在 URL hash 中，如 `#p=a3f0c1b2e4d5`，极其轻量。

### 5.4 P3 — 丰富创作空间

| 功能 | 描述 | 价值 |
|------|------|------|
| 更多音色行 | Tom (桶鼓)、Crash (碎音镲)、Open Hi-Hat | 从 3 行扩展到 5-6 行 |
| 用户上传 Track | 允许用户上传自己的无鼓伴奏 | UGC 内容，极大扩展曲库 |
| 更多 Genre | Djent、Thrash、Prog Metal、Punk | 覆盖更多口味 |

### 5.5 远期愿景

| 功能 | 描述 |
|------|------|
| 社区功能 | 作品广场、点赞排行 |
| AI 建议 | 根据当前 backing track 推荐合适的鼓点 pattern |
| 多人 Jam | 实时协作，多人各编一个音色 |

---

## 6. 已知技术陷阱

在开发过程中踩过的坑，供后续迭代参考：

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| Backing Track 无声 | `Tone.Player` 未调用 `.toDestination()` | 创建 Player 时链式调用 `.toDestination()` |
| 点击开始后不播放 | React stale closure：`start()` 闭包中 `isAudioReady = false` | 用 `useEffect` + 状态标志替代 `setTimeout` |
| 浏览器阻止音频 | AudioContext 需要用户手势才能启动 | StartOverlay 组件在用户点击后调用 `Tone.start()` |
| Hi-Hat 音色异常 | MetalSynth 参数不当 | 调整 harmonicity、resonance、octaves 参数 |

详细 bug 分析见 `docs/bugfix/` 目录。

---

## 7. 成功指标

| 指标 | 目标 | 衡量方式 |
|------|------|----------|
| 首次创作时间 | < 10 秒 | 从点击"开始"到点击第一个 grid cell |
| 单次停留时长 | > 2 分钟 | 用户停留在页面的时间 |
| 功能可发现性 | 用户无需说明即可操作 | 观察测试 |
| 音频同步精度 | < 5ms 误差 | Tone.js Transport 保证 |
| 重访率 | > 20% | 7日内再次访问 |

---

## 8. 附录

### 8.1 添加 Backing Track

1. 将音频文件放入 `/tracks/` 目录（支持 mp3、wav、mp4）
2. 在 `src/constants/config.ts` 的 `BACKING_TRACKS` 数组中添加配置：

```typescript
{
  id: 'your-track',
  name: 'Track Name',
  bpm: 140,  // 确保与音频实际 BPM 一致
  url: '/tracks/your-file.mp3',
  genre: 'metal',  // 'metal' | 'rock'
}
```

3. 如果新增了 genre，还需更新 `GENRES` 数组和 `Genre` 类型定义。

### 8.2 参考资源

- Tone.js 文档: https://tonejs.github.io/
- Web Audio API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Scheduling: https://web.dev/articles/audio-scheduling

### 8.3 类似产品参考

- https://io808.com/
- https://patternsketch.com/

---

*文档版本: v2.0*
*创建日期: 2026-03-04*
*最后更新: 2026-03-13*
*当前阶段: Phase 5-6 (集成优化与测试)*
