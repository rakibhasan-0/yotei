#!/bin/bash

INFILE=$1
USELOCALFILE=false

while getopts ':hl:' opt; do
    case "$opt" in
	l) # Local copy filename
	    USELOCALFILE=true
	    INFILE=${OPTARG}
	    ;;
	h)
	    echo "Backup restore script for Yotei database. Restores from a backup file generated"
	    echo "by backup_db.sh (by default, the file is assumed to be in the container)."
	    echo "Can also use a locally stored file."
	    echo "Note that the yotei-psql-1 container must be running for script to work."
	    echo
	    echo "Usage: restore_db.sh [-l] <filename>"
	    echo
	    echo "Options:"
	    echo "-h, --help    display help message (you are reading it right now!)"
	    echo "-l            use locally stored file. Warning! This will copy it to"
	    echo "              the root directory in the container, overwriting it."
	    exit
	    ;;
	:)
	    echo "Option requires an argument! For help, run restore_db.sh -h"
	    echo "Usage: restore_db.sh [-l] <filename>"
	    exit
	    ;;
	?)
	echo "Invalid option! For help, run restore_db.sh -h"
	echo "Usage: restore_db.sh [-l] <filename>"
	exit
	;;
    esac
done

HOST=localhost
USERNAME=psql
DATABASE=yotei

SCRIPT_PATH=$(dirname "$0")         # Find path of this script
OLD_PGPASS=$PGPASSFILE              # Save old path
export PGPASSFILE=$SCRIPT_PATH/pgpass.conf # Remember to edit this file!

if $USELOCALFILE
then
    echo "Using local file '$INFILE'"
else
    echo "Using file '$INFILE'"
fi


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
