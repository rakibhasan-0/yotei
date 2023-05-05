# System Administration

## **Before running installation-script**
This guide assumes the site will be hosted on an Ubuntu server with the APT package manager.
The server can be *clean*, i.e just containing a base installation of Ubuntu server with no dependencies, 
everything neded *should* be installed by the script.
The script has been tested on a live Ubuntu 22.04 server, as well as a clean Ubuntu 22.04 server VM with nothing but the base image installed.
Running this script will reinstall any existing docker installations.

### **Script walkthrough**
The script starts off by removing any docker installation before installing the necessary dependencies needed for the frontend and docker installation.
Tne script the uses the official docker installation script to install all the docker packages. This script need to run twice, and will take some time.
The user will be prompted and asked if they want to cancel the installation since docker is already installed, this should be **ignored**, just wait for the 20 second timer to finnish. When the installations are done, the script unzips the package and starts hosting the application. Used in a server environment the website should now be hosted and usable at the ip of the server.

### **Dependencies**
List of dependencies used by the installation-script.
- **ca-certificates** 
    - Used for verification with the docker server.
- **curl** 
    - Used to fetch the docker installation script.
- **gnupg**
    - Used to verify the docker installation.
- **nodejs/npm**
    - Used to host, run and install dependencies in frontend.
- **zip**
    - Used to unzip the application files.
- **docker**
    - Dependencies installed by the docker installation script. Used to containerise the application.

## **Running installation-script**
Open a terminal, navigate to a folder containing budo.zip and the installation script. Run:

    sudo ./install.sh

The website should now be functional.

***
## **Manual installation**
### **Linux**
Lorem ipsum

#### **Problems/Solutions**
Lorem ipsum


***
### **Windows**
Lorem ipsum

#### **Problems/Solutions**
Lorem ipsum


***

### **MacOS**
Lorem ipsum

#### **Problems/Solutions**
Lorem ipsum