# Deploy script

## Dependencies

First install docker engine:

[docker install](https://docs.docker.com/engine/install/)

If you don't want to run the script as root follow this guide:

[docker post installation](https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user)

If you want to have a domain name and want to use a https certificate then install certbot. Follow the link below and choose Ngnix as software and then choose the os you are running. (May be problematic, since nginx is running inside a container, we will test this further for the next Sprint):

[certbot](https://certbot.eff.org/instructions)

## Instructions

Open a terminal and unzip the folder using:

```unzip yotei.zip```

Then enter the folder using:

```cd yotei```

You will need to change the permissions using:

```chmod +x deploy.sh```

Now we are ready to run the deploy.sh using:

```./deploy.sh```

You will be asked if you are going to use a domain (this is not tested fully yet). If you intend to build it locally just answer no and it will build locally and work on localhost using port 8080.
