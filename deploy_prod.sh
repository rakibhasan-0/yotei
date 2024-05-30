#!/bin/bash
TAG=$1 docker compose -f docker-compose.yml -f docker-compose-domain-release.yml down -v
TAG=$1 docker compose -f docker-compose.yml -f docker-compose-domain-release.yml up --build
TAG=$1 docker compose -f docker-compose.yml -f docker-compose-domain-release.yml push --ignore-push-failures
