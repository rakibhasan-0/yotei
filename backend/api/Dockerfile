# Login

FROM maven:3.9.1-eclipse-temurin-20

WORKDIR /

COPY . ./

EXPOSE 8085

RUN mvn clean
RUN mvn -q install -DskipTests
ENV PDF_ASSET_PATH="/src/main/java/se/umu/cs/pvt/assets"

CMD ["mvn", "-q" ,"spring-boot:run"]
