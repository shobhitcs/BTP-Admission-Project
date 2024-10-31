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

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }

  console.log("Connected to the database");

  // Uncomment the following blocks for testing specific tables

  // Test fetching all rows from the users table
  // connection.query("SELECT * FROM users", (err, rows) => {
  //   if (err) {
  //     console.error("Error querying the users table:", err);
  //     return;
  //   }
  //   console.log("Fetched rows from users:", rows);
  // });

  // Test fetching all rows from the seatMatrix table
  // connection.query("SELECT * FROM seatMatrix", (err, rows) => {
  //   if (err) {
  //     console.error("Error querying the seatMatrix table:", err);
  //     return;
  //   }
  //   // console.log("Fetched rows from seatMatrix:", rows);
  // });

  // Test fetching all rows from the applicationstatus table
  // connection.query("SELECT * FROM applicationstatus", (err, rows) => {
  //   if (err) {
  //     console.error("Error querying the applicationstatus table:", err);
  //     return;
  //   }
  //   console.log("Fetched rows from applicationstatus:", rows);
  // });

  // Test fetching all rows from the branches table
  // connection.query("SELECT * FROM branches", (err, rows) => {
  //   if (err) {
  //     console.error("Error querying the branches table:", err);
  //     return;
  //   }
  //   console.log("Fetched rows from branches:", rows);
  // });

});

// Export the connection object
module.exports = connection;
