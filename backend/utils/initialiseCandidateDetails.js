var XLSX = require("xlsx");
var sqlQueries = require("./sqlqueries");
var applicantsSchema = require("../schemas/applicantsSchema").applicantsSchema;
var applicantsSchemaColumnNames =
  require("../schemas/applicantsSchema").applicantsSchemaColumnNames;
var mysql = require("mysql2");

const tempDate = new Date();
let tempYear = tempDate.getFullYear();
const currYear = tempYear - 2000;
const prevYear = currYear - 1;
const prevprevYear = currYear - 2;

/*
    Name: enterCandidateDetailsToDatabase
    Input : modified columnnames file path,databasename
    output: void
    Functionality :inserts all the candidate details into the mtechappl table.
*/
// Previous code


// async function enterCandidateDetailsToDatabase(branch, filePath, databaseName) {
//   //Creating a Connection
//   var con = mysql
//     .createPool({
//       // host: process.env.MYSQL_HOSTNAME,
//       host: process.env.MYSQL_HOST_IP || "127.0.0.1",
//       user: "root",
//       password: process.env.MYSQL_PASSWORD,
//       database: process.env.MYSQL_DATABASE,
//       debug: false,
//       insecureAuth: true,
//     })
//     .promise();

//   // Check if the table exists
//   var tableExists = await sqlQueries.checkTableExists(con, "mtechappl");
//   // console.log("table exists hai ki nahi?", tableExists);

//   if (!tableExists) {
//     // Table does not exist, create it with the schema and add the 'branch' column
//     var createTableRes = await sqlQueries.createTable(
//       con,
//       "mtechappl",
//       applicantsSchema
//     );
//     // console.log("Created mtechappl table with branch column.");
//   }

