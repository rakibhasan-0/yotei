#!/bin/bash
docker compose -f docker-compose.yml -f docker-compose-domain-release.yml down
docker volume rm yotei_pgdata
docker compose -f docker-compose.yml -f docker-compose-domain-release.yml build
TAG=$1 ./deploy.sh <<EOF
y
5dv214vt24-prod.cs.umu.se
1
EOF
TAG=$1 docker compose -f docker-compose.yml -f docker-compose-domain-release.yml push --ignore-push-failures
