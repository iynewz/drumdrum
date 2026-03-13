# justBeat 开发 TODO List

> 基于 PRD v2.0 拆解的开发任务清单

---

## Phase 1: 项目初始化与基础架构 ✅ 已完成

### 1.1 环境搭建 ✅
- [x] 创建项目目录结构
- [x] 初始化 React + Vite 项目
- [x] 配置 Tailwind CSS
- [x] 安装 Tone.js 依赖
- [x] 配置 TypeScript 路径别名

### 1.2 基础架构设计 ✅
- [x] 设计全局状态结构 (Context API)
- [x] 定义 TypeScript 类型定义文件
- [x] 创建文件目录结构

---

## Phase 2: 音频引擎开发 (Tone.js) ✅ 已完成

### 2.1 Tone.js 基础 ✅
- [x] 安装 Tone.js
- [x] 创建 Tone.js 初始化 Hook
- [x] 配置 Tone.Transport

### 2.2 鼓声音色合成 (Tone.js Synths) ✅
- [x] Kick (底鼓) - `Tone.MembraneSynth`
- [x] Snare (军鼓) - `Tone.NoiseSynth` + `Tone.MembraneSynth` 混合
- [x] Hi-Hat (踩镲) - `Tone.MetalSynth` (已修复频率和音量)

### 2.3 播放逻辑 ✅
- [x] 点击网格不立即发声
- [x] 下一循环播放到该位置时才发声
- [x] 取消/开启鼓点都不发声

---

## Phase 3: Backing Track 系统集成 ✅ 已完成

### 3.1 音频文件支持 ✅
- [x] 创建 `/tracks/` 文件夹
- [x] 支持 MP3, WAV, MP4 格式

### 3.2 Backing Track 播放 ✅
- [x] 使用 Tone.Player 加载音频
- [x] 与 Tone.Transport 同步
- [x] 点击开始后自动播放
- [x] Player 连接到 Tone.Destination（修复无声 bug）

### 3.3 Genre 选择器 ✅
- [x] Metal / Rock 切换按钮
- [x] 切换后自动更换 Backing Track
- [x] 同步更新 BPM

---

## Phase 4: 核心鼓机功能 ✅ 已完成

### 4.1 鼓机状态管理 ✅
- [x] 创建 DrumMachine Context
- [x] 实现 pattern 状态 (16-step x 3 tracks)
- [x] 实现播放控制状态
- [x] 实现 Mute 功能

### 4.2 鼓机引擎 ✅
- [x] 创建 DrumMachineEngine Hook
- [x] 实现播放/停止逻辑
- [x] 实现 16-step Sequence
- [x] 实现 pattern 到音频的映射

### 4.3 UI 组件 ✅
- [x] StepCell 组件 (带数字标记 1,2,3,4)
- [x] DrumGrid 组件
- [x] TransportControls (Start/Stop/Clear/Random/Genre)
- [x] VolumeControl (Mute)
- [x] StartOverlay (音频初始化)
- [x] 扫描竖线 (跟随播放位置)

---

## Phase 5: Bug 修复与稳定性 ✅ 已完成

- [x] 修复 Backing Track 无声（Player 缺少 `.toDestination()`）
- [x] 修复点击开始后不播放（React stale closure）
- [x] 修复 Hi-Hat 音色异常（MetalSynth 参数调整）
- [x] 修复 Sequence 不应依赖 BPM 重建

---

## Phase 6: 补齐内容 🚨 最高优先级

> 当前只有 `metal-120.mp3` 一首可用，config 中其他 4 首会 404。这是可玩性的最大瓶颈。

### 6.1 Backing Track 素材

**获取方式 A：AI 生成（推荐）**

使用 AI 音乐生成服务，用 prompt 生成无鼓伴奏，可控性强：

| 服务 | 说明 |
|------|------|
| Suno API | prompt 如 `"instrumental metal, no drums, heavy distorted guitar riffs, 140 bpm, loop-friendly"`，生成质量高 |
| Udio | 类似 Suno，音乐质量好 |
| Replicate (MusicGen) | Meta 开源模型，可通过 API 调用，可控性最强 |

- [ ] 选定一个 AI 音乐生成服务并获取 API key
- [ ] 编写生成脚本（提供 API key 后可自动化）
- [ ] 生成 metal-140 (140 BPM)
- [ ] 生成 metal-160 (160 BPM)
- [ ] 生成 rock-100 (100 BPM)
- [ ] 生成 rock-120 (120 BPM)

