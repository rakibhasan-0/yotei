# Profiling

## Frontend

* För att starta alla api:er utan docker: [start-all-apis.sh](/Grupper/Grupp6/profiling/start-all-apis.sh)
* För att stänga av alla api:er: [kill-all-apis.sh](/Grupper/Grupp6/profiling/kill-all-apis.sh)
* Minnesprofilering utan docker: [memtest.sh](/Grupper/Grupp6/profiling/memtest.sh)



## Resultat utan docker:

1. Frontend som körs med `npm start`: 400-681MB\
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

TDB