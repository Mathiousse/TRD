# match/Dockerfile
FROM maven:3.8.6-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src src
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-focal
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 3000
ENV JAVA_TOOL_OPTIONS="-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/heapdump.hprof"
ENTRYPOINT ["java", "-jar", "/app.jar"]