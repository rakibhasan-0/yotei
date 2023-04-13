# Techniques API

FROM maven

WORKDIR /

COPY . ./

EXPOSE 8083

RUN mvn clean
RUN mvn -q install
CMD ["mvn", "spring-boot:run"]