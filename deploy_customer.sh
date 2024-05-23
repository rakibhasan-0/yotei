#!/bin/bash

if ! command -v unzip &> /dev/null
then
    echo "Installing unzip"
    sudo apt update &> /dev/null
    yes | sudo apt install unzip &> /dev/null
fi
rm -rf yotei
unzip yotei.zip
cd yotei
chmod +x deploy.sh
bash -c "./deploy.sh"
