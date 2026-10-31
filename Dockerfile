from node:26 as frontend-build
workdir /app
copy frontend/package.json frontend/package-lock.json ./ 
run npm ci 
copy frontend ./ 
env VITE_API_URL=""
run npm run build 

from eclipse-temurin:21-jdk as backend-build
workdir /app
copy backend/.mvn/ .mvn/
copy backend/mvnw backend/pom.xml .
run ./mvnw dependency:go-offline
copy backend/src ./src
copy --from=frontend-build /app/dist ./src/main/resources/static
run ./mvnw package -DskipTests

from eclipse-temurin:21-jre
workdir /app 
copy --from=backend-build /app/target/*.jar app.jar 
expose 8080
entrypoint ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
