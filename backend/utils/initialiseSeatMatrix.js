var { createTable, insertManyIntoTable } = require("./sqlqueries.js");
var { seatMatrixSchema } = require("../schemas/seatMatrixSchema.js");
var mysql = require("mysql2");
const sqlQueries = require("./sqlqueries.js");

/*
    Name: initialiseSeatMatrix
    Input : branch name, seat alloted data
    Output: void
    Functionality: Initializes seat matrix table.
*/
async function initialiseSeatMatrix(branch, seatAllotedData) {
  try {
    // Creating a Connection
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

    // Define table name
    const tableName = `seatMatrix`;

    // Check if the table exists
    var tableExists = await sqlQueries.checkTableExists(con, tableName);
    // console.log("seat matrix for tableexists: ", tableExists);

    // If table does not exist, create it with additional 'branch' column
    if (!tableExists) {
      var createTableStatus = await createTable(
        con,
        tableName,
        seatMatrixSchema
      );
    }

    // Inserting data into the seat matrix table
    const insertedTableStatus = await insertManyIntoTable(
      con,
      tableName,
      `(category, seatsAllocated, branch)`,
      seatAllotedData.map((row) => [...row, branch])
    );

    // console.log(`Seat matrix table ${tableName} initialized successfully`);
  } catch (error) {
    console.error("Error:", error);
    // Handle errors appropriately
  }
}

module.exports = { initialiseSeatMatrix };
