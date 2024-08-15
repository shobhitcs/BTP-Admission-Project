var XLSX = require("xlsx");
var mysql = require("mysql2");
const { selectQuery } = require("./sqlqueries");

async function updateDecision(
  con,
  applicant,
  round,
  coapIdColumnName,
  candidateDecisonColumnName,
  branch
) {
  currCOAP = applicant[coapIdColumnName];
  currDecision = applicant[candidateDecisonColumnName];
  // console.log("Current Decision:", currDecision);
  // console.log("Current COAP:", currCOAP);
  // console.log(currCOAP, currDecision);
  try {
    // Check previous status
    var [checkPreviousStatus] = await con.query(
      `SELECT OfferedRound, RetainRound, RejectOrAcceptRound FROM applicationstatus WHERE 
        COAP = ? AND branch = ?;`,
      [currCOAP, branch]
    );
    // console.log("Previous status:", checkPreviousStatus);
    bool_previousRetain = checkPreviousStatus[0].RetainRound != ""; // Check if previously retained
    bool_previousRejectOrAccept =
      checkPreviousStatus[0].RejectOrAcceptRound != ""; // Check if previously rejected or accepted
    if (currDecision == "Reject and Wait") {
      if (!bool_previousRejectOrAccept) {
        // Update the status to rejected('N')
        try {
          var [updatedStatus] = await con.query(
            `UPDATE applicationstatus
                        SET Accepted = 'N', RejectOrAcceptRound = ?
                        WHERE COAP = ? AND branch = ?;`,
            [round, currCOAP, branch]
          );
        } catch (error) {
          throw error;
        }
      }
    } else if (currDecision == "Retain and Wait") {
      if (!bool_previousRetain) {
        try {
          // Update the status to retain('R')
          var [updatedStatus] = await con.query(
            `UPDATE applicationstatus
                        SET Accepted = 'R', retainRound = ?
                        WHERE COAP = ? AND branch = ?;`,
            [round, currCOAP, branch]
          );
        } catch (error) {
          throw error;
        }
      }
    } else if (currDecision == "Accept and Freeze") {
      if (!bool_previousRejectOrAccept) {
        try {
          // Update the status to accept('Y')
          var [updatedStatus] = await con.query(
            `UPDATE applicationstatus
                        SET Accepted = 'Y', RejectOrAcceptRound = ?
                        WHERE COAP = ? AND branch = ?;`,
            [round, currCOAP, branch]
          );
        } catch (error) {
          throw error;
        }
      }
    }
  } catch (error) {
    throw error;
  }
  // console.log(`Updated candidate Decision ${currCOAP}`);
}

async function updateStatusIITGList(
  databaseName,
  filePath,
  round,
  coapIdColumnName,
  candidateDecisonColumnName,
  branch
) {
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
  var workbook = XLSX.readFile(filePath);
  var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
  var applicantsData = XLSX.utils.sheet_to_json(applicantsDataSheet);
  for (const applicant of applicantsData) {
    try {
      // console.log(
      //   "par jab mein idhar aagaya hun upload karne toh, branch to esa hai na: ",
      //   branch
      // );
      // console.log(
      //   "aur ye bhi dekhlo applicant[coapIdColumnName]: ",
      //   applicant[coapIdColumnName]
      // );
      var [isCS] = await con.query(
        `SELECT COUNT(*) AS count FROM applicationstatus WHERE 
            COAP = ? AND branch = ?;`,
        [applicant[coapIdColumnName], branch]
      );
      if (isCS[0].count == 1) {
        try {
          await updateDecision(
            con,
            applicant,
            round,
            coapIdColumnName,
            candidateDecisonColumnName,
            branch
          );
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { updateStatusIITGList };
