---
task: Передать утверждённый план Claude-исполнителям и контролировать реализацию
slug: 20260710-225952_orchestrate-claude-dev-loop
effort: advanced
phase: complete
progress: 30/30
mode: interactive
started: 2026-07-10T22:59:52+05:00
updated: 2026-07-11T01:50:00+05:00
---

## Context

Пользователь вызвал `claude-dev-loop` и назначил основной агент опытным техлидом. Исполнители Claude должны реализовать утверждённый `docs/superpowers/plans/2026-07-10-astro-landing-dokploy.md`; техлид только декомпозирует работу, передаёт точный контекст, проверяет фактические изменения и возвращает findings в тот же Claude `session_id`. Product code, tests, deployment artifacts и implementation documentation основной агент не пишет. Remote Dokploy rollout требует operator-owned VPS, domain, DNS и access inputs; до их появления выполняется весь локально проверяемый scope и фиксируется точный blocker.

### Risks

- Параллельные executors могут затронуть общий manifest, config или composition root; такие задачи сериализуются.
- Большой plan может провоцировать scope drift; каждый executor получает только один numbered task и ссылку на normative artifacts.
- PLAN_REVIEW/CONSULT может вызвать ping-pong; на task действует максимум два control round trips.
- Claude CLI может долго не печатать output; silence не считается hang без hard signal.
- Remote Dokploy verification невозможна без реальных operator inputs; local completion нельзя выдавать за production deployment.
- Основной агент не вправе исправлять executor omissions: только `NEEDS_WORK`, resume того же session и повторный review.

### Plan

1. Layer 0: serialize Task 1 because it owns `package.json`, lockfile and Playwright config.
2. Layer 1: run Tasks 2–3 in parallel; their primary files are disjoint.
3. Layer 2: run Tasks 4–5 in parallel after design-system green.
4. Layer 3: run Tasks 6–8 in parallel after layout, primitives and typed content are green.
5. Layer 4: serialize Task 9 because it owns composition root and shared assets.
6. Layer 5: serialize Task 10 because it validates the integrated browser surface.
7. Layer 6: serialize Task 11 because it owns container runtime contracts.
8. Layer 7: serialize Task 12; implement runbook, then stop at actual remote rollout without operator inputs.
9. Layer 8: serialize Task 13 for integrated local verification and repository guidance.
10. Every lane uses one fresh Claude `session_id`; review fixes resume that same session.
11. Tech lead performs direct file inspection plus fresh task-specific verification before `ACCEPTED`.

## Criteria

- [x] ISC-1: Normative implementation source зафиксирован точным plan path
- [x] ISC-2: Normative architecture source зафиксирован точным specification path
- [x] ISC-3: Executor prompts используют абсолютный repository path
- [x] ISC-4: Executor prompts запрещают commit, push, stash и branch switching
- [x] ISC-5: Основной агент не изменяет delegated implementation artifacts
- [x] ISC-6: Каждый executor получает required five-section handoff contract
- [x] ISC-7: Каждый risk-gated task получает expected_checkpoint yes
- [x] ISC-8: Task 1 принят техлидом как green
- [x] ISC-9: Task 2 принят техлидом как green
- [x] ISC-10: Task 3 принят техлидом как green
- [x] ISC-11: Foundation verification проходит после Tasks 1–3
- [x] ISC-12: Task 4 принят техлидом как green
- [x] ISC-13: Task 5 принят техлидом как green
- [x] ISC-14: Layout and primitive verification проходит после Tasks 4–5
- [x] ISC-15: Task 6 принят техлидом как green
- [x] ISC-16: Task 7 принят техлидом как green
- [x] ISC-17: Task 8 принят техлидом как green
- [x] ISC-18: Visual slice verification проходит после Tasks 6–8
- [x] ISC-19: Task 9 принят техлидом как green
- [x] ISC-20: Task 10 принят техлидом как green
- [x] ISC-21: `npm run verify` завершается с exit code 0
- [x] ISC-22: Task 11 принят техлидом как green
- [x] ISC-23: Local container health status равен healthy
- [x] ISC-24: Task 12 создаёт проверяемый Dokploy runbook
- [x] ISC-25: Недостающие production operator inputs перечислены явно
- [x] ISC-26: Task 13 принят техлидом как green
- [x] ISC-27: `Maket.html` сохраняет approved SHA-256
- [x] ISC-28: Registration browser test фиксирует zero POST requests
- [x] ISC-29: Landing section order соответствует exact section contract
- [x] ISC-30: Review findings возвращаются в исходный Claude session

## Decisions

- 2026-07-10 23:02: Использовать один Claude session на один numbered plan task; dependencies определяют execution layers.
- 2026-07-10 23:02: Не использовать worktree isolation: project instructions запрещают commits, а independent layers имеют раздельные primary files; shared config/composition tasks сериализуются.
- 2026-07-10 23:46: Tasks 6–8 сериализованы, потому что каждая владеет `src/pages/index.astro`; первоначальный parallel layer отменён для предотвращения lost updates.

## Verification

- `npm run verify`: exit 0; content validation passed; Astro check 0 errors/warnings/hints; static build passed; Playwright 28/28 passed across desktop/mobile.
- Source invariants: no `transition: all`, section-level GSAP imports, or `href="#"`; raw hex matches are confined to approved inline SVG artwork.
- `Maket.html`: approved SHA-256 check returned `OK` for `7d6a9f38752e4ca46f80a8660440a670d5cbf1d8c5a979e23f8608945238a601`.
- Container: clean `docker build` exited 0; local nginx container reached `healthy`; `npm run smoke:container` printed `container smoke passed`; container stopped cleanly.
- Production: real Dokploy deployment, DNS, HTTPS and remote smoke remain blocked by the four operator inputs listed in `AGENTS.md` and `docs/deployment/dokploy.md`; no remote success claimed.
- Guidance review: corrected stale `data-landing-motion` claim in the original Task 13 Claude session; `AGENTS.md` now matches the attribute-free processed script in `Layout.astro`.
- Final review regression: added Playwright coverage for four bonus-card reveal hooks; `Card.astro` now forwards native element attributes; focused RED was 0/4, GREEN passed, and built `dist/index.html` contains exactly four matching bonus `<li>` hooks.
