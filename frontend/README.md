#Installation Steps

## How to run in your local system?

### `Git Clone`
Use git clone command to clone this repository.

### `npm install`
This command will install all the dependencies

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `Connecting to the server`
Inside the src folder inside the serverLink.js file make sure you keep the below line if you are running your backend code/image on 'abcd' port: 
export const serverLink="http://localhost:abcd"

## How to run using docker image?

### `Git Clone`
Use git clone command to clone this repository.


### `docker compose up`
This command will spawn the container at localhost:3000.
Make sure you are in the same directory in which dockerfile is present.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `docker compose down`
This command will remove the spawned containers.
