---
task: Установить Яндекс Метрику и проверить корректную загрузку счетчика
slug: 20260716-074245_yandex-metrika-counter
effort: standard
phase: complete
progress: 12/12
mode: interactive
started: 2026-07-16T07:42:45Z
updated: 2026-07-16T08:03:56Z
---

## Context

Нужно встроить предоставленный пользователем счетчик Яндекс Метрики `96074267` в общий Astro layout. Основной код должен выполняться inline в начале `<head>`, а `noscript` fallback — находиться первым внутри `<body>`. Существующие Telegram Pixel, metadata и централизованный motion bootstrap менять нельзя. Consent-management, переменные окружения и дополнительные analytics-абстракции не входят в запрос.

### Risks

- Без `is:inline` Astro может обработать и переместить сторонний script.
- Реальный внешний запрос делает browser-тест зависимым от доступности Яндекса.
- Ошибка в ID или init-options незаметно отправит аналитику неверно.
- `noscript` должен остаться первым child внутри `<body>`.

## Criteria

- [x] ISC-1: Inline-скрипт Яндекс Метрики расположен внутри основного document head
- [x] ISC-2: Загрузчик Яндекса обращается к точному URL metrika/tag.js счетчика
- [x] ISC-3: Инициализация ym использует точный идентификатор счетчика пользователя 96074267
- [x] ISC-4: Опция webvisor передаётся в init со значением true
- [x] ISC-5: Опция clickmap передаётся в init со значением true
- [x] ISC-6: Параметр referrer передаёт актуальный document.referrer при инициализации счетчика
- [x] ISC-7: Параметр url передаёт актуальный location.href при инициализации счетчика
- [x] ISC-8: Опция accurateTrackBounce передаётся в init со значением true
- [x] ISC-9: Опция trackLinks передаётся в init со значением true
- [x] ISC-10: Noscript fallback размещён первым элементом внутри document body
- [x] ISC-11: Noscript image использует точный watch URL счетчика 96074267
- [x] ISC-A1: Существующий motion bootstrap продолжает загружаться ровно один раз

## Decisions

- Использовать `is:inline`, чтобы Astro сохранил сторонний snippet без bundling и перемещения.
- Тест блокирует внешние запросы Яндекса, но проверяет локальную очередь `ym` и созданный запрос.

## Verification

- `npm run test:e2e -- tests/layout.spec.ts --project=desktop-chromium --grep \"Yandex Metrika\"`: 2 passed.
- `npm run verify`: content validation passed; `astro check` — 0 errors, 0 warnings, 0 hints; static build completed; Playwright — 46 passed, 2 flaky, exit code 0.
- Общая `tests/fixtures.ts` блокирует `https://mc.yandex.ru/**`; отдельный JavaScript-disabled context блокирует `noscript` watch request.
- Capability check: `brainstorming`, `astro`, `test-driven-development`, `verification-before-completion` реально загружены и применены.
