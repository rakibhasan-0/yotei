# Tag API

FROM maven

WORKDIR /

COPY . ./

EXPOSE 8086

RUN mvn clean
RUN mvn -q install
CMD ["mvn", "spring-boot:run"]