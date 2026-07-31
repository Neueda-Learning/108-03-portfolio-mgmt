# Build stage
FROM maven:3.9.11-eclipse-temurin-25 AS build

WORKDIR /workspace

COPY .mvn .mvn
COPY mvnw mvnw
COPY pom.xml pom.xml
RUN chmod +x mvnw
RUN ./mvnw -q -DskipTests dependency:go-offline

COPY src src
RUN ./mvnw -DskipTests clean package

# Runtime stage
FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=build /workspace/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]