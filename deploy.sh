#!/bin/bash

while true; do
    read -rp "Do you have a domain name (y/n): " yn
    case $yn in 
        [yY] ) 
	    read -rp "Whats your domain name: " domain
	    export DOMAIN_NAME="$domain"
	    sed -i 's/#-/-/g' docker-compose.release.yml
	    envsubst '${DOMAIN_NAME}' < nginx/prod.conf.template > nginx/prod.conf
	    break;;
	[nN] )
	    echo "Deploying production server"
	    break;;
	* )
	    echo "Invalid response" ;;
    esac
done

if command -v docker-compose
then    
    docker-compose down -v
    docker build --no-cache -t pvt2024/gateway:3.1 backend/gateway
    docker build --no-cache -t pvt2024/api:3.1 backend/api
    docker build --no-cache -t pvt2024/frontend:3.1 frontend
    docker-compose -f docker-compose.release.yml up -d
else 
    docker compose down -v
    docker build --no-cache -t pvt2024/gateway:3.1 backend/gateway
    docker build --no-cache -t pvt2024/api:3.1 backend/api 
    docker build --no-cache -t pvt2024/frontend:3.1 frontend
    docker compose -f docker-compose.release.yml up -d
fi
