var mysql = require("mysql2");
/* 
    function Name:createDataBase
    input :connection to database,Name of the datbase to be created.
    output result if succeeds else error
*/
async function createDataBase(connection, databaseName) {
  var queryString = "CREATE DATABASE IF NOT EXISTS" + " " + databaseName;
  var res = await connection.query(queryString, function (err, result) {
    if (err) throw err;
    console.log("Database created with name " + databaseName);
    return result;
  });
  return res;
}
/* 
    function Name:connectToDatabase
    input :name of the database to be connected to.
    output: connection object
*/
async function connectToDatabase(databaseName) {
  var con = mysql.createConnection({
    host: process.env.MYSQL_HOSTNAME,
    user: "root",
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  console.log("pass: ", process.env.MYSQL_PASSWORD);
  console.log("host: ", process.env.MYSQL_HOSTNAME);
  console.log("database: ", process.env.MYSQL_DATABASE);
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
  });
  return con;
}
/* 
    function Name:createTable
    input :connection object,Name of the table,schema enclosed in brackets
    output: success if it creates table else error
*/
async function createTable(connection, tableName, tableSchema) {
  var queryString = `CREATE TABLE IF NOT EXISTS ${tableName} ${tableSchema}`;
  try {
    var res = await connection.query(queryString);
  } catch (error) {
    throw error;
  }
  console.log(`Table with name ${tableName} created`);
  return res;
}
/* 
    function Name:insertManyIntoTable
    input :connection object,Name of the table,schema/column names enclosed in brackets,values that are to inserted in a 2d array
    output: success if it inserts into table else error
*/
async function insertManyIntoTable(
  connection,
  tableName,
  columnNames,
  toBeInsertedValues
) {
  var queryString = `INSERT INTO ${tableName} ${columnNames} VALUES ?`;
  try {
    var res = await connection.query(queryString, [toBeInsertedValues]);
  } catch (error) {
    throw error;
  }

  return res;
}
/* 
    function Name:selectQuery
    input :connection object,query that is to be queried
    output: result if succeeds else error
*/
const selectQuery = function (con, queryString) {
  return new Promise((resolve, reject) => {
    con.query(queryString, function (err, result, fields) {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

/* 
    function Name: checkTableExists
    input: connection object, Name of the table
    output: true if the table exists, false otherwise
*/

async function checkTableExists(connection, tableName) {
  var queryString = `SHOW TABLES LIKE '${tableName}'`;
  console.log(queryString);
  try {
    var [res] = await connection.query(queryString);
    return res.length > 0;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createDataBase,
  connectToDatabase,
  createDataBase,
  insertManyIntoTable,
  createTable,
  selectQuery,
  checkTableExists,
};
