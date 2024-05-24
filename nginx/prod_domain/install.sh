#!/bin/bash
envsubst '${DOMAIN_NAME}' < /etc/nginx/conf.d/prod.conf.template > /etc/nginx/conf.d/prod.conf
rm -rf /etc/nginx/conf.d/prod.conf.template
