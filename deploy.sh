#!/bin/bash

if ! command -v docker &> /dev/null
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

    sudo systemctl enable docker.service

    sudo systemctl enable containerd.service
    
    bash -c "./deploy.sh"

else

    while true; do
        read -rp "Do you have a version deployed already? (y/n): " yn
        case $yn in 
            [yY] ) 
            docker compose -p yotei -f docker-compose.yml -f docker-compose-domain-release.yml down

            while true; do
                read -rp "Would you like to reset the database? (y/n): " yn
                case $yn in 
                    [yY] ) 
                        docker volume ls | grep "pgdata" | rev | cut -d' ' -f1 | rev | xargs docker volume rm &> /dev/null
			docker volume ls | grep "media" | rev | cut -d' ' -f1 | rev | xargs docker volume rm &> /dev/null
                        break;;
                    [nN] )
                        break;;
                    * )
                        echo "Invalid response" ;;
                esac
            done

            break;;
        [nN] )
            break;;
        * )
            echo "Invalid response" ;;
        esac
    done

    while true; do
        read -rp "Do you have a domain name (y/n): " yn
        case $yn in 
            [yY] ) 
            read -rp "Whats your domain name: " domain
            docker compose -p yotei -f docker-compose.yml -f docker-compose-domain-release.yml up -d
	    docker compose -p yotei -f docker-compose.yml -f docker-compose-domain-release.yml exec nginx chmod +x /root/install.sh
            docker compose -p yotei -f docker-compose.yml -f docker-compose-domain-release.yml exec -e DOMAIN_NAME=$domain nginx /root/install.sh
            docker compose -p yotei -f docker-compose.yml -f docker-compose-domain-release.yml restart nginx
            docker compose -p yotei -f docker-compose.yml -f docker-compose-domain-release.yml run --rm certbot certonly -v --webroot --webroot-path /var/www/certbot/ --register-unsafely-without-email -d $domain
            docker compose -p yotei -f docker-compose.yml -f docker-compose-domain-release.yml exec nginx sed -i 's/#//g' /etc/nginx/conf.d/prod.conf
            docker compose -p yotei -f docker-compose.yml -f docker-compose-domain-release.yml restart

            while true; do
                read -rp "Would you like to create a cronjob for certificate renewal (y/n): " yn
                case $yn in
                    [yY] )
                        if [[ -z $(crontab -l | grep "docker run --rm certbot/certbot:latest renew" ; exit $?) ]]
                        then 
                            (crontab -l 2>/dev/null ; echo "0 0 1 * * docker run --rm certbot/certbot:latest renew") | crontab -
                        fi
                        break;;
                    [nN] )
                        break;;
                    * )
                        echo "Invalid response" ;;
                esac
            done
            
            break;;
        [nN] )
            echo "Deploying production server"
            docker compose -p yotei -f docker-compose.yml -f docker-compose-release.yml up -d
            break;;
        * )
            echo "Invalid response" ;;
        esac
    done
fi
