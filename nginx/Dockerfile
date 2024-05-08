FROM nginx:latest
ARG DOMAIN_NAME
EXPOSE 80
EXPOSE 443
COPY ./prod.conf.template /etc/nginx/
RUN envsubst '${DOMAIN_NAME}' < /etc/nginx/prod.conf.template > /etc/nginx/prod.conf
RUN rm -rf /etc/nginx/prod.conf.template