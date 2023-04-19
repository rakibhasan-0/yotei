#!/bin/bash


# Start all APIs without docker
# Needs to be ran inside from the backend repository
for VARIABLE in $(find . -mindepth 1 -maxdepth 1 -type d)
do
    cd $VARIABLE
    mvn spring-boot:run &
    cd ..
done
