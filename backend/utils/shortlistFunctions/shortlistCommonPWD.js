var query = require("../sqlqueries").selectQuery;
const { insertManyIntoTable } = require("../sqlqueries");
const { findAvailableSeats } = require("../findAvailableSeats");

async function updateCandidateStatus(con, candidate, offerCat, round, branch) {
  //updating the shortlisted candidates status in the applicationstatus table.
  try {
    let valuesToBeInserted = [
      [candidate.COAP, "Y", "", round, "", "", offerCat, "Y", branch],
    ];
    /*
            updating 
            COAP with shortlisted candidate coap
            offered with 'Y'
            OfferedRound with current round number
            offercat with PWD_FandM
            IsOfferPwd with Y
        */
    if (valuesToBeInserted.length > 0) {
      await insertManyIntoTable(
        con,
        "applicationstatus",
        "(COAP, Offered, Accepted, OfferedRound, RetainRound, RejectOrAcceptRound, OfferCat, IsOfferPwd, branch)",
        valuesToBeInserted
      );
      // console.log(
      //   `Seat offered to ${candidate.COAP} in ${offerCat} category (COMMON_PWD)`
      // );
    }
  } catch (error) {
    throw error;
  }
}
/*
    Name: shortlistCommonPWDCandidates
    Input : connection object to the database,limit on how many members to shortlist,ongoing round
    output: JSON object containing all the shortlisted candidates.
    Functionality : shortlists limit no of EWS candidates based on their max gatescore. 
*/
async function shortlistCommonPWDCandidates(con, limit, round, branch) {
  var checkedCandidatesCoapID = ["x"];
  while (limit > 0) {
    var checkedCOAPIDs = "";
    for (const element of checkedCandidatesCoapID) {
      checkedCOAPIDs += `'${element}',`;
    }
    if (checkedCOAPIDs.length > 0) {
      checkedCOAPIDs = checkedCOAPIDs.slice(0, -1);
    }
    queryString = `SELECT mtechappl.COAP, Gender, Category, MaxGateScore, EWS, PWD,
        Offered, 
        Accepted,
        OfferedRound
        FROM mtechappl
        LEFT JOIN applicationstatus
        ON mtechappl.COAP = applicationstatus.COAP 
        WHERE Offered IS NULL AND Pwd='Yes' AND mtechappl.COAP NOT IN (${checkedCOAPIDs})
        AND mtechappl.branch = '${branch}'  /* Added condition for branch */
        ORDER BY MaxGateScore DESC, HSSCper DESC, SSCper DESC
        LIMIT 1`;
    var shortlistedCandidates;
    //querying
    try {
      var [shortlistedCandidates] = await con.query(queryString);
      shortlistedCandidates = shortlistedCandidates[0];
      if (!shortlistedCandidates) {
        break;
      }
      var cat = shortlistedCandidates["Category"];
      if (cat === "GEN" && shortlistedCandidates.EWS === "Yes") {
        var seats_male = await findAvailableSeats(
          con,
          "EWS_FandM",
          round,
          branch
        );
        var seats_female = await findAvailableSeats(
          con,
          "EWS_Female",
          round,
          branch
        );
        if (shortlistedCandidates["Gender"] === "Female" && seats_female > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "EWS_Female_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        } else if (seats_male > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "EWS_FandM_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        }
      } else if (cat === "GEN") {
        var seats_male = await findAvailableSeats(
          con,
          "GEN_FandM",
          round,
          branch
        );
        var seats_female = await findAvailableSeats(
          con,
          "GEN_Female",
          round,
          branch
        );
        if (shortlistedCandidates["Gender"] === "Female" && seats_female > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "GEN_Female_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        } else if (seats_male > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "GEN_FandM_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        }
      } else if (cat === "OBC") {
        var seats_male = await findAvailableSeats(
          con,
          "OBC_FandM",
          round,
          branch
        );
        var seats_female = await findAvailableSeats(
          con,
          "OBC_Female",
          round,
          branch
        );
        if (shortlistedCandidates["Gender"] === "Female" && seats_female > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "OBC_Female_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        } else if (seats_male > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "OBC_FandM_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        }
      } else if (cat === "SC") {
        var seats_male = await findAvailableSeats(
          con,
          "SC_FandM",
          round,
          branch
        );
        var seats_female = await findAvailableSeats(
          con,
          "SC_Female",
          round,
          branch
        );
        if (shortlistedCandidates["Gender"] === "Female" && seats_female > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "SC_Female_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        } else if (seats_male > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "SC_FandM_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        }
      } else if (cat === "ST") {
        var seats_male = await findAvailableSeats(
          con,
          "ST_FandM",
          round,
          branch
        );
        var seats_female = await findAvailableSeats(
          con,
          "ST_Female",
          round,
          branch
        );
        if (shortlistedCandidates["Gender"] === "Female" && seats_female > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "ST_Female_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        } else if (seats_male > 0) {
          try {
            var res = await updateCandidateStatus(
              con,
              shortlistedCandidates,
              "ST_FandM_PWD",
              round,
              branch
            );
          } catch (error) {
            throw error;
          }
          limit -= 1;
        }
      }
      checkedCandidatesCoapID.push(shortlistedCandidates["COAP"]);
    } catch (error) {
      throw error;
    }
  }
  return shortlistedCandidates;
}

module.exports = { shortlistCommonPWDCandidates };