**获取方式 B：免费素材站手动下载**

| 来源 | 说明 |
|------|------|
| YouTube | 搜 "drumless metal backing track"，用 yt-dlp 下载 |
| Freesound.org | CC 协议素材，可商用 |
| Looperman.com | 免费循环素材 |

- [ ] 下载素材并转换为 mp3 格式
- [ ] 确认 BPM 准确（可用 Audacity 或在线 BPM 检测工具）
- [ ] 文件命名为 `{genre}-{bpm}.mp3` 放入 `/tracks/`

**最终验证**
- [ ] 准备 metal-140.mp3 (Heavy Riff, 140 BPM)
- [ ] 准备 metal-160.mp3 (Fast Thrash, 160 BPM)
- [ ] 准备 rock-100.mp3 (Classic Rock, 100 BPM)
- [ ] 准备 rock-120.mp3 (Hard Rock, 120 BPM)
- [ ] 验证所有曲目可正常加载播放

### 6.2 预设 Pattern
- [ ] 实现 Preset 选择功能（UI + 状态）
- [ ] Basic Rock：Kick 1,5 + Snare 5,13 + HH 每步
- [ ] Metal Drive：双踩底鼓 + 反拍军鼓
- [ ] Blast Beat：全部填满
- [ ] Syncopated：切分节奏

---

## Phase 7: 体验优化

### 7.1 新手引导
- [ ] 首次访问时 UI 提示 "Try clicking on Snare row!"
- [ ] 引导动画或高亮提示

### 7.2 性能优化
- [ ] 音频节点复用
- [ ] React 渲染优化 (memo/useMemo)
- [ ] 资源预加载

### 7.3 错误处理
- [x] 音频上下文被阻止的处理
- [ ] 音频文件加载失败处理（友好提示）
- [ ] 浏览器兼容性处理

### 7.4 构建与部署
- [x] 生产构建配置
- [ ] 静态资源优化
- [ ] 部署到 Vercel/Netlify

---

## Phase 8: 社交与传播

### 8.1 URL 分享
- [ ] Pattern 编码为 hex 字符串（3×16 = 48 bool → 6 字节）
- [ ] 写入 URL hash（如 `#p=a3f0c1b2e4d5`）
- [ ] 页面加载时解析 URL 恢复 pattern
- [ ] "复制链接"按钮

### 8.2 录音导出
- [ ] 使用 Tone.Recorder 录制一段循环
- [ ] 导出为 WAV/MP3 下载

---

## Phase 9: 丰富创作空间 (Backlog)

### 9.1 更多音色
- [ ] Tom (桶鼓)
- [ ] Crash (碎音镲)
- [ ] Open Hi-Hat (开镲)

### 9.2 曲目扩展
- [ ] 更多 Genre：Djent, Thrash, Prog Metal, Punk
- [ ] 用户上传自己的 Backing Track
- [ ] 曲目选择器 UI 优化

### 9.3 远期愿景
- [ ] 社区作品广场
- [ ] AI 推荐鼓点 pattern
- [ ] 多人实时 Jam

---

## Phase 10: SEO 优化 (低优先级)

- [ ] 添加 meta 标签（title、description、keywords）
- [ ] 添加 Open Graph 标签（og:title、og:description、og:image）
- [ ] 添加 Twitter Card 标签
- [ ] 准备社交分享预览图（og:image）
- [ ] 检查页面可访问性（语义化 HTML、aria 标签）
- [ ] 根据 DataForSEO 分析结果进一步优化

---

## 使用说明

### 添加 Backing Track

将音频文件放入 `/tracks/` 文件夹，支持格式：
- `.mp3`
- `.wav`
- `.mp4`

在 `src/constants/config.ts` 中添加曲目配置：

```typescript
export const BACKING_TRACKS: BackingTrack[] = [
  {
    id: 'your-track',
    name: 'Track Name',
    bpm: 140,  // 确保 BPM 正确
    url: '/tracks/your-file.mp3',
    genre: 'metal',  // 'metal' 或 'rock'
  },
];
```

### 默认曲目

项目默认使用 `metal-120.mp3` 作为启动曲目，请确保该文件存在于 `/tracks/` 目录。

---

*创建日期: 2026-03-04*
*最后更新: 2026-03-13*
*当前阶段: Phase 6 (补齐内容)*
