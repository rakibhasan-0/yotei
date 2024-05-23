#!/bin/bash

if ! command -v zip &> /dev/null
then
    echo "Installing zip"
    sudo apt update
    yes | sudo apt install zip
fi
rm -rf yotei
unzip yotei.zip
cd yotei
bash -c "./deploy.sh"
