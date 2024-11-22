# Automated Mtech Offers generator

## The Problem Statement

For admission to M.Tech programs in most IITs/IISC, students must sit for national-level exams like GATE in which the online admission process is held through an entity known as COAP (Common Offer Acceptance Portal). It is a centralized counseling procedure for admission in PG Engineering courses in all participating IITs and IISC Institutes affiliated with it.
The process starts with COAP sending all the student registration information to the institutes which is then filtered and sorted by the institute’s office staff. Based on it, Offer Letters are generated separately for each branch. This data is then sent back to the COAP which then takes input from the students through their website and resends the updated status data back to the institutes. This process is repeated as further rounds are held.
This data give and take from COAP to institutes and vice-versa demands a lot of time and manual work from the institute's office workforce and the saturation of data increases with every round as also the escalating probability of error during the segregation of data as there will be multiple files generation during the process.

testing
## Objective

Our goal is to save time and effort by automating this Data organizing process, by creating an automated tool that will take Excel files as inputs from the front end and then send the data to the server in the backend for processing and storing the data in a centralized Database.

# Installation Steps

## How to run using Docker?

### `Install Docker`

Follow the steps in the below website to install docker engine or any youtube video to install docker.
`https://docs.docker.com/engine/install/`

### `Git Clone`

Make sure You have Git installed on your system.If you have Git installed you can use Use `git clone https://github.com/NOEL0707/MtechOffersGenerator.git ` to clone this repository.If you don't have git you can download the zip folder from the code button.

### `docker compose up --build`

Use this command if you want to recompile/rebuild the image.
To run this command Make sure you are in the same directory in which `docker-compose.yaml` is present.
This command will spawn the frontend container at localhost:3000,Backend container at localhost:4444 and a mysql database.
Open [http://localhost:3000](http://localhost:3000) to view the site.

### `docker compose up`

To run this command Make sure you are in the same directory in which `docker-compose.yaml` is present.
This command will spawn the frontend container at localhost:3000,Backend container at localhost:4444 and a mysql database.

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `docker compose down`

This command will remove the spawned containers.

### `docker compose down -v`

This command will remove the spawned containers as well as the data/volumes associated with it.

### `Environment variables`

Create a .env file inside the "backend" folder and add given code with corresponding details :
<br>
<br>
MYSQL_DATABASE: applicants2023 <br>
MYSQL_PASSWORD: your_Sql_password<br>
MYSQL_ROOT_PASSWORD: your_Sql_password<br>
MYSQL_HOSTNAME: localhost<br>
MYSQL_USER: root<br>
JWT_SECRET: mySecretKey123<br>
COOKIE_SECRET: mysecretcookiekey<br>
ADMIN_USER: admin<br>
ADMIN_PASSWORD: admin@123<br>
userFilePath: files<br>
MYSQL_HOST_IP: <your_ip_address><br>
BACKEND_URL: http://<your_ip_address>

Create a .env file inside the "frontend" folder and given code with corresponding details :
<br>
<br>
REACT_APP_BACKEND_URL=http://<your_ip_address>:4444

Ensure that the port specified is not being used by other instances, and verify that the port number is correct.
