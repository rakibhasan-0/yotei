#!/bin/bash

ADDRESS=postgres.cs.umu.se
USERNAME=c5dv214_vt22_dev
DATA=c5dv214_vt22_dev
INFILE="$1"                     # input file = the script argument

SCRIPT_PATH=$(dirname "$0")         # Find path of this script
OLD_PGPASS=$PGPASSFILE              # Save old path
export PGPASSFILE=$SCRIPT_PATH/pgpass.conf # Remember to edit this file!

docker -exec -t 5dv214vt22_psql_1 \
pg_restore \
    --clean \
    -d $DATA \
    --verbose \
    --format=c \
    -h $ADDRESS \
    -U $USERNAME \
    "$INFILE"

PGPASSFILE=$OLD_PGPASS          # Restore old path
