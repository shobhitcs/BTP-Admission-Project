# Use the official Node.js image as a base
FROM node:18.3.0-alpine as build-stage

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

RUN npm install npm@10.7.0 --legacy-peer-deps

# If you are building your code for production
RUN npm ci --only=production

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 4444

# Command to run your app
CMD ["npm", "start" ]