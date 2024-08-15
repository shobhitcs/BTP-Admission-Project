const { insertManyIntoTable } = require("../sqlqueries");
var query = require("../sqlqueries").selectQuery;

/*
    Name: updateFemaleCandidatesOfferedCategory
    Input : connection object to the database, category, ongoing round, number of seats left in the female category, branch
    Output: JSON object containing all the shortlisted candidates.
    Functionality : based on the given category it tries to upgrade a female candidate who has been allocated a seat in 
    gender-Neutral category to gender-Female category of the same category. 
*/
async function updateFemaleCandidatesOfferedCategory(
  con,
  category,
  round,
  noOfFemaleSeats,
  branch
) {
  // Query string
  const queryString = `SELECT mtechappl.COAP, Gender, Category, MaxGateScore,
    Offered, 
    Accepted,
    OfferCat,
    OfferedRound
    FROM mtechappl
    LEFT JOIN applicationstatus
    ON mtechappl.COAP = applicationstatus.COAP 
    WHERE (Accepted='R' AND OfferCat ='${category}_FandM' AND Gender='Female') OR (Accepted='Y' AND  OfferCat ='${category}_FandM' AND Gender='Female') 
    AND mtechappl.branch = '${branch}'
    ORDER BY MaxGateScore DESC, EWS ASC, HSSCper DESC, SSCper DESC`;

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
    while (noOfFemaleSeats > 0) {
      for (const candidate of shortlistedCandidates) {
        // Update the candidate's OfferCat to the female category
        const [updateResult] = await con.query(`UPDATE applicationstatus
                SET  OfferedRound=${round}, OfferCat='${category}_Female'
                WHERE COAP = '${candidate.COAP}' AND branch = '${branch}';`);
      }
      noOfFemaleSeats--;
    }
  } catch (error) {
    throw error;
  }

  // Returning the shortlisted candidates
  return shortlistedCandidates;
}

// Exporting the function
module.exports = { updateFemaleCandidatesOfferedCategory };
