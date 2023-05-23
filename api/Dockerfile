# Login

FROM maven:3.9.1-eclipse-temurin-20

WORKDIR /

COPY . ./

EXPOSE 8085

RUN mkdir -p /media
RUN mvn clean
RUN mvn -q install

CMD ["mvn", "spring-boot:run"]
