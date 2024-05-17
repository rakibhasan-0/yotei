# Login

FROM maven:3.9.1-eclipse-temurin-20

WORKDIR /

COPY . ./

EXPOSE 8085

RUN mvn clean -pl \!org.testcontainers:testcontainers -pl \!org.testcontainers:postgresql
RUN mvn -q install -pl \!org.testcontainers:testcontainers -pl \!org.testcontainers:postgresql

CMD ["mvn", "spring-boot:run"]
