---
task: Проверить ошибку запуска агента AstroScaffoldCoder
slug: 20260710-140113_check-astroscaffoldcoder-model-error
effort: standard
phase: complete
progress: 8/8
mode: interactive
started: 2026-07-10T14:01:13Z
updated: 2026-07-10T14:07:15Z
---

## Context

Пользователь показал завершившееся задание `AstroScaffoldCoder` с HTTP 404 и попросил определить причину. Диагностика должна опираться на журнал OMP, конфигурацию моделей и параметры фактического запуска. Изменение конфигурации или повторный запуск не запрошены.

### Risks

- Обрезанный интерфейс скрывает полный model ID; источник истины — JSONL.
- Локальный model cache может содержать устаревший alias после удаления API-модели.
- Резервный агент уже меняет репозиторий; его прогресс нельзя приписывать failed job.

## Criteria

- [x] ISC-1: Полный текст ошибки извлечён из родительского журнала OMP
- [x] ISC-2: Точный идентификатор несуществующей модели подтверждён журналом агента
- [x] ISC-3: Профиль запуска агента подтверждён параметрами вызова task
- [x] ISC-4: Текущая модель обычных task-агентов подтверждена локальной конфигурацией
- [x] ISC-5: Причина различия моделей установлена сравнением двух запусков
- [x] ISC-6: Ошибка отделена от кода Astro и npm
- [x] ISC-7: Статус резервного запуска описан без неподтверждённых утверждений
- [x] ISC-8: Пользователю дан безопасный конкретный способ избежать ошибки

## Decisions

- Не менять plugin cache или модельный registry без явного запроса.
- Не считать неавторитетный model cache доказательством доступности API-модели.

## Verification

- Parent JSONL line 226: HTTP 404, `not_found_error`, model `claude-opus-4-0`, request `req_011CctVnkHfdZemVEEYeEn7v`.
- Agent JSONL line 3: selected model `anthropic/claude-opus-4-0`.
- Parent task call line 222: explicit `agent: "coder"`.
- `~/.omp/agent/config.yml`: ordinary task role maps to `xai-oauth/grok-4.3:xhigh`.
- Fallback JSONL line 3: bundled task agent actually selected `xai-oauth/grok-4.3`.
- Failed agent had zero tool calls; Astro source and npm were not involved.
- Fallback later reached npm/build; its separate Tailwind build issue is unrelated.
- Capability check: `systematic-debugging` and job/session inspection were invoked.
