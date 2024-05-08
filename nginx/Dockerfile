FROM nginx:latest
ARG DOMAIN_NAME
EXPOSE 80
EXPOSE 443
COPY ./prod.conf.template /etc/nginx/conf.d/
RUN envsubst '${DOMAIN_NAME}' < /etc/nginx/conf.d/prod.conf.template > /etc/nginx/conf.d/prod.conf
RUN rm -rf /etc/nginx/conf.d/prod.conf.template