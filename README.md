# 67-cards
67 Cards is a casual quiz platform. Bring your friends and play together!

[Требования](https://docs.google.com/document/d/1r_w7RIxAuTG3jx8edpk0dcFL78XL3K0w-D55ILm642U/edit?tab=t.0)

## Сборка

```
cp credentials.env.example credentials.env
```

Заполните `credentials.env` своими значениями, включая `JWT_SECRET`
(секрет подписи JWT). Затем из корня проекта:

```bash
cd backend
./gradlew clean build
cd ..
docker compose --env-file credentials.env up -d --build
```