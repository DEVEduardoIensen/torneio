---
name: claude-mem
description: >
  Cross-session architectural memory and context persistence for agents.
  Maintains decisions, interface contracts, and module status in `.agents/memory/`
  so subsequent phase chats retain architectural continuity without re-reading
  entire codebases or exceeding token budgets.
---

# Claude-Mem — Cross-Session Memory for Kordix

You are managing long-term architectural continuity between distinct chat sessions.

## Purpose
When moving from one development phase to the next (e.g. Phase 1 -> Phase 2), each new agent chat must immediately know:
1. What was built and verified in prior phases.
2. What contracts/interfaces were locked (e.g., `RingBuffer`, `ChannelCapabilities`).
3. Hardware test results from `eduardo.md`.

## Memory Store Location
All memory notes are persisted in:
`c:\kordix\.agents\memory/`

## Memory Schema:
1. `architecture_contracts.md`: Public exports of `src/core/`, data models, and database schema.
2. `decisions_log.md`: Chronological log of major design decisions made and why alternatives were rejected.
3. `phase_transitions.md`: Status of Phase 1 through 7, matching the official Director checklist in `eduardo.md`.

## Workflow:
- **At the start of a phase:** Read `.agents/memory/architecture_contracts.md` to avoid interface mismatches.
- **At the end of a phase:** Append the new exports and decisions to `.agents/memory/` before passing the baton to Eduardo.
