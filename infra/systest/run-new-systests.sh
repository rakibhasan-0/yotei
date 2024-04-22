#!/bin/bash

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

echo "system running! running tests ..."
function tests_failed() {
    echo -e "\e[31mtests failed\e[0m"
    early_exit
}
trap tests_failed EXIT

# small tests :^)
echo "1. tests if frontend responds 200"
curl_await http://localhost:3000/

echo "2. tests if backend-login responds 200"
curl_await -XPOST -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "admin"}' \
    http://localhost:8085/api/users/verify

# all good!
echo -e "\e[32mtests passed\e[0m"

trap '' EXIT
