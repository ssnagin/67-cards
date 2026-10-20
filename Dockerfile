FROM eclipse-temurin:25-alpine

WORKDIR /67-cards

COPY backend/build/libs/app.jar app.jar

ENTRYPOINT ["java", "jar", "app.jar"]