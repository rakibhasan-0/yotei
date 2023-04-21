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
Frontend                 395.793
Comment                  279.027
Exercise                 208.359
Plan                     250.008
Session                  249.805
TAG                      225.168
Teknik                   184.152
User                     193.434
User-setting             195.023
Workout                  207.629
Gateway                  171.566
Total: 2559.96MB
```


## Resultat med docker

```
NAME                       CPU %     MEM USAGE / LIMIT
infra-gateway-1            0.10%     447.1MiB / 15.21GiB
infra-frontend-1           0.01%     404.9MiB / 15.21GiB
infra-usersettings-api-1   0.14%     486.5MiB / 15.21GiB
infra-comment-api-1        0.18%     571MiB / 15.21GiB
infra-techniques-api-1     0.18%     487.8MiB / 15.21GiB
infra-tag-api-1            0.17%     540.9MiB / 15.21GiB
infra-workout-api-1        0.12%     518.5MiB / 15.21GiB
infra-session-api-1        0.16%     522.4MiB / 15.21GiB
infra-user-api-1           0.13%     503.6MiB / 15.21GiB
infra-plan-api-1           0.17%     556.3MiB / 15.21GiB
infra-exercise-api-1       0.14%     484.4MiB / 15.21GiB

Yotei is currently using: 5523.4 MiB
```

