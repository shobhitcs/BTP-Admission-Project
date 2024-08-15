# Get the base image
FROM node:18.3.0-alpine as build-stage

# Maintainer of the file
LABEL author="Kanishk Chugh <kanishkchugh1@gmail.com>"

# Set working directory
WORKDIR /usr/src/app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy project files to /usr/src/app/
COPY . .

RUN npm install npm@10.7.0 --legacy-peer-deps

# Install dependencies
RUN npm install --legacy-peer-deps

# Get the production files ready
RUN npm run build --silent

# Get the base image
FROM node:18.3.0-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy production files from build-stage
COPY --from=build-stage /usr/src/app/build/ /usr/src/app/build

# Install serve package
RUN npm install -g serve

# Expose port 8004
EXPOSE 8004

# Start app
CMD serve -s /usr/src/app/build -l 8004
