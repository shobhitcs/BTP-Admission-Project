const reader = require("xlsx");
var mysql = require("mysql2");
var applicantsSchemaColumnNames =
  require("../schemas/applicantsSchema").applicantsSchemaColumnNames;

var excel2024ColumnNames =
  require("../schemas/excel2024ColumnNames").excel2024ColumnNames;

async function writeToExcel(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE mtechappl.Category='${category}' AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

function formatDate(dateString) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0"); // Add leading zero if day is single-digit
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

async function writeToExcel2024(con, sheetName, round, fileName, branch) {
  var columnNames =
    "applicationstatus.offerCat as 'Offered Category',applicationstatus.Accepted as 'AppStatus',applicationstatus.OfferedRound as 'Round Number',mtechappl.branch as 'Offered Program Code',mtechappl.AppNo as 'Mtech Application Number',mtechappl.GateRegNum as 'GATE Reg No (without papercode)',mtechappl.MaxGateScore as 'GATE Score',mtechappl.FullName as 'Candidate Name',";

  columnNames = columnNames.slice(0, -1); //if error

  try {
    var newResult = [];
    //console.log(newResult);

    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE (OfferedRound='${round}' OR Accepted='R' OR Accepted='Y') AND mtechappl.branch = '${branch}' ORDER BY applicationstatus.offerCat ASC,mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    //console.log(result);
    for (var row of result) {
      row["Application Seq No"] = "";
      row["AppStatus"] = "Pending";
      row["Remarks"] = "";

      let date = new Date().toJSON().slice(0, 10);
      const formattedDate = formatDate(date); // Call the formatDate function
      row["App Date"] = formattedDate;

      // row["App Date"] = date;
      // row["App Date"] = format(new Date(date), "dd/MMM/yyyy");
      row["GATE Reg No (without papercode)"] = row[
        "GATE Reg No (without papercode)"
      ].slice(2, 14);
      row["Mtech Application Number"] = row["Mtech Application Number"];
      row["GATE Score"] = row["GATE Score"];
      row["Candidate Name"] = row["Candidate Name"];

      if (row["Offered Program Code"].toLowerCase() === "cse")
        row["Offered Program"] = "Computer Science And Engineering";
      if (row["Offered Program Code"].toLowerCase() === "ee")
        row["Offered Program"] = "Electrical Engineering";
      if (row["Offered Program Code"].toLowerCase() === "me")
        row["Offered Program"] = "Mechanical Engineering";

      row["Offered Program Code"] = row["Offered Program Code"];

      if (
        row["Offered Category"][0] === "G"
      ) {
        row["Offered Category"] = "GN";
      }
      else if (row["Offered Category"][0] === "E") {
        row["Offered Category"] = "EWS";
      }
       else if (row["Offered Category"][0] === "O") {
        row["Offered Category"] = "OBC(NCL)";
      } else if (row["Offered Category"][0] === "S") {
        if (row["Offered Category"][1] === "C") {
          row["Offered Category"] = "SC";
        } else {
          row["Offered Category"] = "ST";
        }
      }

      row["Round Number"] = row["Round Number"];
      row["Institute Name"] = "IIT Goa";
      row["Institute ID"] = "22";

      row["Institute Type"] = "IIT";

      row["Form status"] = "";

      newRow = {};
      newRow["Application Seq No"] = row["Application Seq No"];
      newRow["AppStatus"] = row["AppStatus"];
      newRow["Remarks"] = row["Remarks"];
      newRow["App Date"] = row["App Date"];
      newRow["GATE Reg No (without papercode)"] =
        row["GATE Reg No (without papercode)"];
      newRow["Mtech Application Number"] = row["Mtech Application Number"];
      newRow["GATE Score"] = row["GATE Score"];
      newRow["Candidate Name"] = row["Candidate Name"];
      newRow["Offered Program"] = row["Offered Program"];
      newRow["Offered Program Code"] = row["Offered Program Code"];
      newRow["Offered Category"] = row["Offered Category"];
      newRow["Round Number"] = row["Round Number"];
      newRow["Institute Name"] = row["Institute Name"];
      newRow["Institute ID"] = row["Institute ID"];
      newRow["Institute Type"] = row["Institute Type"];
      newRow["Form status"] = row["Form status"];

      newResult.push(newRow);
      //console.log(newResult);
    }
    const ws = reader.utils.json_to_sheet(newResult);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelFemaleCandidates(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE mtechappl.Category='${category}' AND Gender = "Female" AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelEWS(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE EWS='Yes' AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelAllOffers(con, sheetName, round, fileName, branch) {
  var columnNames =
    "applicationstatus.offerCat,mtechappl.PWD as 'IsPWD',applicationstatus.offered,applicationstatus.Accepted,applicationstatus.OfferedRound,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE (OfferedRound='${round}' OR Accepted='R' OR Accepted='Y') AND mtechappl.branch = '${branch}' ORDER BY applicationstatus.offerCat ASC,mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
    deleteWorksheet(fileName, "Sheet1");
  } catch (error) {
    throw error;
  }
}

async function writeToExcelGeneral(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelGeneralFemale(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE Gender="Female" AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelPWD(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE Pwd='Yes' AND category REGEXP '${category}' AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

async function writeToExcelEWSPWD(
  con,
  data,
  sheetName,
  category,
  round,
  fileName,
  branch
) {
  var columnNames = "applicationstatus.offered,applicationstatus.Accepted,";
  for (var columnName of applicantsSchemaColumnNames) {
    columnNames += `mtechappl.${columnName}` + ",";
  }
  columnNames = columnNames.slice(0, -1);

  try {
    var [result] = await con.query(`SELECT ${columnNames} FROM mtechappl 
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE Pwd='Yes' AND EWS='Yes' AND category REGEXP '${category}' AND mtechappl.branch = '${branch}' ORDER BY mtechappl.MaxGateScore DESC`);
    const file = reader.readFile(fileName);
    const ws = reader.utils.json_to_sheet(result);
    reader.utils.book_append_sheet(file, ws, sheetName);
    reader.writeFile(file, fileName);
  } catch (error) {
    throw error;
  }
}

const deleteWorksheet = async (filePath, workSheetName) => {
  const workBook = reader.readFile(filePath);
  const workSheetNames = Object.keys(workBook.Sheets);
  if (workSheetNames.includes(workSheetName)) {
    delete workBook.Sheets[workSheetName];
    delete workBook.SheetNames[workSheetName];
    indexToDelete = workBook.SheetNames.indexOf(workSheetName);
    workBook.SheetNames.splice(indexToDelete, 1);
    reader.writeFile(workBook, filePath);
  }
};

module.exports = {
  writeToExcel,
  writeToExcelAllOffers,
  writeToExcelEWS,
  writeToExcelGeneral,
  writeToExcelGeneralFemale,
  writeToExcelFemaleCandidates,
  writeToExcelPWD,
  deleteWorksheet,
  writeToExcelEWSPWD,
  writeToExcel2024,
};
