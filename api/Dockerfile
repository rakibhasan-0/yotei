# Login

FROM maven

WORKDIR /

COPY . ./

EXPOSE 8085

RUN mvn clean
RUN mvn -q install
CMD ["mvn", "spring-boot:run"]
