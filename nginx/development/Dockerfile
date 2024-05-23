
FROM maven:3.9.1-eclipse-temurin-20 as javadocs
COPY ./backend /src
WORKDIR /src
RUN mvn javadoc:aggregate

FROM python:3.12.3-bookworm as api-docs
COPY ./docs/api-docs /src
WORKDIR /src
#RUN yes | apt-get update
#RUN yes | apt-get install libgl1-mesa-dev
#RUN pip install mkdocs
#RUN pip install mkdocs-macros-plugin
#RUN pip install wheel
#RUN pip install materialx


RUN pip install mkdocs
RUN pip install mkdocs-material-extensions
RUN pip install pymdown-extensions
RUN pip install mkdocs-material
RUN pip install mkdocs-macros-plugin
RUN mkdocs build -d /docs

FROM nginx:latest
EXPOSE 80
RUN rm -rf /etc/nginx/nginx.conf
COPY ./nginx/development/development.conf /etc/nginx/nginx.conf
COPY --from=javadocs /src/target/site/apidocs /var/www/html/javadocs
COPY --from=api-docs /docs /var/www/html/api-docs