const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");

async function resetRoundFunction(inputRoundNumber, branch) {
  const roundNumber = inputRoundNumber;
  const userBranchPath = path.join(__dirname, "..", "files", branch);
  const roundUpdatesDirectory = path.join(userBranchPath, "roundUpdates");
  const generatedOffersDirectory = path.join(userBranchPath, "generatedOffers");

  // Deleting uploaded files
  const filePaths = [
    path.join(
      roundUpdatesDirectory,
      `round${roundNumber}_ConsolidatedFile.xlsx`
    ),
    path.join(
      roundUpdatesDirectory,
      `round${roundNumber}_IITGCandidateDecision.xlsx`
    ),
    path.join(
      roundUpdatesDirectory,
      `round${roundNumber}_IITGOfferedButNotInterested.xlsx`
    ),
    path.join(generatedOffersDirectory, `round${roundNumber}.xlsx`),
  ];

  console.log("file path have been identified");
  for (const filePath of filePaths) {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) throw err;
        console.log(`${filePath} was deleted`);
      });
    }
  }

  // Connecting to database
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

  // Deleting all the offered candidates in that round and retain and accepted round as that of current number
  try {
    const sqlQuery = `DELETE FROM applicationstatus WHERE (Offered = 'Y' AND OfferedRound = '${roundNumber}' AND branch = '${branch}') OR (RetainRound = '${roundNumber}' AND branch = '${branch}') OR (RejectOrAcceptRound = '${roundNumber}' AND branch = '${branch}')`;
    console.log("SQL query being executed:", sqlQuery); // Log the SQL query
    console.log("the result of the branch is: ", branch);

    // Execute the query
    const result = await con.query(sqlQuery);

    console.log("the result of the deletion query is: ", result[0]);
  } catch (error) {
    throw error;
  }
}

module.exports = { resetRoundFunction };
