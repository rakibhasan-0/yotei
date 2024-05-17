#!/bin/bash
docker build -t pvt2024/gateway:latest backend/gateway
docker build -t pvt2024/api:latest backend/api
docker build -t pvt2024/database:latest infra/database
docker build -t pvt2024/frontend:latest frontend/