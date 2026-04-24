FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY target/*.jar app.jar

ENTRYPOINT ["java","-Djava.net.preferIPv4Stack=true","-jar","sh", "-c", "java $JAVA_OPTS -jar app.jar"]
