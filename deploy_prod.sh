#!/bin/bash
TAG=$1 docker compose -f docker-compose.yml -f docker-compose-domain-release.yml down
docker volume ls | grep "pgdata" | rev | cut -d' ' -f1 | rev | xargs docker volume rm &> /dev/null
TAG=$1 docker compose -f docker-compose.yml -f docker-compose-domain-release.yml up --build -d
TAG=$1 docker compose -f docker-compose.yml -f docker-compose-domain-release.yml push --ignore-push-failures
