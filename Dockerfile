# pull official base image
FROM node:alpine

# set working directory
WORKDIR /

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
ENV PORT 3000

# install app dependencies
COPY package*.json .
# COPY package-lock.json ./
RUN npm install --silent
RUN npm install -g serve

# add app
COPY . ./

RUN npm run build

# exposes 3000 to the outside
EXPOSE 3000

# start app, remember to run "npm run build" before!
CMD ["serve", "-s", "build"]
