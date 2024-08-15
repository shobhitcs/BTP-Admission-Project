var { createTable, insertManyIntoTable } = require("./sqlqueries.js");
var { usersSchema } = require("../schemas/usersSchema.js"); // Assuming you have a file for the users schema
var { branchSchema } = require("../schemas/branchesSchema.js");
var mysql = require("mysql2");

/*
    Name: initializeBranchTable
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

async function initializeBranchTable(databaseName, branchData) {
  // console.log("pass: ", process.env.MYSQL_PASSWORD);
  // console.log("host: ", process.env.MYSQL_HOSTNAME);
  // console.log("database: ", process.env.MYSQL_DATABASE);
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
  // Check if the connection is valid by executing a test query
  const som = await con.query("SHOW TABLES");
  // console.log("Connection established successfully.");
  // console.log("som: ", som);

  try {
    const tableExists = await checkTableExists(con, "branches");
    if (tableExists) {
      // console.log("Branches table already exists.");
      return; // Exit the function if the table exists
    }

    await createTable(con, "branches", branchSchema);
    // console.log(branchData);
    await insertManyIntoTable(con, "branches", `(branch)`, branchData);
    // console.log("Branches table initialized successfully.");
  } catch (error) {
    console.log(error);
  }
}

module.exports = { initializeBranchTable };
