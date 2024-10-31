const tempDate = new Date();
let tempYear = tempDate.getFullYear();
const currYear = tempYear - 2000;
const prevYear = currYear - 1;
const prevprevYear = currYear - 2;
export const applicantsSchemaColumnNames = [
  "COAP",
  "AppNo",
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
  "HSSCboard",
  "HSSCdate",
  "HSSCper",
  "SSCboard",
  "SSCdate",
  "SSCper",
  "DegreeQual",
  "DegreePassingDate",
  "DegreeBranch",
  "DegreeOtherBranch",
  "DegreeInstitute",
  "DegreeCGPA7thSem",
  "DegreeCGPA8thSem",
  "DegreePer7thSem",
  "DegreePer8thSem"
];
export const applicantsSchemaColumnNamesJson = {
  COAP: [],
  AppNo: [],

  Email: [],
  FullName: [],
  MaxGateScore: [],
  Adm: [],
  Pwd: [],
  Ews: [],
  Gender: [],
  Category: [],
  GATE21RollNo: [],
  GATE21Rank: [],
  GATE21Score: [],
  GATE21Disc: [],
  GATE23RollNo: [],
  GATE23Rank: [],
  GATE23Score: [],
  GATE23Disc: [],
  GATE22RollNo: [],
  GATE22Rank: [],
  GATE22Score: [],
  GATE22Disc: [],
  HSSCboard: [],
  HSSCdate: [],
  HSSCper: [],
  SSCboard: [],
  SSCdate: [],
  SSCper: [],
  DegreeQual: [],
  DegreePassingDate: [],
  DegreeBranch: [],
  DegreeOtherBranch: [],
  DegreeInstitute: [],
  DegreeCGPA7thSem: [],
  DegreeCGPA8thSem: [],
  DegreePer7thSem: [],
  DegreePer8thSem: []
};

export const columnMapping = {
  "COAP": "COAP",
  "AppNo": "AppNo",
  "Email": "Email",
  "FullName": "FullName",
  "MaxGateScore": "MaxGateScore",
  "Pwd": "Pwd",
  "Ews": "Ews",
  "Gender": "Gender",
  "Category": "Category",
  "currYearScore": "GATE" + currYear + "Score",
  "prevYearScore": "GATE" + prevYear + "Score",
  "prevprevYearScore": "GATE" + prevprevYear + "Score",
  "currYearRollNo": "GATE" + currYear + "RollNo",
  "prevYearRollNo": "GATE" + prevYear + "RollNo",
  "prevprevYearRollNo": "GATE" + prevprevYear + "RollNo",
  "HSSCper": "HSSCper",
  "SSCper": "SSCper",
  "DegreeCGPA8thSem": "DegreeCGPA8thSem",
  "DegreePer8thSem": "DegreePer8thSem",
  "Adm": "Adm"
};
