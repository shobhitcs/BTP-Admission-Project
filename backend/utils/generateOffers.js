const mysql = require("mysql2");
const {
  shortListGeneralCandidates,
  shortListGeneralFemaleCandidates,
} = require("./shortlistFunctions/shortListGeneralCandidates");
const {
  shortListEWSCandidates,
  shortListEWSFemaleCandidates,
} = require("./shortlistFunctions/shortListEWSCandidates");
const {
  shortListReservedCandidates,
} = require("./shortlistFunctions/shortListReservedCandidates");
const {
  shortListPWDCandidates,
  shortListEWSPWDCandidates,
} = require("./shortlistFunctions/shortListPWDCandidates");
const {
  shortlistCommonPWDCandidates,
} = require("./shortlistFunctions/shortlistCommonPWD.js");
const {
  writeToExcel,
  writeToExcelAllOffers,
  writeToExcelEWS,
  writeToExcelGeneral,
  writeToExcelGeneralFemale,
  writeToExcelFemaleCandidates,
  writeToExcelPWD,
  writeToExcelEWSPWD,
  writeToExcel2024,
} = require("./writeOfferstoExcel");
const path = require("path");
const reader = require("xlsx");
const fs = require("fs");
const {
  findAvailableSeats,
  findAvailableSeatsPWD,
  findAvailableSeatsCommonPWD,
  findAvailableSeatsGeneral,
} = require("./findAvailableSeats");
const {
  updateFemaleCandidatesOfferedCategory,
} = require("./shortlistFunctions/femaleUpgradation");

