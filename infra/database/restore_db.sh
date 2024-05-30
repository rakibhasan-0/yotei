#!/bin/bash

HOST=localhost
USERNAME=psql
DATABASE=yotei

INFILE=$1
USELOCALFILE=false

while getopts ':hvl:' opt; do
    case "$opt" in
	l) # Local copy filename
	    USELOCALFILE=true
	    INFILE=${OPTARG}
	    ;;
	v) # Verbose
	    VERBOSE="--verbose "
	    ;;
	h) # Help
	    echo "Backup restore script for Yotei database. Restores from a backup file generated"
	    echo "by backup_db.sh (by default, the file is assumed to be in the container)."
	    echo "Can also use a locally stored file."
	    echo "Note that the yotei-psql-1 container must be running for script to work."
	    echo
	    echo "Usage: restore_db.sh [-v] [-l] <filename>"
	    echo
	    echo "Options:"
	    echo "-h, --help    display help message (you are reading it right now!)"
	    echo "-v            verbose, print all outputs of postgres commands"
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

if $USELOCALFILE
then
    echo "Using local file '$INFILE'"
    docker cp $INFILE yotei-psql-1:$INFILE
else
    echo "Using file '$INFILE' in container"
fi

if 
    (docker exec -t yotei-psql-1 \
	    pg_restore \
	    -d "$DATABASE" \
	    -h "$HOST" \
	    -U "$USERNAME" \
	    $VERBOSE\
	    --clean \
	    --format=c \
	    "$INFILE")
then
    echo "Successfully restored from backup!"
fi
