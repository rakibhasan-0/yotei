#!/bin/bash

# Detta skript mäter nuvarande minnesanvändning av den node process
# som har port 3000 öppen.
#
# RSS minnen beskrivs av How-To Geek som 
# 	 "This is the resident set size. That is, the 
# 	 amount of memory that is currently in RAM, 
# 	 and not swapped out."

# Usage PORT "description"
function port_to_mem() {
PID=$(lsof -i :$1 | grep -E 'node|java' | awk 'END{print $2}')

if [[ $PID -eq 0 ]] then
	echo No pid found listening on port $1
	return 0
fi

MEM=$(pmap -x $PID | awk 'BEGIN{FS="  *"}END{print $4/1024}')

echo -e "$2 memory usage on port $1: ${MEM}MB"
return $i
}

DESCS=("Frontend" "Comment-API" "Postgres" "Exercise" "Plan-API" "Session-API" "TAG" "Teknik" "User" "User-setting" "Workout")
PORTS=(3000 8089 5132 8082 8087 8088 8086 8083 8085 6969 8084)


for (( i=0; i<${#PORTS[@]}; i++ ));
do
	port_to_mem ${PORTS[$i]} ${DESCS[$i]} 
done
