const path = require("path");
const fs = require("fs");
const mysql = require("mysql2");
const { resetRoundFunction } = require("./resetRoundFunction");

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

async function getRoundNumber(userBranch) {
  let branchDirectory = path.join(__dirname, "..", "files", userBranch);
  let updatesFromRoundsDirectoryPath = path.join(
    branchDirectory,
    "roundUpdates"
  );
  let generatedOffersDirectoryPath = path.join(
    branchDirectory,
    "generatedOffers"
  );
  let OffersfilesList = [];
  let updatesFromRoundsFiles = [];

  try {
    // Check if the roundUpdates directory exists
    if (!fs.existsSync(updatesFromRoundsDirectoryPath)) {
      // If the directory doesn't exist, create it
      fs.mkdirSync(updatesFromRoundsDirectoryPath, { recursive: true });
    }

    // Check if the generatedOffers directory exists
    if (!fs.existsSync(generatedOffersDirectoryPath)) {
      // If the directory doesn't exist, create it
      fs.mkdirSync(generatedOffersDirectoryPath, { recursive: true });
    }

    // Reading files from generatedOffers directory
    OffersfilesList = await getFilesInDirectory(generatedOffersDirectoryPath);
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }

  try {
    // Reading files from roundUpdates directory
    updatesFromRoundsFiles = await getFilesInDirectory(
      updatesFromRoundsDirectoryPath
    );
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }

  // Remove .gitignore files
  const removeGitIgnore = (files) => {
    const index = files.indexOf(".gitignore");
    if (index !== -1) {
      files.splice(index, 1);
    }
  };

  removeGitIgnore(OffersfilesList);
  removeGitIgnore(updatesFromRoundsFiles);

  // Determine the round number
  const roundNumber =
    OffersfilesList.length === 0 ||
    updatesFromRoundsFiles.length === 3 * OffersfilesList.length
      ? OffersfilesList.length + 1
      : OffersfilesList.length;

  return roundNumber;
}

async function resetRound(inputRoundNumber, branch) {
  const roundNumber = inputRoundNumber;
  const totalRounds = await getRoundNumber(branch);
  console.log("Total Rounds: ", totalRounds);
  console.log("Round Number: ", roundNumber);

  for (let curr_round = roundNumber; curr_round <= totalRounds; curr_round++) {
    console.log("Calling reset round function for round: ", curr_round);
    await resetRoundFunction(curr_round, branch);
  }
}

module.exports = { resetRound };
