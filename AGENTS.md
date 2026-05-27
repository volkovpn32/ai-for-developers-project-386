# AGENTS.md — Calendar Booking

## Project structure

- `tsp/` — TypeSpec API definition (source of truth for API contracts)
- `backend/` — Quarkus 3.35 (Java 21) REST API, Gradle, reactive Mutiny
- `frontend/` — Angular 21 standalone app, Vitest

## Codegen chain (NEVER edit generated files)

1. Edit `tsp/main.tsp`
2. `npx tsp compile tsp/main.tsp` → regenerates `openapi.yaml`
3. Regenerate frontend API client: from `frontend/` run `npx ng-openapi-gen -i ../openapi.yaml -o src/app/api`

All files under `frontend/src/app/api/` are generated (`DO NOT EDIT`).

## Dev server workflow

When starting a dev server for verification (`npm start` in `frontend/` or `./gradlew quarkusDev` in `backend/`), **stop it after the check is done** by sending SIGINT (Ctrl+C) to avoid leaving orphan processes.

## Commands

| Where | Command | What |
|-------|---------|------|
| root | `npx tsp compile tsp/main.tsp` | Compile TypeSpec → `openapi.yaml` |
| `frontend/` | `npm start` | Dev server on :4200, proxy `/api` → :8080 |
| `frontend/` | `ng test` | Vitest unit tests |
| `frontend/` | `npm run build` | Production build |
| `frontend/` | `npm run mock-api` | Prism mock from `openapi.yaml` on :4010 |
| `backend/` | `./gradlew quarkusDev` | Dev server on :8080 |
| `backend/` | `./gradlew build` | Full build |

## Backend quirks

- Reactive (Mutiny `Uni`), not imperative JAX-RS
- In-memory ConcurrentHashMap storage — no DB, no migrations
- CORS fully open (all origins/methods/headers)
- Java 21, sourceCompatibility = 21

## Frontend quirks

- Angular 21 **standalone** (no NgModules anywhere)
- Uses `provideHttpClient()`, not `HttpClientModule`
- Tests run via **Vitest** (not Karma/Jasmine default)
- Angular Material with `provideNativeDateAdapter`
- `proxy.conf.json` routes `/api` → `http://localhost:8080`

## E2E tests (Playwright)

- `e2e/` — Playwright spec-файлы (chromium, full-stack)
- `playwright.config.ts` в корне проекта, `webServer` сам поднимает backend + frontend
- `npm run test:e2e` — запуск тестов (из корня)
- При падении теста используй Playwright MCP

## Unit tests

- Frontend: 1 spec файл (`app.spec.ts`), Vitest
- Backend: **ноль** тестов (нет `src/test`)
