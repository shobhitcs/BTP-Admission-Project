var XLSX = require("xlsx");
const { distance} = require("closest-match");
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

var applicantsSchemaColumnNames=
[
    "COAP",
    "AppNo" , 
    "Email",
    "FullName",
    "MaxGateScore",
    "Adm",
    "Pwd",
    "Ews",
    "Gender",
    "Category",
    "GATE" + currYear + "RollNo",
    "GATE" + currYear + "Rank",
    "GATE" + currYear + "Score",
    "GATE" + currYear + "Disc",
    "GATE" + prevYear + "RollNo",
    "GATE" + prevYear + "Rank",
    "GATE" + prevYear + "Score",
    "GATE" + prevYear + "Disc",
    "GATE" + prevprevYear + "Disc",
    "GATE" + prevprevYear + "RollNo",
    "GATE" + prevprevYear + "Rank",
    "GATE" + prevprevYear + "Score", 
    "HSSCboard" ,
    "HSSCdate" , 
    "HSSCper", 
    "SSCboard" , 
    "SSCdate" , 
    "SSCper" ,
    "DegreeQual" , 
    "DegreePassingDate" ,
    "DegreeBranch" ,
    "DegreeOtherBranch" ,
    "DegreeInstitute" ,
    "DegreeCGPA7thSem" ,
    "DegreeCGPA8thSem" , 
    "DegreePer7thSem" ,
    "DegreePer8thSem",
]

function mapColumnNames(filePath) {
    //reading excel file
    var workbook = XLSX.readFile(filePath);
    var applicantsDataSheet = workbook.Sheets[workbook.SheetNames[0]];
    //making sure that we get all the column values/names.
    var applicantsData=XLSX.utils.sheet_to_json(applicantsDataSheet,{defval:""});
    var columnNames=Object.keys(applicantsData[1]);
    var visitedColumnNames={};
    var matchedColumnNames={};
    for (const columnName of columnNames) {
        visitedColumnNames[columnName]=false;
    }
    //uploaded column name are the  column name that are present in the uploaded file
    //actual column name are the actual column name that are present in the database table. 
    for (const uploadedColumnName of columnNames) {
        var minDist=400;
        var matchedString="";
        //finding the nearest math to uploaded column name by calculating edit distance kind of thing
        for(const actualColumnName of applicantsSchemaColumnNames){
            var currDist=distance(uploadedColumnName,actualColumnName);
            if(minDist>=currDist && !visitedColumnNames[actualColumnName]){
                minDist=currDist;
                matchedString=actualColumnName; 
            } 
        }
        visitedColumnNames[uploadedColumnName]=true;
        matchedColumnNames[uploadedColumnName]=matchedString;

    }
    /*
        Returning 
        {
            old column name:matched column name
            ... for each column
        }
    */
   //console.log("columnNames: ",columnNames);
   //console.log("matchedcolumnNames: ", matchedColumnNames);
   
    return matchedColumnNames
}
// mapColumnNames(`C:\\Users\\Desktop\\BTP_Backend\\ApplicantData_withCOAPcorr_maxGateRoll.xlsx`)
module.exports={mapColumnNames}

// lqknefoewofnowen