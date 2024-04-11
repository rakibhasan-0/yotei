#!/bin/bash

HOST=localhost
USERNAME=psql
DATABASE=yotei
OUTFILE="$1"                    # Output file = the script argument

SCRIPT_PATH=$(dirname "$0")         # Find path of this script
OLD_PGPASS=$PGPASS                  # Save old path
export PGPASSFILE=$SCRIPT_PATH/pgpass.conf # Remember to edit this!

docker exec -t 5dv214vt22_psql_1 pg_dump -Fc -h "$HOST" -U "$USERNAME" "$DATABASE" > "$OUTFILE"

PGPASSFILE=$OLD_PGPASS          # Restore old path
