#!/bin/bash

if ! command -v zip &> /dev/null
then
    echo "Installing unzip"
    sudo apt update
    yes | sudo apt install unzip
fi
rm -rf yotei
unzip yotei.zip
cd yotei
bash -c "./deploy.sh"
