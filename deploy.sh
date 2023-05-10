#! /usr/bin/bash

# This script is used to install and deploy the budo application.
# It works locally and remote, and will install everything needed.
# If the user has a domain name, this will be installed with the correct
# certificates.
# @authors: Erik Nyström (ie15enm@cs.umu.se)
#           Jakob Jerkerius (c20jjs@cs.umu.se)


# Do not prompt for password.
sudo -n true

#List of installs to be made.
INSTALLS="curl zip"

for p in $INSTALLS
do
    # Check if the program is installed.
    if ! command -v "$p" &> /dev/null
    then
        apt install "$p" -y &> /dev/null
    else 
        echo "$p was already installed"
    fi
done

if ! command -v docker &> /dev/null 
then 
    # Install docker.
    echo "Installing docker ..."
    curl -fsSL https://get.docker.com -o get-docker.sh &> /dev/null
    sh get-docker.sh &> /dev/null
    apt update &> /dev/null
    curl -fsSL https://get.docker.com -o get-docker.sh &> /dev/null
    sh get-docker.sh &> /dev/null
    apt update &> /dev/null
fi

while true; do
    read -rp "Are you installing from the budo.zip file? (If yes, this will replace any existing source directories) (y/n) " yn
    case $yn in
        [yY] )
            # Unpack and  set privileges.
            rm -rf frontend/ backend/ infra/ docs/ &> /dev/null
            unzip budo.zip &> /dev/null
            chmod -R 777 backend/
            chmod -R 777 frontend/
            chmod -R 777 docs/
            chmod -R 777 infra/
            cd infra
            break;;
        [nN] )
            break;;
        * )
            echo "invalid response" ;;
    esac
done


while true; do

    # Kills any postgres processes occupying needed ports.
    read -rp "Proceeding will kill any running postgres processes to free occupied ports. Do you wish to proceed? (y/n): " yn

    case $yn in 
        [yY] ) 
            pgrep postgres | xargs kill &> /dev/null ;
            break;;
        [nN] )
            exit;;
        * ) 
            echo "invalid response" ;;
    esac
done

while true; do

    read -rp "Do you have a domain name (y/n): " yn

    case $yn in 
        [yY] ) 
            # Is asked here so $domain can be used as a variable later.
            read -rp "What is your domain name? (This will be asked again by certbot): " domain

            echo "Deploying production server..."

            # Install neccessary packages for certbot.
            apt install snapd &> /dev/null
            snap install core &> /dev/null
            snap refresh core &> /dev/null
            snap install --classic certbot &> /dev/null
            ln -s /snap/bin/certbot /usr/bin/certbot &> /dev/null

            # Create TSL-certificate.
            certbot certonly --nginx

            # Change config-files for nginx and docker.
            sed "s/apollo.cs.umu.se/$domain/" nginx/prod.conf > nginx/kund.conf
            sed -i.bak 's/development.conf/kund.conf/g' docker-compose.yml 
            sed -i '/letsencrypt/s/# //' docker-compose.yml
            sed -i '/USE_IMP_SERVER/s/true/false/' ../frontend/.env 

            break;;
        [nN] )
            echo "Deploying development server..."
            break;;
        * ) 
            echo "invalid response" ;;
    esac
done

# Build and deploy containers.

docker compose down &> /dev/null
docker build -t pvt2023/gateway:latest gateway &> /dev/null
docker build -t pvt2023/api:latest api &> /dev/null
docker build -t pvt2023/frontend:latest . &> /dev/null
docker compose up
