# Run System Tests
Whenever a breaking change or a significant modification is made, system tests must be run to minimize the risk of project failure. This can be done manually locally. 

1. Run all docker containers either in the Docker Desktop ui or with this command:

```sh
docker compose up -d
```
2. Stop the frontend container in docker. Either through the UI or by the following commands in a terminal, which lists all running containers and stops the container with the id that you copy from the list (should look something like *eb4b620b205a*):

```sh
  docker ps 
  docker stop <id>
```

3. Run system tests:

```sh
cd frontend
npm run systest
```

## User Interface for System Tests
You can also run the tests with the following command, which runs the tests in UI mode for a better developer experience with time travel debugging, watch mode and more. 
```sh
npm run systest:ui
```

## TODO 
Write about the other scripts 