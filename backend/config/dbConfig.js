const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST_IP || "127.0.0.1",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  debug: false,
  insecureAuth: true,
});
module.exports = connection;
