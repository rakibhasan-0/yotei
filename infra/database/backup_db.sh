#!/bin/bash

OUTFILE="yotei_backup_$(date -I)" # Standard output file
SAVELOCALLY=false                 # Don't save local copy by default

while getopts ':ho:l:' opt; do
    case "$opt" in
	o) # Output filename (in container)
	    OUTFILE=${OPTARG}
	    ;;
	l) # Local copy filename
	    SAVELOCALLY=true
	    LOCALFILE=${OPTARG}
	    ;;
	h)
	    echo "Backup script for Yotei database. Saves a backup file in the container to"
	    echo "be used with restore_db.sh. Can also save a copy of the file locally."
	    echo
	    echo "Usage: backup_db.sh [-o <output filename>] [-l <local copy filename>]"
	    echo
	    echo "Options:"
	    echo "-h, --help      display help message (you are reading it right now!)"
	    echo "-o <filename>   specify backup filename (in the container)"
	    echo "-l <filename>   specify backup filename (for local copy)"
	    exit
	    ;;
	:)
	    echo "Option requires an argument! For help, run backup_db.sh -h"
	    echo "Usage: backup_db.sh [-o <output filename>] [-l <local copy filename>]"
	    exit
	    ;;
	?)
	echo "Invalid usage! For help, run backup_db.sh -h"
	echo "Usage: backup_db.sh [-o <output filename>] [-l <local copy filename>]"
	exit
	;;
    esac
done

HOST=localhost
USERNAME=psql
DATABASE=yotei


SCRIPT_PATH=$(dirname "$0")         # Find path of this script
OLD_PGPASS=$PGPASS                  # Save old path
export PGPASSFILE=$SCRIPT_PATH/pgpass.conf # Remember to edit this!

echo "Making backup in file '$OUTFILE' (in container)"
docker exec -t yotei-psql-1 pg_dump -Fc -h "$HOST" -U "$USERNAME" "$DATABASE" -f "$OUTFILE"

if $SAVELOCALLY
then
    echo "Making backup in file '$LOCALFILE' (locally)"
    docker cp yotei-psql-1:$OUTFILE $LOCALFILE
fi

PGPASSFILE=$OLD_PGPASS          # Restore old path
