# BTP-BackEnd


## important steps before installing or creating docker image

### ` Files Folder`
Create a folder named 'files' and in  that folder create two other folders named `generatedOffers` and `roundUpdates`.

### `.env file`
Create a file named .env in root folder and define variables accordingly as mentioned in the installation steps.
MYSQL_PASSWORD=<string:Password of the database created in local>
MYSQL_DATABASENAME='Applicants2019'
MYSQL_HOSTNAME='localhost' or '127.0.0.1'  

## How to run in your local system?

### `install node V:18.3.0`
install node following any docs

### `Git Clone`
Use git clone command to clone this repository.

### `npm install`
This command will install all the dependencies

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:4444](http://localhost:4444) to view it in your browser.Define three variables and values accordingly as shown below:

### `Connecting to the database`
Inside the .env file the variables need to be filled as described below
MYSQL_PASSWORD=<string:Password of the database created in local>
MYSQL_DATABASENAME='Applicants2019'
MYSQL_HOSTNAME='localhost' or '127.0.0.1'
Make sure you create a database named 'Applicants2019' as the root user.

## How to run using docker?

### `Git Clone`
Use git clone command to clone this repository.

### `docker compose up`
This command will spawn two containers one containing the backend server and the other containing the database.
Make sure you are in the same directory in which dockerfile is present.

### `docker compose down`
This command will remove the spawned containers.
