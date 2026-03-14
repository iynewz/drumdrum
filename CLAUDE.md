# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Iron Rules

- **永远不要自动提交或推送代码**。所有 `git commit` 和 `git push` 操作必须由用户明确指示后才能执行。

## Project Overview

**justBeat** — a browser-based drum machine built with React + Tone.js. Users toggle drum hits on a 16-step grid (kick, snare, hihat) that plays over looping backing tracks. The app uses synthesized drums (not samples) via Tone.js synths.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint (ts,tsx files, zero warnings allowed)
- `npm run preview` — Preview production build

No test framework is configured.

## Architecture

### Audio Pipeline

All audio runs through **Tone.js**. The browser requires a user gesture to start `AudioContext`, handled by `StartOverlay` → `Tone.start()`.

- `src/audio/drumSynths.ts` — Module-level singleton synths (MembraneSynth for kick, NoiseSynth+MembraneSynth for snare, MetalSynth for hihat). All route through a shared `Tone.Volume` bus. Exposes `trigger*()` functions called from the sequencer.
- `src/hooks/useToneEngine.ts` — Creates a `Tone.Sequence` (16 steps at "16n") that reads the current pattern from a ref and calls trigger functions. Uses `Tone.Draw` to sync UI step indicator with audio timing.
- `src/hooks/useDrumMachine.ts` — Orchestration hook that wires together the tone engine, backing track (`Tone.Player` synced to `Tone.Transport`), and context state. Handles genre/track switching (stop → reload player → restart).
- `src/hooks/useBackingTrack.ts` — Standalone hook for loading/controlling a `Tone.Player` (currently not used directly by App; backing track logic lives in `useDrumMachine`).

Key pattern: the Tone.Sequence reads `patternRef.current` on each step (not React state), so pattern changes take effect on the next step without recreating the sequence.

### State Management

`src/context/DrumMachineContext.tsx` — React Context + `useReducer`. Holds `DrumMachineState` (pattern, isPlaying, isMuted, currentStep, bpm, currentTrack, genre). Actions are dispatched via memoized callbacks exposed through the context.

`src/types/index.ts` — All shared TypeScript types. `DrumPattern` is `{ kick: boolean[], snare: boolean[], hihat: boolean[] }` with 16 steps each.

### Configuration

`src/constants/config.ts` — Central config: step count (16), default BPM, synth parameters, backing track list, volume defaults. To add a backing track, add an entry here and place the audio file in `/tracks/`.

### Path Alias

`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`). All imports use this alias.

## Backing Tracks

Audio files go in `/tracks/` (served as static assets by Vite from the project root). Supported formats: mp3, wav, mp4. Currently only `metal-120.mp3` exists; other tracks in config will 404.
