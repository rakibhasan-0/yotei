# Usersettings API

FROM maven

WORKDIR /

COPY . ./

EXPOSE 6969

RUN mvn clean
RUN mvn -q install
CMD ["mvn", "spring-boot:run"]