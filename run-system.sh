#!/bin/sh
# Startup the system
set -e

echo "starting backend containers..." >&2

# Download the latest database init.sql & database Dockerfile
# Either uses SSH keys or a gitlab API access token.
mkdir -p .database-init
if [ -z "$CI" ]; then
    git archive --remote=git@git.cs.umu.se:courses-project/5dv214vt23/infra.git main database/init/init.sql \
        | tar xO > .database-init/init.sql
else
    >.database-init/init.sql curl --silent --show-error --fail \
        --header "PRIVATE-TOKEN: $INFRA_REPO_ACCESS_TOKEN" \
        "https://git.cs.umu.se/api/v4/projects/9165/repository/files/database%2Finit%2Finit.sql/raw?ref=main"
fi

# We also need to build a container with the file, as docker-in-docker volumes
# are to the docker host.
if [ -z "$CI" ]; then
    git archive --remote=git@git.cs.umu.se:courses-project/5dv214vt23/infra.git main database/Dockerfile \
        | tar xO | echo "$(cat -)
COPY init.sql /docker-entrypoint-initdb.d/init.sql" \
        > .database-init/Dockerfile
else
    curl --silent --show-error --fail \
        --header "PRIVATE-TOKEN: $INFRA_REPO_ACCESS_TOKEN" \
        "https://git.cs.umu.se/api/v4/projects/9165/repository/files/database%2FDockerfile/raw?ref=main" \
        | echo "$(cat -)
COPY init.sql /docker-entrypoint-initdb.d/init.sql" \
        > .database-init/Dockerfile
fi

docker build -q -t pvt-psql-test:latest .database-init

nc -z localhost $GATEWAY_PORT 2>/dev/null && {
    echo "gateway port :$GATEWAY_PORT already running." >&2
} || {
    docker run -d \
        --name $PSQL_NAME \
        -e POSTGRES_USER=psql \
        -e POSTGRES_PASSWORD=yotei123 \
        -e POSTGRES_DB=yotei \
        pvt-psql-test:latest

    docker run -d \
        --name $API_NAME \
        --link $PSQL_NAME \
        -e POSTGRES_USER=psql \
        -e POSTGRES_PASSWORD=yotei123 \
        -e POSTGRES_DB=yotei \
        -e POSTGRES_HOST=$PSQL_NAME:5432 \
        pvt2023/api:latest

    docker run -p $GATEWAY_PORT:8080 -d \
        --name $GATEWAY_NAME \
        --link $API_NAME \
        -e BACKEND_HOST=http://$API_NAME:8085 \
        -e WEBSERVER_HOST=http://$API_NAME:8085 \
        pvt2023/gateway:latest
}

echo "system up and running. Giving some time for playwright to find the system." >&2
sleep 60
