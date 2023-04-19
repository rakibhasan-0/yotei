# Profiling

## Frontend

Skript som använts:

```bash
#!/bin/bash
PORT=3000
# Get PID of the node process that has port 3000 open
PID=$(lsof -i :$PORT | grep node | awk 'END{print $2}')

if [[ $PID -eq 0 ]] then
	echo No frontend found on port $PORT
	exit 1
fi

# Get RSS memory in Megabytes from pmap
MEM=$(pmap -x $PID | awk 'BEGIN{FS="  *"}END{print $4/1024}')

echo Frontend memory usage: ${MEM}MB
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