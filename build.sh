#!/bin/bash
docker build -t pvt2023/gateway:latest gateway
docker build -t pvt2023/exercise-api:latest exercise-api
docker build -t pvt2023/techniques-api:latest techniques-api
docker build -t pvt2023/workout-api:latest workout-api
docker build -t pvt2023/user:latest user
docker build -t pvt2023/tag-api:latest tag-api
docker build -t pvt2023/plan-api:latest plan-api
docker build -t pvt2023/comment-api:latest comment-api
docker build -t pvt2023/session-api:latest session-api
docker build -t pvt2023/usersettings-api:latest usersettings-api
