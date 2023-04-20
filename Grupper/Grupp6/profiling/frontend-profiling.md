# Produktion

```
NAME                       CPU %     MEM USAGE / LIMIT
infra-nginx-1              0.01%     5.652MiB / 31.24GiB
infra-gateway-1            0.31%     622.1MiB / 31.24GiB
infra-session-api-1        0.30%     659.5MiB / 31.24GiB
infra-tag-api-1            0.40%     597.7MiB / 31.24GiB
infra-usersettings-api-1   0.49%     547.7MiB / 31.24GiB
infra-frontend-1           0.24%     708.8MiB / 31.24GiB
infra-user-api-1           0.32%     550.3MiB / 31.24GiB
infra-workout-api-1        0.38%     622.6MiB / 31.24GiB
infra-exercise-api-1       0.38%     538.3MiB / 31.24GiB
infra-comment-api-1        0.48%     561.3MiB / 31.24GiB
infra-techniques-api-1     0.32%     560.8MiB / 31.24GiB
infra-plan-api-1           0.44%     613MiB / 31.24GiB
infra-psql-1               0.01%     40.78MiB / 31.24GiB

Total: 6628.532 MiB
```

# Lokal profiling

## Frontend

* För att starta alla api:er utan docker: [start-all-apis.sh](/Grupper/Grupp6/profiling/start-all-apis.sh)
* För att stänga av alla api:er: [kill-all-apis.sh](/Grupper/Grupp6/profiling/kill-all-apis.sh) **varning** detta kör `ps | grep backend | kill` så allt med taggen `backend` stängs av! 
* För att starta alla api:er med docker
	1. Kör `build.sh` i backend
	2. Kör `docker compose up -d` i infra
* Minnesprofilering utan docker: [memtest.sh](/Grupper/Grupp6/profiling/memtest.sh)
* Minnesprofilering med docker: [dockermem.sh](/Grupper/Grupp6/profiling/dockermem.sh)


## Resultat utan docker:

1. Frontend som körs med `npm start`: 400-681MB
2. Frontend som körs med `npm run build && serve -s build`: ~65MB

```
API                      MB     
Frontend                 395.605
Comment-API              252.957
Exercise                 218.004
Plan-API                 243.973
Session-API              235.758
TAG                      237.07 
Teknik                   216.188
User                     218.477
User-setting             216.879
Workout                  220.223
Total: 2455.13MB
```


## Resultat med docker
