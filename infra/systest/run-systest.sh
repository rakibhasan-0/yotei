#!/bin/sh

#  _____
# |==   |  ~      ~
# |  o. | ~ ~  ~       ~
# |__O__|    ~
# ULTRsysTESTr v.0.99992.1
#
# Abandon all hope, ye who enters here.
#
# Performs systemtests. Takes a runner id as an argument
# and optional versions for DB, API, GATEWAY and FRONTEND.
# The versions will default to :latest if not present.
# If there exists a file `X-latest-override.tar`, where
# X may be `db`, `api`, `gateway` or `frontend`, the
# local `pvt2023/X:latest` will be overrided with the container
# stored in the tar.
#
# Example usage:
#   DB_VERSION=1.2.3 API_VERSION=2.2.0 ./run-systest.sh 1
#
# This will run systests with gateway, frontend as :latest. 

set -e

function early_exit() {
    docker rm -f $DB_NAME $API_NAME $FRONTEND_NAME $GATEWAY_NAME
    exit 1
}

function curl_await() {
    trap "exit" INT
    set +e

    TIMEOUT=30
    END=$(expr $(date +%s) + $TIMEOUT)
    URL="${@: -1}"
    RESP=""

    while [[ $(date +%s) -lt $END ]]; do
        RESP=$(curl -s -o /dev/null -w '%{http_code}' "$@")
        if [[ $RESP == "200" ]]; then
            return 0
        fi
        sleep 2
    done

    echo "got no 200 response for '$URL' (got $RESP). tried for $TIMEOUT seconds."
    exit
}

function pg_wait_container() {
    trap "exit" INT
    CONTAINER=$1
    USER=$2
    DB=$3

    TIMEOUT=90
    END=$(expr $(date +%s) + $TIMEOUT)

    echo "awaiting postgres $CONTAINER to come online ..."
    docker run --rm --link $CONTAINER \
        --entrypoint sh \
        alpine:latest \
        -c "
        set -x;
        apk add postgresql15-client;
        while [[ \$(date +%s) -lt $END ]]; do
            pg_isready -h $CONTAINER -t 10 -U $USER -d $DB && {
                exit 0
            }
            sleep 2
        done
        exit 1
        " &>/dev/null || {
        
        echo "postgres $CONTAINER unresponsive. tried for $TIMEOUT seconds."
        exit 1
    }

    echo "postgres $CONTAINER online."
    trap '' INT
}

function override_if_local_build_exists() {
    IMAGE=$1
    VAR=$2

    if [ -f $IMAGE-latest-override.tar ]; then
        echo "overwriting $IMAGE:latest with local build"
        docker load < $IMAGE-latest-override.tar
    fi
}

RUID=${1:?No unique runner id given.}; shift

echo "figuring out versions and overrides ..."
# handle versions.
DB_VERSION=${DB_VERSION:=latest}
API_VERSION=${API_VERSION:=latest}
GATEWAY_VERSION=${GATEWAY_VERSION:=latest}
FRONTEND_VERSION=${FRONTEND_VERSION:=latest}


echo "fetching images ..."

# fetch the images for the correct image
# when running locally, you most likely have the versions you want
# already.
[ -z $CI ] || {
    docker pull -q pvt2023/database:$DB_VERSION
    docker pull -q pvt2023/api:$API_VERSION
    docker pull -q pvt2023/frontend:$FRONTEND_VERSION
    docker pull -q pvt2023/gateway:$GATEWAY_VERSION

    #   If a version is not defined, it is assumed to be latest.
    #   If we find a file `<container>-latest-override.tar`, we load it first.
    #   This is required since if we're in a gitlab CI job, we might depend on
    #   the previous image-build job.
    override_if_local_build_exists db $DB_VERSION
    override_if_local_build_exists api $API_VERSION
    override_if_local_build_exists gateway $GATEWAY_VERSION
    override_if_local_build_exists frontend $FRONTEND_VERSION
}

# using the runner unique id, we pick container names and ports
DB_NAME="systest-db-$RUID"
API_NAME="systest-api-$RUID"
FRONTEND_NAME="systest-frontend-$RUID"
GATEWAY_NAME="systest-gateway-$RUID"

GATEWAY_PORT=$(expr 16000 + $RUID % 64)

# we can now start up the system.
echo "running gateway on port :$GATEWAY_PORT. starting system ..."
trap early_exit EXIT

docker run -d \
    --name $DB_NAME \
    -e POSTGRES_USER=psql \
    -e POSTGRES_PASSWORD=yotei123 \
    -e POSTGRES_DB=yotei \
    pvt2023/database:$DB_VERSION

pg_wait_container $DB_NAME psql yotei
docker run -d \
    --name $API_NAME \
    --link $DB_NAME \
    -e POSTGRES_USER=psql \
    -e POSTGRES_PASSWORD=yotei123 \
    -e POSTGRES_DB=yotei \
    -e POSTGRES_HOST=$DB_NAME:5432 \
    pvt2023/api:$API_VERSION

docker run -d \
    --name $FRONTEND_NAME \
    pvt2023/frontend:$FRONTEND_VERSION

docker run -p $GATEWAY_PORT:8080 -d \
    --name $GATEWAY_NAME \
    --link $API_NAME \
    --link $FRONTEND_NAME \
    -e BACKEND_HOST=http://$API_NAME:8085 \
    -e WEBSERVER_HOST=http://$FRONTEND_NAME:3000 \
    pvt2023/gateway:$GATEWAY_VERSION

echo "system running! running tests ..."
function tests_failed() {
    echo -e "\e[31mtests failed\e[0m"
    early_exit
}
trap tests_failed EXIT

# small tests :^)
echo "1. tests if frontend responds 200"
curl_await http://localhost:$GATEWAY_PORT/

echo "2. tests if backend-login responds 200"
curl_await -XPOST -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "admin"}' \
    http://localhost:$GATEWAY_PORT/api/users/verify

# all good!
echo -e "\e[32mtests passed\e[0m"

trap '' EXIT
docker rm -f $DB_NAME $API_NAME $FRONTEND_NAME $GATEWAY_NAME
