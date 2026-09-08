#-- Stage 1
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app 

RUN apt-get update && apt-get install -y zip && rm -rf /var/lib/apt/lists/*

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./ 
RUN ./mvnw dependency:go-offline
COPY src ./src
RUN ./mvnw package -DskipTests

#-- Stage 2
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