async function generateOffers(databaseName, round, filePath, branch) {
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

  try {
    var generalFemaleUpdates = updateFemaleCandidatesOfferedCategory(
      con,
      "GEN",
      round,
      await findAvailableSeats(con, "GEN_Female", round, branch),
      branch
    );

    var EWSFemaleUpdates = updateFemaleCandidatesOfferedCategory(
      con,
      "EWS",
      round,
      await findAvailableSeats(con, "EWS_Female", round, branch),
      branch
    );

    var OBCFemaleUpdates = updateFemaleCandidatesOfferedCategory(
      con,
      "OBC",
      round,
      await findAvailableSeats(con, "OBC_Female", round, branch),
      branch
    );

    var SCFemaleUpdates = updateFemaleCandidatesOfferedCategory(
      con,
      "SC",
      round,
      await findAvailableSeats(con, "SC_Female", round, branch),
      branch
    );

    var STFemaleUpdates = updateFemaleCandidatesOfferedCategory(
      con,
      "ST",
      round,
      await findAvailableSeats(con, "ST_Female", round, branch),
      branch
    );

    var commonPWDCandidates = await shortlistCommonPWDCandidates(
      con,
      await findAvailableSeatsCommonPWD(con, round, branch),
      round,
      branch
    );

    var generalPWDCandidates = await shortListPWDCandidates(
      con,
      await findAvailableSeatsPWD(con, "GEN_FandM_PWD", round, branch),
      round,
      "w*",
      "GEN_FandM_PWD",
      branch
    );

    var OBCPWDCandidates = await shortListPWDCandidates(
      con,
      await findAvailableSeatsPWD(con, "OBC_FandM_PWD", round, branch),
      round,
      "OBC",
      "OBC_FandM_PWD",
      branch
    );

    var SCPWDCandidates = await shortListPWDCandidates(
      con,
      await findAvailableSeatsPWD(con, "SC_FandM_PWD", round, branch),
      round,
      "SC",
      "SC_FandM_PWD",
      branch
    );

    var STPWDCandidates = await shortListPWDCandidates(
      con,
      await findAvailableSeatsPWD(con, "ST_FandM_PWD", round, branch),
      round,
      "ST",
      "ST_FandM_PWD",
      branch
    );

    var EWSPWDCandidates = await shortListEWSPWDCandidates(
      con,
      await findAvailableSeatsPWD(con, "EWS_FandM_PWD", round, branch),
      round,
      "Gen",
      "EWS_FandM_PWD",
      branch
    );

    var generalFemaleCandidates = await shortListGeneralFemaleCandidates(
      con,
      await findAvailableSeatsGeneral(con, "GEN_Female", round, branch),
      round,
      branch
    );
    console.log("generated offers 14: ", branch);

    var generalCandidates = await shortListGeneralCandidates(
      con,
      await findAvailableSeatsGeneral(con, "GEN_FandM", round, branch),
      round,
      branch
    );
    console.log("generated offers 15: ", branch);

    var EWSCandidatesFemales = await shortListEWSFemaleCandidates(
      con,
      await findAvailableSeats(con, "EWS_Female", round, branch),
      round,
      branch
    );
    console.log("generated offers 16: ", branch);

    var EWSCandidates = await shortListEWSCandidates(
      con,
      await findAvailableSeats(con, "EWS_FandM", round, branch),
      round,
      branch
    );
    console.log("generated offers 17: ", branch);

    var OBCCandidatesFemales = await shortListReservedCandidates(
      con,
      await findAvailableSeats(con, "OBC_Female", round, branch),
      "F",
      "OBC",
      round,
      branch
    );

    var OBCCandidates = await shortListReservedCandidates(
      con,
      await findAvailableSeats(con, "OBC_FandM", round, branch),
      "M",
      "OBC",
      round,
      branch
    );

    var SCCandidatesFemales = await shortListReservedCandidates(
      con,
      await findAvailableSeats(con, "SC_Female", round, branch),
      "F",
      "SC",
      round,
      branch
    );

    var SCCandidates = await shortListReservedCandidates(
      con,
      await findAvailableSeats(con, "SC_FandM", round, branch),
      "M",
      "SC",
      round,
      branch
    );

    var STCandidatesFemales = await shortListReservedCandidates(
      con,
      await findAvailableSeats(con, "ST_Female", round, branch),
      "F",
      "ST",
      round,
      branch
    );

    var STCandidates = await shortListReservedCandidates(
      con,
      await findAvailableSeats(con, "ST_FandM", round, branch),
      "M",
      "ST",
      round,
      branch
    );
  } catch (error) {
    throw error;
  }

  try {
    await writeToExcelAllOffers(con, "Offers-List", round, filePath, branch);

    await writeToExcel2024(con, "Offer-24-format", round, filePath, branch);

    await writeToExcelPWD(
      con,
      generalPWDCandidates,
      "PWD-GEN",
      "w*",
      round,
      filePath,
      branch
    );
    await writeToExcelPWD(
      con,
      OBCPWDCandidates,
      "PWD-OBC",
      "OBC",
      round,
      filePath,
      branch
    );
    await writeToExcelPWD(
      con,
      SCPWDCandidates,
      "PWD-SC",
      "SC",
      round,
      filePath,
      branch
    );
    await writeToExcelPWD(
      con,
      STPWDCandidates,
      "PWD-ST",
      "ST",
      round,
      filePath,
      branch
    );
    await writeToExcelEWSPWD(
      con,
      EWSPWDCandidates,
      "PWD-EWS",
      "GEN",
      round,
      filePath,
      branch
    );
    await writeToExcelGeneral(
      con,
      generalCandidates,
      "General-ALL",
      "GEN",
      round,
      filePath,
      branch
    );
    await writeToExcelGeneralFemale(
      con,
      generalFemaleCandidates,
      "General-Female",
      "GEN",
      round,
      filePath,
      branch
    );
    await writeToExcelEWS(
      con,
      EWSCandidates,
      "EWS",
      "EWS",
      round,
      filePath,
      branch
    );
    await writeToExcel(
      con,
      OBCCandidates,
      "OBC",
      "OBC",
      round,
      filePath,
      branch
    );
    await writeToExcelFemaleCandidates(
      con,
      OBCCandidatesFemales,
      "OBC-Female",
      "OBC",
      round,
      filePath,
      branch
    );
    await writeToExcel(con, SCCandidates, "SC", "SC", round, filePath, branch);
    await writeToExcelFemaleCandidates(
      con,
      SCCandidatesFemales,
      "SC-Female",
      "SC",
      round,
      filePath,
      branch
    );
    await writeToExcel(con, STCandidates, "ST", "ST", round, filePath, branch);

    await writeToExcelFemaleCandidates(
      con,
      STCandidatesFemales,
      "ST-Female",
      "ST",
      round,
      filePath,
      branch
    );
  } catch (error) {
    throw error;
  }
}

module.exports = { generateOffers };
