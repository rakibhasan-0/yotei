#!/bin/bash

HOST=localhost
USERNAME=psql
DATABASE=yotei
INFILE="$1"                     # input file = the script argument

SCRIPT_PATH=$(dirname "$0")         # Find path of this script
OLD_PGPASS=$PGPASSFILE              # Save old path
export PGPASSFILE=$SCRIPT_PATH/pgpass.conf # Remember to edit this file!

docker exec -t infra-psql-1 \
pg_restore \
   --clean \
   -d "$DATABASE" \
   --verbose \
   --format=c \
   -h "$HOST" \
   -U "$USERNAME" \
   "$INFILE"

PGPASSFILE=$OLD_PGPASS          # Restore old path
