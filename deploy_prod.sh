#!/bin/bash
docker compose -f docker-compose.yml -f docker-compose-domain-release.yml down
docker volume rm yotei_pgdata
TAG=$1 ./deploy.sh <<EOF
y
5dv214vt24-prod.cs.umu.se
1
EOF
docker compose -f docker-compose.yml -f docker-compose-domain-release.yml push
