FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/*.jar app.jar

ENTRYPOINT sh -c "java $JAVA_OPTS -Djava.net.preferIPv4Stack=true -jar app.jar --spring.profiles.active=docker"
