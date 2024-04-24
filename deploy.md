# Deploy script

## Prerequsite

First install docker engine

[docker install](https://docs.docker.com/engine/install/)

If you don't run the script as root follow this guide:

[docker post install](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)

If you want to have a domain name and want to use a https certificate then install. Choose Ngnix as software and then choose the os you are running.

[certbot](https://certbot.eff.org/instructions)

## Instructions

Open a terminal and unzip the folder using 

```unzip yotei.zip```

Then enter the folder 

```cd yotei```

and type

```chmod +x deploy.sh```

then run

```./deploy.sh```

and answer the questions.
