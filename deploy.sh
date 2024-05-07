#!/bin/bash



if ! command -v docker
then

    for pkg in docker.io docker-doc docker-compose docker-compose-v2 podman-docker containerd runc; do sudo apt-get remove $pkg; done
# Add Docker's official GPG key:
    sudo apt-get update
    sudo apt-get install ca-certificates curl
    sudo install -m 0755 -d /etc/apt/keyrings
    sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    sudo chmod a+r /etc/apt/keyrings/docker.asc

    # Add the repository to Apt sources:
    echo \
	"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update


    yes | sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    sudo groupadd docker

    sudo usermod -aG docker $USER

    newgrp docker

    sudo systemctl enable docker.service

    sudo systemctl enable containerd.service
fi




while true; do
    read -rp "Do you have a domain name (y/n): " yn
    case $yn in 
        [yY] ) 
	    read -rp "Whats your domain name: " domain
	    export DOMAIN_NAME="$domain"
	    sed -i 's/#-/-/g' docker-compose.release.yml
	    envsubst '${DOMAIN_NAME}' < nginx/prod.conf.template > nginx/prod.conf
	    
	    docker compose -f docker-compose.yml -f docker-compose-domain-release.yml up --build -d
	    
	    break;;
	[nN] )
	    echo "Deploying production server"
	    break;;
	* )
	    echo "Invalid response" ;;
    esac
done
