FROM maven

WORKDIR /

COPY . ./

EXPOSE 8089

RUN mvn clean
RUN mvn -q install
CMD ["mvn", "spring-boot:run"]
