FROM maven:3.9.1-eclipse-temurin-20

WORKDIR /

COPY . ./

EXPOSE 8080-8089

RUN mvn clean
RUN mvn -q install
CMD ["mvn", "spring-boot:run"]
