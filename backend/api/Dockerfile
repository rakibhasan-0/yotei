# Login

FROM maven:3.9.1-eclipse-temurin-20

WORKDIR /

COPY . ./

EXPOSE 8085

RUN mvn clean
RUN mvn -q install -DskipTests

CMD ["mvn", "spring-boot:run"]
