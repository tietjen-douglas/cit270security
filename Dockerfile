# This is the base image we are inheriting from
FROM node

# Start in this directory
WORKDIR /app

# Copying this first so their is not a conflict with the node_modules directory
COPY package.json ./

RUN npm install

COPY . ./

# Last command to start the container/server
CMD npm start
