---
name: vibe-coding
description: >
  Quality Gates and anti-bloat governance for Python live audio systems.
  Enforces MAX_LINES=350 per file, zero-warning burndown (ruff/mypy),
  modular refactoring across 4 architectural seams (Domain, UI, Infra, Helpers),
  and prevents monolithic classes, GC pauses, and mock/simulated fake code.
---

# Vibe Coding Toolkit — Kordix Governance

You are enforcing strict software engineering discipline for the Kordix codebase.

## 1. Hard Quality Gate: MAX_LINES = 350
- No Python file in `src/` may exceed **350 lines of code**.
- Run `python scripts/check_350_lines.py` to audit file sizes.
- If a file approaches or exceeds 350 lines, refactor it immediately using the 4 Architectural Seams:
  1. **Domain & DSP Services (`src/services/`):** Orchestration logic and business use-cases.
  2. **Modular UI Components (`src/ui/components/`):** Specific widget renderers, knobs, meters.
  3. **I/O & Hardware Adapters (`src/infra/`):** Audio device streams, SQLite persistence.
  4. **Pure Math & DSP Helpers (`src/core/dsp/`, `src/core/metrics/`):** FFT, YIN, Hann windowing.

## 2. Zero-Warning Burndown
- Every phase must pass with 0 errors and 0 warnings:
  - `ruff check .`
  - `mypy src/`
- No loose `print()` statements in production code. Use the standard `logging` module.

## 3. Anti-GC Jitter & Memory Leaks in 60 FPS Audio
- Never allocate new NumPy arrays inside real-time audio callbacks or 60 FPS render loops.
- Pre-allocate all buffers during initialization.
- Use thread-safe, lock-free ring buffers between PortAudio and Qt.

## 4. No Fake Mocks in Core Logic
- Never write "simulated" or "mock" implementations that fake DSP calculations.
- Use NumPy synthetic wave generators in tests (`tests/fixtures/`) to mathematically verify algorithms.
