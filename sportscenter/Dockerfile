
# ============================================
# ÉTAPE 1 : Build — compile le projet Maven
# ============================================
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copie d'abord uniquement le pom.xml pour profiter du cache Docker
# (les dépendances ne seront re-téléchargées que si pom.xml change)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copie le reste du code source
COPY src ./src

# Compile et génère le .jar exécutable (skip des tests pour accélérer le build)
RUN mvn clean package -DskipTests

# ============================================
# ÉTAPE 2 : Runtime — image finale, allégée
# ============================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copie uniquement le .jar généré à l'étape précédente (pas tout Maven/le code source)
COPY --from=build /app/target/*.jar app.jar

# Render fournit dynamiquement le port via la variable d'environnement PORT
EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]