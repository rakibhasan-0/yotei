#!/bin/bash

HOST=localhost
USERNAME=psql
DATABASE=yotei
OUTFILE="$1"                    # Output file = the script argument (will save in container)

SCRIPT_PATH=$(dirname "$0")         # Find path of this script
OLD_PGPASS=$PGPASS                  # Save old path
export PGPASSFILE=$SCRIPT_PATH/pgpass.conf # Remember to edit this!

docker exec -t yotei-psql-1 pg_dump -Fc -h "$HOST" -U "$USERNAME" "$DATABASE" -f "$OUTFILE"

PGPASSFILE=$OLD_PGPASS          # Restore old path
