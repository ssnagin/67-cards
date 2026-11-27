# Запуск backend и инфраструктуры

Единственная конфигурация — `docker-compose.yml` в корне проекта.
Отдельный `backend/compose.yaml`, запускавший PostgreSQL 17 на порту 5433,
удалён как дубликат. Сервис `frontend` в Compose сейчас закомментирован;
Nuxt можно запускать отдельно в режиме разработки.

## Подготовка и запуск

В корне скопируйте `credentials.env.example` в `credentials.env`, заполните
параметры PostgreSQL и добавьте `JWT_SECRET` для подписи токенов.
Ключ должен быть в Base64 и после декодирования содержать минимум 32 байта.
Сгенерировать значение можно командой `openssl rand -base64 32`.
Храните его в `credentials.env`; Compose проверяет наличие непустого значения
до запуска контейнеров. Не меняйте ключ при каждом запуске: его замена
делает ранее выданные JWT недействительными.
Dockerfile собирает JAR из исходников внутри образа с JDK 25. При первой
сборке Docker потребуется доступ к Gradle и Maven Central для загрузки зависимостей.

```bash
docker compose --env-file credentials.env config --quiet
docker compose --env-file credentials.env up -d --build
```

Для отдельного запуска тестов backend используйте `cd backend && ./gradlew test`.

Для просмотра логов:

```bash
docker compose --env-file credentials.env logs --tail=100 spring-app
```

## Сервисы и подключения

| Сервис | Адрес с хоста | Адрес в сети Compose |
|---|---|---|
| Backend | `127.0.0.1:16768` | `spring-app:8080` |
| PostgreSQL | `127.0.0.1:5432` по умолчанию | `postgresql:5432` |
| MongoDB | `127.0.0.1:27017` по умолчанию | `mongo:27017` |
| Redis | `127.0.0.1:6379` по умолчанию | `redis-db:6379` |

`POSTGRES_PORT`, `MONGO_PORT` и `REDIS_PORT` меняют только опубликованные порты хоста.
Backend использует внутренние адреса и ожидает успешных healthcheck всех трёх БД.
Его внутренний `SERVER_PORT` закреплён на 8080 для соответствия пробросу порта.
Redis-реплики не запускаются. В текущем backend зависимости Redis отключены;
наличие контейнера Redis само по себе не включает кэширование приложения.

Колоды и карточки хранятся в MongoDB, пользователи — в PostgreSQL.
Backend подключается к Mongo через `SPRING_MONGODB_URI` (`mongodb://mongo:27017/cards`).
Важно: в Spring Boot 4 параметры подключения перенесены в `spring.mongodb.*`;
устаревший `spring.data.mongodb.uri` игнорируется и молча уводит приложение в базу `test`.

## Данные и объединение конфигураций

Сохранены версия PostgreSQL и том `postgres_data` корневого Compose,
включая прежнюю точку монтирования `/var/lib/postgresql/18/docker`.
Данные MongoDB сохраняются в томе `mongo_data`.
Redis сохраняет данные в `./redis_data`.

Прежний Compose из `backend` использовал собственный том другого Compose-проекта
и PostgreSQL 17. Его данные автоматически не переносятся в корневую БД.
Если там есть нужные данные, требуется отдельный перенос через dump/restore;
подключать каталог PostgreSQL 17 напрямую к PostgreSQL 18 нельзя.
При обычном обновлении не используйте `down -v`: эта команда удаляет том БД.

Исправлен запуск JAR: `java -jar app.jar`. Ранее `java jar app.jar`
завершался с `ClassNotFoundException: jar`, а `restart: on-failure`
вызывал повторные запуски контейнера.

## Локальный запуск backend без Docker

Для отладки из IDE достаточно поднять только БД:

```bash
docker compose --env-file credentials.env up -d postgresql mongo
```

Spring не читает `backend/.env` автоматически. Переменные нужно передать
процессу: `POSTGRES_PORT` (опубликованный порт из `credentials.env`),
`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `JWT_SECRET`,
`SPRING_MONGODB_URI=mongodb://localhost:27017/cards`.
По умолчанию backend слушает 8080; порт 16768 публикует Compose.

## Nuxt в локальном Compose

`frontend/Dockerfile` выполняет `npm ci` и `npm run build` на Node 22,
затем переносит только `.output` в runtime-образ. Сервер запускается
от пользователя `node` на порту 3000. Локальные node_modules, .env и
результаты прежних сборок исключены из контекста Docker.

Сервис `frontend` закомментирован и не запускается общим `up -d --build`.
При локальном запуске Nuxt для работы с backend задайте в `frontend/.env`
`NUXT_PUBLIC_API_MODE=real` и `NUXT_PUBLIC_API_BASE=http://localhost:16768`.
Браузер обращается к этому адресу на локальной машине. Для GitHub Pages
исходный base URL `/67-cards/` сохранён.
