FROM maven

WORKDIR /

COPY . ./

EXPOSE 8088

RUN mvn clean
RUN mvn -q install
CMD ["mvn", "spring-boot:run"]
