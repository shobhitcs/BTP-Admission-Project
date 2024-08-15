const mysql = require("mysql2");
const { createTable } = require("./sqlqueries.js");
const { applicantsStatusSchema } = require("../schemas/applicantsStatus.js");
const sqlQueries = require("./sqlqueries.js");

async function initializeApplicantsStatus(branch, databaseName) {
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
    const tableName = "applicationstatus";

    // Check if the table exists
    const tableExists = await sqlQueries.checkTableExists(con, tableName);
    if (!tableExists) {
      const schema = applicantsStatusSchema(branch);
      // console.log("Creating table with schema:", schema);
      const createTableResult = await createTable(con, tableName, schema);
    }

    // console.log(
    //   `Applicants status table '${tableName}' initialized successfully`
    // );
  } catch (error) {
    console.error("Error:", error);
    // Handle errors appropriately
  }
}

module.exports = { initializeApplicantsStatus };
