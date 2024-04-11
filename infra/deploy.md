# Deploy the application

This file desribes how set up hosting (remotely or locally) for the UBK trainer application. 

## Prerequisites

### From zip
To set up the application using the *budo.zip* file you need:
- A bash-shell
- The zip-file *budo.zip*
- The shell-script *deploy.sh*

### With cloned directories
To  set up the application using cloned directories you need:
- One parent directory containing the [backend](https://git.cs.umu.se/courses-project/5dv214vt23/backend/), [frontend](https://git.cs.umu.se/courses-project/5dv214vt23/frontend/), and
[infrastructure](https://git.cs.umu.se/courses-project/5dv214vt23/infra/) repositories.


## How to

### From zip

Place yourself in a directory containing *budo.zip* and *deploy.sh* and run:

    sudo ./deploy.sh

Enter your password and follow the instructions in the script.

### With cloned directories
Place yourself in the *infra/* directory and run the same command as in "remote".

## The script

The script will install the programs that are needed to deploy the website. This means that it can be run on a server with no programs pre-installed. 

If the user has a domain name the script will guide the user through installation of the TSL-certificates. 

After everything is installed, the script will build and start the docker containers.

Common problems the script solves:
- Postgres installation blocking ports
    - Solved by killing any postgres processes
- No persmission to modify files
    - Solved with chmod 777 on all directories and files
- Docker installation crashing because of internal dpkg error
    - Solved by running the docker installation twice
- Modifying config files
    - Solved by prompting the user and using sed to modify the correct lines

