# justBeat 开发 TODO List

> 基于 PRD 拆解的开发任务清单

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
- [x] 安装 Tone.js (`npm install tone`)
- [x] 创建 Tone.js 初始化 Hook
- [x] 配置 Tone.Transport

### 2.2 鼓声音色合成 (Tone.js Synths) ✅
- [x] Kick (底鼓) - `Tone.MembraneSynth`
- [x] Snare (军鼓) - `Tone.NoiseSynth`
- [x] Hi-Hat (踩镲) - `Tone.MetalSynth`

### 2.3 即时预览 ✅
- [x] 点击网格即时播放对应鼓声
- [x] 音频引擎初始化管理

---

## Phase 3: 核心鼓机功能 ✅ 已完成

### 3.1 鼓机状态管理 ✅
- [x] 创建 DrumMachine Context
- [x] 实现 pattern 状态 (16-step x 3 tracks)
- [x] 实现播放控制状态
- [x] 实现 Mute 功能

### 3.2 鼓机引擎 ✅
- [x] 创建 DrumMachineEngine Hook
- [x] 实现播放/停止逻辑
- [x] 实现 16-step Sequence
- [x] 实现 pattern 到音频的映射

### 3.3 UI 组件 ✅
- [x] StepCell 组件 (带数字标记 1,2,3,4)
- [x] DrumGrid 组件
- [x] TransportControls (Play/Stop/Clear/Random)
- [x] VolumeControl (Mute)
- [x] StartOverlay (音频初始化)

---

## Phase 4: Backing Track 系统集成 🚧 进行中

### 4.1 音频文件支持 ✅
- [x] 创建 `/tracks/` 文件夹
- [x] 支持 MP3 格式
- [x] 支持 WAV 格式
- [x] 支持 MP4 格式

### 4.2 Backing Track 播放 🚧
- [ ] 使用 Tone.Player 加载音频
- [ ] 与 Tone.Transport 同步
- [ ] 随机选择曲目播放
- [ ] 音量控制

### 4.3 曲目管理
- [ ] 曲目列表配置
- [ ] BPM 预设
- [ ] 曲目切换功能

---

## Phase 5: 集成与优化

### 5.1 功能集成 🚧
- [ ] Backing Track 与 Drum Machine 自动同步
- [ ] 页面加载后自动播放 Backing Track
- [ ] 音频文件加载状态显示

### 5.2 性能优化
- [ ] 音频节点复用
- [ ] React 渲染优化 (memo/useMemo)
- [ ] 资源预加载

### 5.3 错误处理
- [x] 音频上下文被阻止的处理
- [ ] 音频文件加载失败处理
- [ ] 浏览器兼容性处理

---

## Phase 6: 测试与发布

### 6.1 功能测试
- [ ] 核心功能测试清单：
  - [x] 点击网格添加鼓点并即时发声
  - [x] Drum Machine 播放/停止
  - [ ] Backing Track 播放同步
  - [x] Mute 功能正常
  - [ ] 长时间播放无错位
- [ ] 多浏览器测试 (Chrome, Firefox, Safari)

### 6.2 用户体验优化
- [x] 首次加载提示
- [ ] 音频加载进度提示
- [ ] Backing Track 选择器

### 6.3 构建与部署
- [x] 生产构建配置
- [ ] 静态资源优化
- [ ] 部署到 Vercel/Netlify

---

## Phase 7: 后续功能 (Backlog)

### 7.1 播放控制增强 ✅
- [x] Play/Pause 按钮
- [x] Clear All 按钮
- [x] 随机生成节拍按钮

### 7.2 新手引导
- [ ] UI 提示 "Try clicking on Snare row!"
- [ ] 首次访问引导动画

### 7.3 更多音色
- [ ] Tom (桶鼓)
- [ ] Crash (碎音镲)
- [ ] Open Hi-Hat (开镲)

### 7.4 分享功能
- [ ] Pattern 编码/解码
- [ ] URL 参数读取/写入
- [ ] 复制分享链接

### 7.5 曲目扩展
- [ ] 更多 Backing Track
- [ ] 用户上传支持

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
    bpm: 140,
    url: '/tracks/your-file.mp3',
    genre: 'metal',
  },
];
```

---

*创建日期: 2026-03-04*  
*最后更新: 2026-03-04*  
*当前阶段: Phase 4 (Backing Track 集成)*
