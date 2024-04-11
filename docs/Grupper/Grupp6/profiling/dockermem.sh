#! /bin/bash

stats=$(docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}")

i=1
sum=0

printf '%s\n' "$stats"

while IFS= read -r line
do
	test $i -eq 1 && ((i=i+1)) && continue
	num=$(echo "$line" | sed -E 's/.* ([[:digit:].]+)([KMG]?iB) \/ .*/\1/')
	sum=$(echo $sum + $num | bc)
done < <(printf '%s\n' "$stats")
echo
echo "Yotei is currently using: $sum MiB" 
