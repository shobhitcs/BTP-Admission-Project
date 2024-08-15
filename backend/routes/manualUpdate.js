const router = require("express").Router();
const path = require("path");
const fs = require("fs");
const isAuthenticated = require("../middleware/authMiddleware");

const generatedOffersDirectoryPath = path.join(
  __dirname,
  "..",
  "files",
  "generatedOffers"
);
const updatesFromRoundsDirectoryPath = path.join(
  __dirname,
  "..",
  "files",
  "roundUpdates"
);
var mysql = require("mysql2");
/*
    Function name:getFilesInDirectory
    input : directory path
    output: files present in that directory
*/
const getFilesInDirectory = (directoryPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      // console.log("filePath:",directoryPath);
      if (err) {
        reject("Unable to scan directory: " + err);
      } else {
        resolve(files);
      }
    });
  });
};
/*
    Route:/api/rounds/getRounds
    incoming data: --
    outgoing data: sends the current round.
*/
async function getRoundNumber() {
  let OffersfilesList = [];
  let updatesFromRoundsFiles = [];
  try {
    //reading files from generateoffers directory
    OffersfilesList = await getFilesInDirectory(generatedOffersDirectoryPath);
  } catch (error) {
    console.log(error);
  }
  try {
    //reading files from updateRounds directory
    updatesFromRoundsFiles = await getFilesInDirectory(
      updatesFromRoundsDirectoryPath
    );
  } catch (error) {
    console.log(error);
  }
  //based on the files in generatedOffersDirectory and updatesFromRoundsDirectory returning the round number
  //popping to ignore the .gitignore files
  if (OffersfilesList.includes(".gitignore")) {
    OffersfilesList.splice(OffersfilesList.indexOf(".gitignore"), 1);
  }
  if (updatesFromRoundsFiles.includes(".gitignore")) {
    updatesFromRoundsFiles.splice(
      updatesFromRoundsFiles.indexOf(".gitignore"),
      1
    );
  }
  // console.log(OffersfilesList,updatesFromRoundsFiles);
  if (
    OffersfilesList.length === 0 ||
    updatesFromRoundsFiles.length === 3 * OffersfilesList.length
  ) {
    return OffersfilesList.length + 1;
  } else {
    return OffersfilesList.length;
  }
}
/*
    Route:/api/seatMatrix/seatMatrixData
    incoming data: --
    outgoing data: seat matrix table as JSON object
*/
router.post("/manualUpdate", isAuthenticated, async (req, res) => {
  const currentBranch = req.user.branch;
  // console.log("this is the current branch: ", currentBranch);
  //connecting to database
  var con;
  try {
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
  } catch (error) {
    console.log("Error connecting to database:", error);
    res.status(500).send({ result: "Internal server error" });
  }
  //quering seat matrix data
  var round = (await getRoundNumber()) - 1;
  if (round < 0) {
    res.status(500).send({ result: "Rounds have not been generted" });
  }
  try {
    const [result] = await con.query(`SELECT Accepted FROM applicationstatus
        WHERE COAP = '${req.body.coap}' AND branch = '${currentBranch}';`);
    // console.log(result);
    if (result[0].Accepted === "Y" || result[0].Accepted === "R") {
      const [resultSeatMatrix] = await con.query(`UPDATE applicationstatus
            SET ManualUpdate = 'yes', Accepted = 'N', RejectOrAcceptRound = ${round}
            WHERE COAP = '${req.body.coap}' AND Branch = '${currentBranch}';`);
    } else throw "update not possible";
    // console.log(resultSeatMatrix);
    res.status(200).send({ result: "success" });
  } catch (error) {
    // console.log(error);
    res.status(500).send({ result: "Update Not Possible" });
  }
});
module.exports = router;
