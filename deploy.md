# Deploy Yotei

## Instructions
Root is not needed but sudo access is required for the user that runs this script.

You will need to port-forward port 80 and port 443 in order to access the website from outside the local network.

First of all you will need to change the permissions to executable for the deploy_customer.sh using:

```chmod +x deploy_customer.sh```

Now you are ready to run the deploy_customer.sh using:

```./deploy_customer.sh```

Firstly **unzip** will be installed if not already existing on your machine.

If there exist a yotei folder it will be removed before unzipping the new **yotei.zip**.

The required **docker** dependencies will be downloaded if they do not exist on your machine.

You will be asked if you currently have an older version deployed on your machine. If that is the case you will also be asked if you would like to reset the database or keep the current one. If you are deploying a new version of Yotei you should reset the database in order to match any required changes to the database.

You will be asked if you intend to use a domain. If the answer is yes, provide the correct domain. Otherwise it will build locally and run on http if port 80 is forwarded.

If you chose to use a domain, https-certification will be provided using certbot, requiring that port 443 is forwarded. You will therefore be asked if you would like to set up a cronjob for renewal of the certificate. If the answer is yes renewal of the https-certificate will run every month.





