var XLSX = require("xlsx");
const { distance } = require("closest-match");
//var applicantsSchemaColumnNames=require("../schemas/applicantsSchema").applicantsSchemaColumnNames;
/*
    Name: mapColumnNames
    Input : file path to the upload overall applicant data file
    output: JSON object containing all the old column name as the key and mapped column name as the value.
    Functionality : just matches the uploaded file column name to the closest matched column name of the database table. 
*/

const tempDate = new Date();
let tempYear = tempDate.getFullYear();
const currYear = tempYear - 2000;
const prevYear = currYear - 1;
const prevprevYear = currYear - 2;

var virtualColumnNames =
    [
        "COAP",
        "AppNo",
        "Email",
        "FullName",
        "MaxGateScore",
        "Pwd",
        "Ews",
        "Gender",
        "Category",
        // "GATE" + currYear + "Rank",
        "GATE" + currYear + "Score",
        "GATE" + prevYear + "Score",
        "GATE" + prevprevYear + "Score",
        // "GATE" + currYear + "Disc",
        // "GATE" + prevYear + "Rank",
        // "GATE" + prevYear + "Disc",
        // "GATE" + prevprevYear + "Disc",
        "GATE" + currYear + "RollNo",
        "GATE" + prevYear + "RollNo",
        "GATE" + prevprevYear + "RollNo",
        // "GATE" + prevprevYear + "Rank",
        // "HSSCboard",
        // "HSSCdate",
        "HSSCper",
        // "SSCboard",
        // "SSCdate",
        "SSCper",
        // "DegreeQual",
        // "DegreePassingDate",
        // "DegreeBranch",
        // "DegreeOtherBranch",
        // "DegreeInstitute",
        // "DegreeCGPA7thSem",
        "DegreeCGPA8thSem",
        // "DegreePer7thSem",
        "DegreePer8thSem",
        "Adm"
    ]
var applicantsSchemaColumnNames =
    [
        "COAP",
        "AppNo",
        "Email",
        "FullName",
        "MaxGateScore",
        "Pwd",
        "Ews",
        "Gender",
        "Category",
        "currYearScore",
        "prevYearScore",
        "prevprevYearScore",
        "currYearRollNo",
        "prevYearRollNo",
        "prevprevYearRollNo",
        "HSSCper",
        "SSCper",
        "DegreeCGPA8thSem",
        "DegreePer8thSem",
        // "OtherDetails"
    ]

function mapColumnNames(filePath) {
    // Reading Excel file
    var workbook = XLSX.readFile(filePath);
    var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];

    // Parsing sheet into JSON format
    var applicantsData = XLSX.utils.sheet_to_json(applicantsDataSheet, { defval: "" });

    // Extracting column names from the uploaded file
    var columnNames = Object.keys(applicantsData[0]);
    // var visitedColumnNames = {};
    var matchedColumnNames = {};

    // for (const columnName of columnNames) {
    //     visitedColumnNames[columnName] = false;
    // }

    // OLD CODE
    // Loop over schema column names first, to find closest match in uploaded file columns
    // for (const actualColumnName of applicantsSchemaColumnNames) {
    //     var minDist = 400;
    //     var matchedString = "";

    //     // Finding nearest match for each schema column name in uploaded column names
    //     for (const uploadedColumnName of columnNames) {
    //         var currDist = distance(actualColumnName, uploadedColumnName);
    //         if (currDist < minDist && !visitedColumnNames[uploadedColumnName]) {
    //             minDist = currDist;
    //             matchedString = uploadedColumnName;
    //         }
    //     }

    //     // Set the matched uploaded column name and mark it as visited
    //     matchedColumnNames[actualColumnName] = matchedString;
    //     visitedColumnNames[matchedString] = true;
    // }

    // console.log(virtualColumnNames);
    // NEW CODE
    for (let i = 0; i < applicantsSchemaColumnNames.length; i++) {
        const actualColumnName = applicantsSchemaColumnNames[i];
        let minDist = 400;
        let matchedString = "";

        // Finding the nearest match for each schema column name in uploaded column names
        for (let j = 0; j < columnNames.length; j++) {
            const uploadedColumnName = columnNames[j];
            const currDist = distance(virtualColumnNames[i], uploadedColumnName);

            if (currDist < minDist) {
                minDist = currDist;
                matchedString = uploadedColumnName;
            }
        }

        // Set the matched uploaded column name and mark it as visited
        matchedColumnNames[actualColumnName] = matchedString;
        // visitedColumnNames[matchedString] = true;
    }


    // console.log("Matched Column Names: ", matchedColumnNames);

    return { result: matchedColumnNames, options: columnNames };
}

// mapColumnNames(`C:\\Users\\Desktop\\BTP_Backend\\ApplicantData_withCOAPcorr_maxGateRoll.xlsx`)
module.exports = { mapColumnNames }