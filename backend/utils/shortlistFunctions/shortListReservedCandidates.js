const { insertManyIntoTable } = require("../sqlqueries");

/*
    Name: shortListReservedCandidates
    Input : connection object to the database, limit on how many members to shortlist in a category, gender, category (OBC, SC, ST), ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality : Shortlists a limited number of category (OBC, SC, ST) candidates based on input candidates based on their max gatescore. 
*/
async function shortListReservedCandidates(
  con,
  limit,
  gender,
  category,
  round,
  branch
) {
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  let queryString;
  let currCategory = category;

  if (gender === "F") {
    queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
            Offered, 
            Accepted,
            OfferedRound
            FROM ${mtechapplTable}
            LEFT JOIN ${applicationstatusTable}
            ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
            WHERE Offered IS NULL AND Gender = "Female" AND Category="${category}" AND ${mtechapplTable}.branch = '${branch}'
            ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
            LIMIT ${limit}`
    currCategory = currCategory + "_Female";
  } else {
    queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
            Offered, 
            Accepted,
            OfferedRound
            FROM ${mtechapplTable}
            LEFT JOIN ${applicationstatusTable}
            ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
            WHERE Offered IS NULL AND Category="${category}" AND ${mtechapplTable}.branch = '${branch}'
            ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
            LIMIT ${limit}`
    currCategory = currCategory + "_FandM";
  }

  var shortlistedCandidates;
  try {
    var [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  try {
    let valuesToBeInserted = [];
    for (const candidate of shortlistedCandidates) {
      valuesToBeInserted.push([
        candidate.COAP,
        "Y",
        "",
        round,
        "",
        "",
        currCategory,
        branch, // Include branch directly in the values
      ]);
      console.log(`Shortlisted ${candidate.COAP} in ${currCategory} category`);
    }

    if (valuesToBeInserted.length > 0) {
      var x = await insertManyIntoTable(
        con,
        applicationstatusTable,
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,branch)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }

  return shortlistedCandidates;
}

// Exporting the function
module.exports = { shortListReservedCandidates };
