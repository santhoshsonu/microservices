# Base Image
FROM node:alpine

ENV CI=true

# Working Directory
WORKDIR /app

# Install dependencies
# Minimize rebuilds and cache busting
COPY ./package.json ./
RUN npm install

COPY ./ ./

# Add command
CMD ["npm", "start"]