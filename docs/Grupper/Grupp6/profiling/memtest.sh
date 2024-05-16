#Usage PORT "description"
function port_to_mem() {
PID=$(lsof -i :$1 | grep -E 'node|java|rootlessp' | awk 'END{print $2}')

if [[ $PID -eq 0 ]]; then
        echo No pid found listening on port $1
        return 0
fi

local MEM=$(pmap -x $PID | awk 'BEGIN{FS="  *"}END{print $4}')

TOT_KB="$(($TOT_KB+$MEM))"
local mb=$(echo $MEM | awk '{printf $1/1024}')
#echo -e "$2 memory usage on port $1: ${mb}MB"


# Print output nicely
printf "%-20s \t %-7s\n" "$2" "${mb}"

}

DESCS=("Frontend" "Comment-API" "Postgres" "Exercise" "Plan-API" "Session-API" "TAG" "Teknik" "User" "User-setting" "Workout")
PORTS=(3000 8089 5132 8082 8087 8088 8086 8083 8085 6969 8084)

#Print header
printf "%-20b \t %-7b\n" "API" "MB"

for (( i=0; i<${#PORTS[@]}; i++ ));
do
        port_to_mem ${PORTS[$i]} ${DESCS[$i]} 
done

TOT_MB=$(echo $TOT_KB | awk '{print $1/1024}')


echo Total: ${TOT_MB}MB
