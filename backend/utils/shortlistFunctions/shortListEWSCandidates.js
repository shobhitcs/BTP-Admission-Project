const { insertManyIntoTable } = require("../sqlqueries");
var query = require("../sqlqueries").selectQuery;

/*
    Name: shortListEWSCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of EWS candidates based on their max gatescore. 
*/
async function shortListEWSCandidates(con, limit, round, branch) {
  // Query string
  const queryString = `SELECT mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM mtechappl
    LEFT JOIN applicationstatus
    ON mtechappl.COAP = applicationstatus.COAP 
    WHERE Offered IS NULL AND EWS='Yes' AND category='GEN' AND mtechappl.branch = '${branch}'
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  let shortlistedCandidates;
  // Querying
  try {
    [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  try {
    // Values to be inserted
    let valuesToBeInserted = [];
    for (const candidate of shortlistedCandidates) {
      // Inserting values into the table
      valuesToBeInserted.push([
        candidate.COAP,
        "Y",
        "",
        round,
        "",
        "",
        "EWS_FandM",
        branch,
      ]);
      // console.log(`Seat offered to ${candidate.COAP} in EWS_FandM category`);
    }

    // Insert values into the table
    if (valuesToBeInserted.length > 0) {
      await insertManyIntoTable(
        con,
        "applicationstatus",
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,branch)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }

  // Returning the shortlisted candidates
  return shortlistedCandidates;
}

/*
    Name: shortListEWSFemaleCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of EWS Female candidates based on their max gatescore. 
*/
async function shortListEWSFemaleCandidates(con, limit, round, branch) {
  // Query string
  const queryString = `SELECT mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM mtechappl
    LEFT JOIN applicationstatus
    ON mtechappl.COAP = applicationstatus.COAP 
    WHERE Offered IS NULL AND Gender = "Female" AND EWS='Yes' AND category="GEN" AND mtechappl.branch = '${branch}'
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  let shortlistedCandidates;
  // Querying
  try {
    [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  try {
    // Values to be inserted
    let valuesToBeInserted = [];
    for (const candidate of shortlistedCandidates) {
      // Inserting values into the table
      valuesToBeInserted.push([
        candidate.COAP,
        "Y",
        "",
        round,
        "",
        "",
        "EWS_Female",
        branch,
      ]);
      // console.log(`Seat offered to ${candidate.COAP} in EWS_Female category`);
    }

    // Insert values into the table
    if (valuesToBeInserted.length > 0) {
      await insertManyIntoTable(
        con,
        "applicationstatus",
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,branch)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }

  // Returning the shortlisted candidates
  return shortlistedCandidates;
}

module.exports = { shortListEWSCandidates, shortListEWSFemaleCandidates };
