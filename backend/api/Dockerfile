# Login

FROM maven:3.9.1-eclipse-temurin-20

WORKDIR /

COPY . ./

EXPOSE 8085

RUN mvn clean
RUN mvn -q install --projects \!org.testcontainers:testcontainers,\!org.testcontainers:postgresql

CMD ["mvn", "spring-boot:run"]
