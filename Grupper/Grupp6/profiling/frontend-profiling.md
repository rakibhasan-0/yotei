# Profiling

## Frontend

Skript som använts:

```bash
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

```

## Resultat utan docker:

1. Frontend som körs med `npm start`: 400-681MB\
2. Frontend som körs med `npm run build && serve -s build`: ~65MB


|API|RAM Usage|
|-|-|
|Frontend memory usage on port 3000:| 393.445MB
|Comment-API memory usage on port 8089:| 236.582MB
|No pid found listening on port 5132|
|Exercise memory usage on port 8082: |219.457MB
|Plan-API memory usage on port 8087: |339.543MB
|Session-API memory usage on port 8088: |237.117MB
|TAG memory usage on port 8086: |237.539MB
|Teknik memory usage on port 8083: |215.184MB
|User memory usage on port 8085: |218.539MB
|User-setting memory usage on port 6969: |218.895MB
|Workout memory usage on port 8084: |223.48MB


## Resultat med docker

TDB
