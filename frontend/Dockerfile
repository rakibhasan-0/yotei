# Build app 
FROM node:20-alpine AS BASE_IMAGE

# Store the app in /usr/src/app
RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app

ENV PORT 3000

# Install dependencies
COPY package*.json ./
RUN npm install --silent

# Build with vite
COPY . ./
RUN npm run build

# Build production image
FROM node:20-alpine
WORKDIR /usr/src/app

RUN npm install -g serve

# Only copy the built app
COPY --from=BASE_IMAGE /usr/src/app/build ./build

# Run it on port 3000
EXPOSE 3000

# start app, remember to run "npm run build" before!
CMD ["serve", "-s", "build"]
