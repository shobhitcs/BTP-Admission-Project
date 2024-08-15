var { createTable, insertManyIntoTable } = require("./sqlqueries.js");
var { usersSchema } = require("../schemas/usersSchema.js"); // Assuming you have a file for the users schema
var mysql = require("mysql2");

/*
    Name: initializeUsersTable
    Input: database name
    Output: void
    Functionality: creates the users table in the specified database.
*/

async function checkTableExists(connection, tableName) {
  try {
    const [rows] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);
    return rows.length > 0;
  } catch (error) {
    throw error;
  }
}

async function initializeUsersTable(databaseName, userData) {
  var con = mysql
    .createPool({
      // host: process.env.MYSQL_HOSTNAME,
      host: process.env.MYSQL_HOST_IP || "127.0.0.1",
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      debug: false,
      insecureAuth: true,
    })
    .promise();
  // console.log(usersSchema);

  try {
    const tableExists = await checkTableExists(con, "users");
    if (tableExists) {
      // console.log("Users table already exists.");
      return; // Exit the function if the table exists
    }

    await createTable(con, "users", usersSchema);
    await insertManyIntoTable(
      con,
      "users",
      `(id,username, password, branch, isAdmin)`,
      userData
    );
    console.log("Users table initialized successfully.");
    // Fetch data from the "users" table
    const [rows] = await con.query("SELECT * FROM users");
    // console.log("Data in the 'users' table:", rows);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { initializeUsersTable };
