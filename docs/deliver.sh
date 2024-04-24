#! /usr/bin/bash

# Delivery script. Run this and then deliver the created files to the customer.
# @authors: Erik Nyström (ie15enm@cs.umu.se)
#           Jakob Jerkerius (c20jjs@cs.umu.se)

# Clone all the git repos
apt install zip -y &> /dev/null
echo "Cloning necessary git repositories"
git clone git@git.cs.umu.se:courses-project/5dv214vt23/infra.git
git clone git@git.cs.umu.se:courses-project/5dv214vt23/frontend.git
git clone git@git.cs.umu.se:courses-project/5dv214vt23/backend.git
git clone git@git.cs.umu.se:courses-project/5dv214vt23/docs.git

chmod -R 777 infra
cp infra/deploy.sh infra/deploy.md .
zip -r budo.zip frontend/ backend/ infra/ docs/ 

rm -rf frontend backend infra docs
