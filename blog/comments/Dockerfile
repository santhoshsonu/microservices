# Base Image
FROM node:alpine

# Working Directory
WORKDIR /usr/app

# Install dependencies
# Minimize rebuilds and cache busting
COPY ./package.json ./
RUN npm install

COPY ./ ./

# Add command
CMD ["npm", "start"]