//   /*
//     Opening the workbook and converting each row into JSON object with column name as key
//   */
//   var workbook = XLSX.readFile(filePath);
//   var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
//   var applicantsData = XLSX.utils.sheet_to_json(applicantsDataSheet);
//   /*
//     Creating the values array which will be used to query(insert in) the database
//   */
//   var valuesToBeInserted = [];
//   for (var applicant of applicantsData) {
//     var applicantAttributes = [];
//     for (var columnName of applicantsSchemaColumnNames) {
//       //calculating max gate score
//       if (columnName == "MaxGateScore") {
//         var currYearScore = -1;
//         var prevYearScore = -1;
//         var prevPrevYearScore = -1;
//         if (applicant["GATE" + currYear + "Score"] != null)
//           currYearScore = applicant["GATE" + currYear + "Score"];
//         if (applicant["GATE" + prevYear + "Score"] != null)
//           prevYearScore = applicant["GATE" + prevYear + "Score"];
//         if (applicant["GATE" + prevprevYear + "Score"] != null)
//           prevPrevYearScore = applicant["GATE" + prevprevYear + "Score"];
//         var maxScore = Math.max(
//           currYearScore,
//           Math.max(prevPrevYearScore, prevYearScore)
//         );
//         applicantAttributes.push(maxScore);
//       } else if (columnName === "GateRegNum") {
//         var gateRegNum = "";
//         if (
//           currYearScore > prevYearScore &&
//           currYearScore > prevPrevYearScore
//         ) {
//           gateRegNum = applicant["GATE" + currYear + "RollNo"];
//         } else if (prevYearScore > prevPrevYearScore) {
//           gateRegNum = applicant["GATE" + prevYear + "RollNo"];
//         } else {
//           gateRegNum = applicant["GATE" + prevprevYear + "RollNo"];
//         }
//         applicantAttributes.push(gateRegNum);
//       } else if (columnName == "branch") {
//         applicantAttributes.push(branch);
//       }
//       //calculating virtual cgpa
//       else if (columnName === "DegreeCGPA8thSem") {
//         if (applicant["DegreeCGPA8thSem"] == null) {
//           if (applicant["DegreePer8thSem"] != null) {
//             applicant["DegreeCGPA8thSem"] = applicant["DegreePer8thSem"] / 10;
//           }
//         }
//         applicantAttributes.push(applicant[columnName]);
//       } else if (columnName === "currYearRollNo") {
//         applicantAttributes.push(applicant["GATE" + currYear + "RollNo"]);
//       } else if (columnName === "currYearRank") {
//         applicantAttributes.push(applicant["GATE" + currYear + "Rank"]);
//       } else if (columnName === "currYearScore") {
//         applicantAttributes.push(applicant["GATE" + currYear + "Score"]);
//       } else if (columnName === "currYearDisc") {
//         applicantAttributes.push(applicant["GATE" + currYear + "Disc"]);
//       } else if (columnName === "prevYearRollNo") {
//         applicantAttributes.push(applicant["GATE" + prevYear + "RollNo"]);
//       } else if (columnName === "prevYearRank") {
//         applicantAttributes.push(applicant["GATE" + prevYear + "Rank"]);
//       } else if (columnName === "prevYearScore") {
//         applicantAttributes.push(applicant["GATE" + prevYear + "Score"]);
//       } else if (columnName === "prevYearDisc") {
//         applicantAttributes.push(applicant["GATE" + prevYear + "Disc"]);
//       } else if (columnName === "prevprevYearRollNo") {
//         applicantAttributes.push(applicant["GATE" + prevprevYear + "RollNo"]);
//       } else if (columnName === "prevprevYearRank") {
//         applicantAttributes.push(applicant["GATE" + prevprevYear + "Rank"]);
//       } else if (columnName === "prevprevYearScore") {
//         applicantAttributes.push(applicant["GATE" + prevprevYear + "Score"]);
//       } else if (columnName === "prevprevYearDisc") {
//         applicantAttributes.push(applicant["GATE" + prevprevYear + "Disc"]);
//       } else {
//         if (applicant[columnName] !== undefined) {
//           applicantAttributes.push(applicant[columnName]);
//           //console.log(columnName, applicant[columnName]);
//         } else {
//           applicantAttributes.push(null); // Push null if column value is not present
//         }
//       }
//     }
//     valuesToBeInserted.push(applicantAttributes);
//     //console.log(valuesToBeInserted);
//   }
async function enterCandidateDetailsToDatabase(branch, filePath, databaseName) {
  //Creating a Connection
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

  // Check if the table exists
  var tableExists = await sqlQueries.checkTableExists(con, "mtechappl");
  // console.log("table exists hai ki nahi?", tableExists);

  if (!tableExists) {
    // Table does not exist, create it with the schema and add the 'branch' column
    var createTableRes = await sqlQueries.createTable(
      con,
      "mtechappl",
      applicantsSchema
    );
    // console.log("Created mtechappl table with branch column.");
  }

  /*
    Opening the workbook and converting each row into JSON object with column name as key
  */
  var workbook = XLSX.readFile(filePath);
  var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
  var applicantsData = XLSX.utils.sheet_to_json(applicantsDataSheet);
  /*
    Creating the values array which will be used to query(insert in) the database
  */
  applicantsSchemaColumnNames.push("OtherDetails");
  // console.log("data", applicantsData[0]);
  // console.log("data", applicantsData[1]);
  var valuesToBeInserted = [];
  for (var applicant of applicantsData) {
    var applicantAttributes = [];
    for (var columnName of applicantsSchemaColumnNames) {
      //calculating max gate score
      if (columnName == "MaxGateScore") {
        if (applicant["MaxGateScore"] != null && applicant["MaxGateScore"] != '') {
          applicantAttributes.push(applicant["MaxGateScore"]);
        }
        else {
          var currYearScore = -1;
          var prevYearScore = -1;
          var prevPrevYearScore = -1;
          if (applicant["currYearScore"] != null && applicant["currYearScore"] != '')
            currYearScore = applicant["currYearScore"];
          if (applicant["prevYearScore"] != null && applicant["prevYearScore"] != '')
            prevYearScore = applicant["prevYearScore"];
          if (applicant["prevprevYearScore"] != null && applicant["prevprevYearScore"] != '')
            prevPrevYearScore = applicant["prevprevYearScore"];
          var maxScore = Math.max(
            currYearScore,
            Math.max(prevPrevYearScore, prevYearScore)
          );
          applicantAttributes.push(maxScore);
        }
      } else if (columnName === "GateRegNum") {
        var gateRegNum = "";
        var currYearScore = -1;
        var prevYearScore = -1;
        var prevPrevYearScore = -1;
        if (applicant["currYearScore"] != null && applicant["currYearScore"] != '')
          currYearScore = applicant["currYearScore"];
        if (applicant["prevYearScore"] != null && applicant["prevYearScore"] != '')
          prevYearScore = applicant["prevYearScore"];
        if (applicant["prevprevYearScore"] != null && applicant["prevprevYearScore"] != '')
          prevPrevYearScore = applicant["prevprevYearScore"];
        // console.log(currYearScore, prevYearScore, prevPrevYearScore, "scores");
        if (
          currYearScore > prevYearScore &&
          currYearScore > prevPrevYearScore
        ) {
          gateRegNum = applicant["currYearRollNo"];
        } else if (prevYearScore > prevPrevYearScore) {
          gateRegNum = applicant["prevYearRollNo"];
        } else {
          gateRegNum = applicant["prevprevYearRollNo"];
        }
        applicantAttributes.push(gateRegNum);
      } else if (columnName == "branch") {
        applicantAttributes.push(branch);
      }
      //calculating virtual cgpa
      else if (columnName === "DegreeCGPA8thSem") {
        if (applicant["DegreeCGPA8thSem"] == null || applicant["DegreeCGPA8thSem"] == '') {
          if (applicant["DegreePer8thSem"] != null && !applicant["DegreePer8thSem"] != '') {
            applicant["DegreeCGPA8thSem"] = applicant["DegreePer8thSem"] / 10;
          }
          else {
            applicant["DegreeCGPA8thSem"] = null;
          }
        }
        else {
          applicant["DegreeCGPA8thSem"] = null;
        }
        applicantAttributes.push(applicant[columnName]);
      } else if (columnName === "currYearRollNo") {
        applicantAttributes.push(applicant["currYearRollNo"]);
        // } else if (columnName === "currYearRank") {
        //   applicantAttributes.push(applicant["currYearRank"]);
      } else if (columnName === "currYearScore") {
        applicant["currYearScore"] = applicant["currYearScore"] === '' ? null : applicant["currYearScore"];
        applicantAttributes.push(applicant["currYearScore"]);
        // } else if (columnName === "currYearDisc") {
        //   applicantAttributes.push(applicant["GATE" + currYear + "Disc"]);
      } else if (columnName === "prevYearRollNo") {
        applicantAttributes.push(applicant["prevYearRollNo"]);
        // } else if (columnName === "prevYearRank") {
        //   applicantAttributes.push(applicant["prevYearRank"]);
      } else if (columnName === "prevYearScore") {
        applicant["prevYearScore"] = applicant["prevYearScore"] === '' ? null : applicant["prevYearScore"];
        applicantAttributes.push(applicant["prevYearScore"]);
        // } else if (columnName === "prevYearDisc") {
        //   applicantAttributes.push(applicant["GATE" + prevYear + "Disc"]);
      } else if (columnName === "prevprevYearRollNo") {
        applicantAttributes.push(applicant["prevprevYearRollNo"]);
        // } else if (columnName === "prevprevYearRank") {
        //   applicantAttributes.push(applicant["prevprevYearRank"]);
      } else if (columnName === "prevprevYearScore") {
        applicant["prevprevYearScore"] = applicant["prevprevYearScore"] === '' ? null : applicant["prevprevYearScore"];
        applicantAttributes.push(applicant["prevprevYearScore"]);
        // } else if (columnName === "prevprevYearDisc") {
        //   applicantAttributes.push(applicant["GATE" + prevprevYear + "Disc"]);
      } else if (columnName === "COAP") {
        applicantAttributes.push(applicant["COAP"]);
      } else if (columnName === "AppNo") {
        applicantAttributes.push(applicant["AppNo"]);
      } else if (columnName === "Email") {
        applicantAttributes.push(applicant["Email"]);
      } else if (columnName === "FullName") {
        applicantAttributes.push(applicant["FullName"]);
      } else if (columnName === "Pwd") {
        applicantAttributes.push(applicant["Pwd"]);
      } else if (columnName === "Ews") {
        applicantAttributes.push(applicant["Ews"]);
      } else if (columnName === "Gender") {
        applicantAttributes.push(applicant["Gender"]);
      } else if (columnName === "Category") {
        applicantAttributes.push(applicant["Category"]);
      } else if (columnName === "HSSCper") {
        applicant["HSSCper"] = applicant["HSSCper"] === '' ? null : applicant["HSSCper"];
        applicantAttributes.push(applicant["HSSCper"]);
      } else if (columnName === "SSCper") {
        applicant["SSCper"] = applicant["SSCper"] === '' ? null : applicant["SSCper"];
        applicantAttributes.push(applicant["SSCper"]);
      } else if (columnName === "Adm") {
        applicantAttributes.push(applicant["Adm"]);
      } else if (columnName === "OtherDetails") {
        applicantAttributes.push(applicant["OtherDetails"]);
      }

      // else {
      //   if (applicant[columnName] !== undefined  ) {
      //     applicantAttributes.push(applicant[columnName]);
      //     //console.log(columnName, applicant[columnName]);
      //   } else {
      //     applicantAttributes.push(null); // Push null if column value is not present
      //   }
      // }
    }
    valuesToBeInserted.push(applicantAttributes);
  }
  // console.log("datafienla", valuesToBeInserted[0]);

  /*
    creating a string of comma seperated column names
  */
  // var columnNames = "(";
  // for (var columnName of applicantsSchemaColumnNames) {
  //   columnNames += columnName + ",";
  // }
  // columnNames = columnNames.slice(0, -1);
  // columnNames += ")";

  var columnNames = "(" + applicantsSchemaColumnNames.join(",") + ")";
  // console.log("the console column names is: ", columnNames);
  /*
    inserting into database
  */
  // console.log("5");
  // console.log(
  //   "Number of columns in schema:",
  //   applicantsSchemaColumnNames.length
  // );
  // console.log("Number of values to be inserted:", valuesToBeInserted[0].length);

  var insertIntoTableRes = await sqlQueries.insertManyIntoTable(
    con,
    "mtechappl",
    columnNames,
    valuesToBeInserted
  );
  // console.log("Inserted candidate details into mtechappl table.");

  return;
}

module.exports = { enterCandidateDetailsToDatabase };
