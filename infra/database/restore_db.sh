#!/bin/bash

HOST=localhost
USERNAME=psql
DATABASE=yotei
INFILE="$1"                     # Input file = the script argument (will save in container)

SCRIPT_PATH=$(dirname "$0")         # Find path of this script
OLD_PGPASS=$PGPASSFILE              # Save old path
export PGPASSFILE=$SCRIPT_PATH/pgpass.conf # Remember to edit this file!

docker exec -t yotei-psql-1 \
pg_restore \
   -d "$DATABASE" \
   -h "$HOST" \
   -U "$USERNAME" \
   --clean \
   --verbose \
   --format=c \
   "$INFILE"

PGPASSFILE=$OLD_PGPASS          # Restore old path
