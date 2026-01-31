FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
ENV JAR_NAME=lrconstrucao.jar
COPY --from=build /app/target/*.jar $JAR_NAME
CMD ["java", "-jar", "lrconstrucao.jar"]