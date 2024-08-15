const { insertManyIntoTable } = require("../sqlqueries");

/*
    Name: shortListPWDCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, category, offerCat, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of PWD candidates based on their max gatescore. 
*/
async function shortListPWDCandidates(
  con,
  limit,
  round,
  category,
  offerCat,
  branch
) {
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE Offered IS NULL AND Pwd='Yes' AND category REGEXP '${category}' AND ${mtechapplTable}.branch = '${branch}'
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  var shortlistedCandidates;

  try {
    var [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  try {
    const valuesToBeInserted = [];
    for (const candidate of shortlistedCandidates) {
      valuesToBeInserted.push([
        candidate.COAP,
        "Y",
        "",
        round,
        "",
        "",
        offerCat,
        "Y",
        branch,
      ]);
      // console.log(`Shortlisted ${candidate.COAP} in ${offerCat} category `);
    }

    if (valuesToBeInserted.length > 0) {
      await insertManyIntoTable(
        con,
        "applicationstatus",
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd,branch)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }
  return shortlistedCandidates;
}

/*
    Name: shortListEWSPWDCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, category, offerCat, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of EWS_PWD candidates based on their max gatescore. 
*/
async function shortListEWSPWDCandidates(
  con,
  limit,
  round,
  category,
  offerCat,
  branch
) {
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE Offered IS NULL AND Pwd='Yes' AND EWS='Yes' AND category='GEN' AND ${mtechapplTable}.branch = '${branch}'
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  var shortlistedCandidates;

  try {
    var [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  try {
    const valuesToBeInserted = [];
    for (const candidate of shortlistedCandidates) {
      valuesToBeInserted.push([
        candidate.COAP,
        "Y",
        "",
        round,
        "",
        "",
        offerCat,
        "Y",
        branch,
      ]);
      // console.log(`Shortlisted ${candidate.COAP} in ${offerCat} category `);
    }

    if (valuesToBeInserted.length > 0) {
      await insertManyIntoTable(
        con,
        "applicationstatus",
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd,branch)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }
  return shortlistedCandidates;
}

/*
    Name: shortListPWDFemaleCandidates
    Input : connection object to the database, limit on how many members to shortlist, ongoing round, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality: Shortlists a limited number of PWD Female candidates based on their max gatescore. 
*/

async function shortListPWDFemaleCandidates(con, limit, round, branch) {
  const mtechapplTable = `mtechappl`;
  const applicationstatusTable = `applicationstatus`;

  queryString = `SELECT ${mtechapplTable}.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferedRound
    FROM ${mtechapplTable}
    LEFT JOIN ${applicationstatusTable}
    ON ${mtechapplTable}.COAP = ${applicationstatusTable}.COAP 
    WHERE Offered IS NULL AND Gender = "Female" AND Pwd='Yes' AND ${mtechapplTable}.branch = '${branch}'
    ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
    LIMIT ${limit}`;

  var shortlistedCandidates;

  try {
    var [shortlistedCandidates] = await con.query(queryString);
  } catch (error) {
    throw error;
  }

  try {
    const valuesToBeInserted = [];
    for (const candidate of shortlistedCandidates) {
      valuesToBeInserted.push([
        candidate.COAP,
        "Y",
        "",
        round,
        "",
        "",
        "PWD_Female",
        "Y",
        branch,
      ]);
      // console.log(`Shortlisted ${candidate.COAP} in PWD_Female category `);
    }

    if (valuesToBeInserted.length > 0) {
      await insertManyIntoTable(
        con,
        "applicationstatus",
        "(COAP,Offered,Accepted,OfferedRound,RetainRound,RejectOrAcceptRound,OfferCat,IsOfferPwd,branch)",
        valuesToBeInserted
      );
    }
  } catch (error) {
    throw error;
  }
  return shortlistedCandidates;
}

// Exporting these functions
module.exports = {
  shortListPWDCandidates,
  shortListPWDFemaleCandidates,
  shortListEWSPWDCandidates,
};
