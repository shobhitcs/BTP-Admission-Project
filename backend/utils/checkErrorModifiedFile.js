const fs = require("fs");
const XLSX = require("xlsx");

const ModifiedFileErrors = (filePath) => {
  // check if file exists
  if (!fs.existsSync(filePath)) {
    return {
      isValid: false,
      message: "File not found",
    };
  }
  // read the file
  const workbook = XLSX.readFile(filePath);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

  // get the headers of the file
  const headers = XLSX.utils.sheet_to_json(firstSheet, { header: 1 })[0];
  // console.log(headers);
};
ModifiedFileErrors(
  "C:Users\noel vincentDesktopBTPBTP_Backend\filesmodifiedFile.xlsx"
);
// module.exports = {ModifiedFileErrors};
