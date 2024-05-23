# Deploy Yotei

## Instructions

Open a terminal and unzip the folder using:

```unzip yotei.zip```

Then enter the folder using:

```cd yotei```

You will need to change the permissions using:

```chmod +x deploy.sh```

Now we are ready to run the deploy.sh using:

```./deploy.sh```

Firstly the required docker dependencies will be downloaded if they do not exist on your machine.

You will be asked if you currently have an older version deployed on your machine. If that is the case you will also be asked if you would like to reset the database or keep the current one.

You will be asked if you intend to use a domain. If the answer is yes, provide the correct domain. Otherwise it will build locally and work on localhost through port 8080.

If you chose to use a domain, https-certification will be provided using certbot. You will therefor be asked if you would like to set up a cronjob for renewal of the certificate. If the answer is yes renewal of the https-certificate will run every month.





