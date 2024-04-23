#!/bin/bash

export DOMAIN_NAME="example.com"
export NGINX_CONF="nginx/prod.conf"
envsubst '${DOMAIN_NAME}' < nginx/prod.conf.template > nginx/prod.conf
