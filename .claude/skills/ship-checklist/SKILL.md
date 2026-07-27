---
name: ship-checklist
description: >-
  Use before claiming any change is done, and before committing or pushing to this
  site. Enforces the repo's verify-before-push protocol: production build + lint green,
  visual proof in BOTH themes, conventional commit direct to main, and never asserting
  "done" without evidence. Push auto-deploys to production, so this gate is mandatory.
---

# Ship checklist — verify before you claim done

`main` auto-deploys to production (https://tarunyadgirkar.com via Vercel). There are no
feature branches — you commit directly to `main`. That makes verification non-optional:
a bad push is a bad prod deploy.

## Gate (all must pass before commit/push)

1. **Build green** — `npm run build` (this also runs the typecheck; TS is strict).
2. **Lint green** — `npm run lint`.
3. **Visual proof in BOTH themes** — screenshot the affected UI in **light AND dark**.
   Light = warm parchment / rust accent; dark = deep navy / amber accent
   (`next-themes` class strategy, `.dark` on `<html>`). A change that looks right in one
   theme routinely breaks in the other. For motion changes, capture a time-separated
   pair (e.g. 2.5s apart) to prove it actually animates.
4. **Mobile check when layout changed** — verify no horizontal overflow and no
   fixed/floating element overlapping body copy at a phone viewport (a real past bug:
   `SocialBubble` overlapped text on mobile).

**Never claim done without evidence.** State the build/lint result and that both themes
were checked. If you didn't verify, say so.

## Commit

- **Conventional commits**: `feat:` / `fix:` / `chore:` / `docs:`, short imperative
  subject.
- Commit **directly to `main`**. No branches.
- Push frequently for a clean history — but push = prod deploy, so only push verified
  work.

## Update the handoff doc

If the change touches ongoing work, update the **Current status / ongoing** block at the
bottom of `AGENTS.md` in the same commit — that's the canonical living doc every
Claude/Codex session reads first.

## Division of labor (keep heavy work off main context)

Opus does the hard thinking, planning, and design-critical code (IK math, novel
visuals). Push mechanical loops — build-fix iterations, screenshot capture, transcribing
a specified change — to Sonnet subagents or Codex.

## Local-testing gotcha

A stale `next-server` surviving a rebuild can serve mismatched chunk hashes (500 on a
CSS/JS chunk). That's a leftover process, not a code bug — kill the old dev/start
process and rebuild.
