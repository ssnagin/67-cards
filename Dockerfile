FROM eclipse-temurin:25-jdk-alpine AS build

WORKDIR /build

COPY backend/gradlew backend/build.gradle.kts backend/settings.gradle.kts ./
COPY backend/gradle ./gradle
COPY backend/src ./src

# Сборка внутри образа исключает попадание устаревшего локального JAR.
RUN chmod +x gradlew && ./gradlew --no-daemon bootJar

FROM eclipse-temurin:25-alpine

WORKDIR /67-cards

COPY --from=build /build/build/libs/app.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
