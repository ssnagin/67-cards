# 67 Cards

Казуальная платформа для викторин и интерактивных мероприятий. Создавай наборы карточек,
собирай мероприятия из этапов и играй с друзьями в реальном времени.

[Требования](https://docs.google.com/document/d/1r_w7RIxAuTG3jx8edpk0dcFL78XL3K0w-D55ILm642U/edit?tab=t.0)

Полный разбор проекта (продукт, архитектура, данные, дизайн) — в [docs/HANDBOOK.md](docs/HANDBOOK.md).

---

## Структура

| Папка | Что это | Технологии | Порт (локально) |
|---|---|---|---|
| `backend/` | REST API + авторизация | Spring Boot 4, Java 25, PostgreSQL, MongoDB | `8080` |
| `frontend/` | SPA-интерфейс | Nuxt 4, Vue 3, Tailwind | `3000` |

---

## Что нужно для запуска

- **JDK 25** (например, Eclipse Temurin).
- **Node.js 22+** и `npm`.
- **Docker** (для баз данных; сам бэкенд можно запускать и без Docker).
- Файл `credentials.env` в корне (копия `credentials.env.example` с заполненным `JWT_SECRET`).

---

## Быстрый старт (Docker — всё сразу)

Собирает бэкенд в JAR и поднимает фронт + бэкенд + PostgreSQL + MongoDB + Redis в контейнерах.

```bash
# 1. Один раз: подготовить конфиг
cp credentials.env.example credentials.env
#   → заполни POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
#   → и JWT_SECRET (например: openssl rand -base64 32)

# 2. Собрать бэкенд (Dockerfile берёт готовый app.jar)
cd backend
./gradlew clean build
cd ..

# 3. Поднять всё
docker compose --env-file credentials.env up -d --build
```

После запуска:
- Фронтенд → http://localhost:3000
- Бэкенд → http://127.0.0.1:16768 (внутри контейнера 8080)

⚠️ В этом режиме фронт ходит на бэкенд по `http://localhost:16768`, а не `:8080`
(порт мапится в Compose: `127.0.0.1:16768:8080`).

---

## Запуск для разработки (вручную, без Docker для приложения)

### 1. Поднять базы данных

Нужны PostgreSQL и MongoDB. Redis поднимается, но код его пока не использует.

```bash
docker compose --env-file credentials.env up -d postgresql mongo
```

### 2. Запустить бэкенд

```powershell
cd backend
./gradlew bootRun
```

Бэкенд слушает **8080** (дефолт из `server.port=${SERVER_PORT:8080}`).

> Spring **не читает** `backend/.env` автоматически. Переменные нужно задать в окружении,
> либо передать при запуске:
> `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`, `JWT_SECRET`,
> `SPRING_MONGODB_URI=mongodb://localhost:27017/cards`.

### 3. Запустить фронтенд

```powershell
cd frontend
npm install        # только первый раз
npm run dev
```

Фронт поднимется на **http://127.0.0.1:3000**.

---

## Режимы данных: mock и real

Фронт умеет работать в двух режимах — задаётся переменной `NUXT_PUBLIC_API_MODE`.

| Режим | Что происходит | Когда использовать |
|---|---|---|
| `mock` (по умолчанию) | фронт берёт данные из заглушек (`frontend/server/routes/`), бэкенд **не нужен** | верстка, проверка интерфейса |
| `real` | фронт ходит на настоящий Spring-бэкенд | локальная разработка с бэком, прод |

### Как переключить

```powershell
# mock (заглушки)
$env:NUXT_PUBLIC_API_MODE="mock"

# real (настоящий бэкенд)
$env:NUXT_PUBLIC_API_MODE="real"
$env:NUXT_PUBLIC_API_BASE="http://127.0.0.1:8080"   # ← порт бэкенда!
npm run dev
```

> ⚠️ `real` **не** значит «продакшн». `real` = «данные идут с живого бэкенда, а не из заглушек».
> Для прода используется тот же `real`, но с адресом боевого сервера
> (`https://backend-ssnagin.ssngn.ru`). См. таблицу ниже.

### Окружения и адреса

| Сценарий | apiMode | apiBase | Где |
|---|---|---|---|
| Верстка без бэка | `mock` | — | локально |
| Локальная разработка | `real` | `http://127.0.0.1:8080` | локально |
| **Продакшн** | `real` | `https://backend-ssnagin.ssngn.ru` | сервер |

В углу экрана есть индикатор **«МОК»** / **«API»** — это dev-метка режима данных,
а не признак «прод/не прод». В проде её быть не должно (см. «Известные нюансы»).

---

## Частые проблемы и решения

### 1. Фронт показывает `Failed to fetch`

Причина почти всегда — **несовпадение порта**. Проверь, на каком порту реально бэкенд:

```powershell
# проверь, что бэкенд отвечает:
Invoke-WebRequest http://127.0.0.1:8080/api/auth/login -Method POST `
  -Body '{"email":"a@b.c","password":"12345678"}' -ContentType "application/json"
```

- Бэкенд через `bootRun` → порт **8080** → фронту ставить `NUXT_PUBLIC_API_BASE=http://127.0.0.1:8080`.
- Бэкенд через Docker → порт **16768** → фронту ставить `http://127.0.0.1:16768`.

### 2. CORS-ошибка (бэкенд отвечает, но браузер блокирует)

Разрешённые origin задаются в `backend/src/main/resources/application.properties`:

```properties
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://127.0.0.1:3000,https://backend-ssnagin.ssngn.ru}
```

Если фронт на другом origin — добавь его в этот список (или задай `CORS_ALLOWED_ORIGINS`).

### 3. Ошибка `column "username" ... contains null values`

В базе остались старые пользователи, созданные до появления обязательной колонки `username`.
Для локальной тестовой БД проще всего сбросить данные:

```bash
docker compose --env-file credentials.env down -v   # «-v» стирает тома с данными
docker compose --env-file credentials.env up -d postgresql mongo
```

### 4. `gradlew` не запускается («Отказано в доступе» / lock)

Это происходит в песочнице/при несовпадении прав на кэш Gradle (`~/.gradle`). В обычном
терминале (вне песочницы) проблема не возникает.

---

## Продакшн

Для продакшена:

1. Бэкенд разворачивается на сервере и публикуется за reverse proxy (HTTPS/WSS).
2. Фронт собирается в статику и кладётся на GitHub Pages (см. `.github/workflows/github_pages.yml`).
3. Значения в `credentials.env` — **другие** (не локальные), секреты хранятся в CI-секретах.
4. Любое действие на production-сервере — только после явного подтверждения владельца.

Раздел «Известные нюансы» ниже перечисляет, что нужно докрутить перед реальной выкладкой.

---

## Известные нюансы (до продакшена)

Эти пункты отмечены в [docs/HANDBOOK.md §19](docs/HANDBOOK.md):

- **CORS** содержит только dev-адреса — перед продом добавить origin GitHub Pages.
- **Dev-бейдж «МОК/API»** в углу фронта показывается всегда — в проде его нужно скрыть.
- **Миграции** — используется `ddl-auto=update`, а не Flyway (план: 67C-08).
- **Выход не отзывает токен** — JWT живёт 15 минут после «Выйти» (план: серверный отзыв).
- **Redis** поднят, но код его не использует.

---

## Полезные команды

```bash
# Бэкенд
cd backend
./gradlew build       # собрать JAR
./gradlew bootRun     # запустить
./gradlew test        # прогнать тесты

# Фронтенд
cd frontend
npm run dev           # dev-сервер
npm run build         # production-сборка
npm run lint          # проверить код (ESLint)
npm run lint:fix      # авто-исправить часть ошибок
```

Логи бэкенда — `backend/logs/67-cards.log` (и в консоли). Логи фронта — в терминале, где запущен `npm run dev`.
