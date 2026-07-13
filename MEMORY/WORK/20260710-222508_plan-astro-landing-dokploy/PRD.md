---
task: Спроектировать реализацию Astro-лендинга и деплой через Dokploy
slug: 20260710-222508_plan-astro-landing-dokploy
effort: extended
phase: complete
progress: 28/28
mode: interactive
started: 2026-07-10T22:25:08+05:00
updated: 2026-07-10T22:50:00+05:00
---

## Context

Пользователь запросил инженерный план реализации полного лендинга на уже инициализированном Astro 6 stack. `Design.md`, `design-tokens.json` и `tokens.css` являются источниками дизайн-системы; `Maket.html` является источником текста, порядка секций и базовой семантики. Production должен собираться как статический `dist/` и разворачиваться на собственном VPS через Dokploy. Реализация кода не входит в текущую задачу.

### Risks

- Монолитный `index.astro` повторит проблемы большого prototype-файла.
- Полностью data-driven content layer будет избыточен для одного фиксированного лендинга.
- Tokens нельзя независимо копировать в Tailwind theme и component CSS.
- Registration UI не должен обещать отправку до появления receiver.
- Docker, Dokploy, DNS и HTTPS должны проверяться отдельными gates.

### Plan

Сначала записать утверждённую specification, затем получить независимый architecture review и на её основе создать granular implementation plan. Архитектура: section Astro modules, тонкий `index.astro`, общий `Layout.astro`, три UI primitives, typed arrays только для повторяющегося content, единый GSAP orchestration module, статический Docker/nginx deployment через Dokploy. Registration form остаётся без production submission и показывает честный inline status.

## Criteria

- [x] ISC-1: План сохранён отдельным Markdown-файлом внутри repository docs
- [x] ISC-2: План фиксирует текущий и целевой repository state
- [x] ISC-3: План назначает authoritative source каждому типу данных
- [x] ISC-4: План перечисляет полный порядок landing page sections
- [x] ISC-5: План задаёт конкретную Astro module decomposition схему
- [x] ISC-6: План определяет интерфейсы общих UI primitives
- [x] ISC-7: План определяет единый layout и metadata contract
- [x] ISC-8: План сохраняет design tokens единственным styling source
- [x] ISC-9: План описывает Tailwind v4 integration без дублирования tokens
- [x] ISC-10: План описывает responsive typography и layout behavior
- [x] ISC-11: План локализует GSAP orchestration внутри одного module
- [x] ISC-12: План задаёт reduced-motion и animation performance constraints
- [x] ISC-13: План фиксирует registration form data destination decision
- [x] ISC-14: План определяет validation, success и error states
- [x] ISC-15: План включает SEO, OpenGraph и legal requirements
- [x] ISC-16: План включает accessibility acceptance checks для интерфейса
- [x] ISC-17: План включает performance budgets и image processing
- [x] ISC-18: План определяет automated и browser verification strategy
- [x] ISC-19: План описывает production Docker image и nginx serving
- [x] ISC-20: План описывает Dokploy application configuration полностью
- [x] ISC-21: План описывает DNS, HTTPS и health checks
- [x] ISC-22: План описывает rollback и deployment verification procedure
- [x] ISC-23: План содержит точные создаваемые и изменяемые paths
- [x] ISC-24: План разбит на зависимые bite-sized implementation tasks
- [x] ISC-25: Каждый task содержит commands и expected outcomes
- [x] ISC-A-1: План не меняет утверждённый marketing content
- [x] ISC-A-2: План не создаёт неподтверждённую backend integration
- [x] ISC-A-3: План не предлагает UI frameworks вне Astro stack

## Decisions

- 2026-07-10 22:25: Планировать статический Astro output, собранный Docker multi-stage image и раздаваемый nginx под управлением Dokploy/Traefik.
- 2026-07-10 22:28: Registration form пока реализуется без production submission; план фиксирует UI states и integration seam без backend receiver.

## Verification

- ISC-1–ISC-3: Specification and plan exist under `docs/superpowers`; source authority table covers all five repository references.
- ISC-4–ISC-14: Plan fixes eleven section IDs, thirteen modules, shared interfaces, centralized motion and no-send form states.
- ISC-15–ISC-18: SEO, OpenGraph, legal-link behavior, accessibility, performance budgets, Astro check and Playwright are explicit tasks.
- ISC-19–ISC-22: Dockerfile, nginx, Dokploy Application, port 80, DNS, HTTPS, `/healthz` and rollback have exact gates.
- ISC-23–ISC-25: Programmatic review counted 13 tasks and 59 checkbox steps with paths, commands and expected outcomes.
- ISC-A-1: Exact `Maket.html` SHA-256 `7d6a9f38752e4ca46f80a8660440a670d5cbf1d8c5a979e23f8608945238a601` is a release gate.
- ISC-A-2: Registration returns `not-configured`; browser test asserts zero POST requests.
- ISC-A-3: Stack remains Astro/Tailwind/GSAP; no UI framework is planned.
- Self-review: 1391 plan lines, 427 specification lines, zero placeholders, no executable git write steps.
- Capability check: brainstorming, writing-plans, codebase-design, ckm-design-system, official Dokploy research and architecture agent were invoked; failed specialized agent was replaced by a successful default task agent.
