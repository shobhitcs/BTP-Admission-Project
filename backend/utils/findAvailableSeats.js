async function findAvailableSeats(con, category, round, branch) {
  var availableSeats = 0;
  var availablePWDSeats = [{ SeatsAllocated: 0, seatsTaken: 0 }];

  try {
    [availableSeats] = await con.query(
      `SELECT SeatsAllocated, (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R') AND offercat=? AND branch=?) AS SeatsTaken FROM seatMatrix WHERE category=? AND branch=?;`,
      [category, branch, category, branch]
    );

    [availablePWDSeats] = await con.query(
      `SELECT SeatsAllocated, (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R' OR OfferedRound=?) AND offercat=? AND branch=?) AS SeatsTaken FROM seatMatrix WHERE category=? AND branch=?;`,
      [round, category + "_PWD", branch, category + "_PWD", branch]
    );
  } catch (error) {
    throw error;
  }

  var seatsAvailable =
    availablePWDSeats[0].SeatsAllocated -
    availablePWDSeats[0].SeatsTaken +
    Math.max(
      0,
      availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
    );
  // console.log(
  //   "Seats available for",
  //   category,
  //   "in branch",
  //   branch,
  //   "is:",
  //   seatsAvailable
  // );

  return seatsAvailable;
}

async function findAvailableSeatsPWD(con, category, round, branch) {
  var availableSeats = 0;

  try {
    [availableSeats] = await con.query(
      `SELECT SeatsAllocated, (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R') AND offercat=? AND branch=?) AS SeatsTaken FROM seatMatrix WHERE category=? AND branch=?;`,
      [category, branch, category, branch]
    );
  } catch (error) {
    throw error;
  }

  // console.log(
  //   "Seats available for",
  //   category,
  //   "in branch",
  //   branch,
  //   "is:",
  //   Math.max(0, availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken)
  // );

  return Math.max(
    0,
    availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
  );
}

async function findAvailableSeatsCommonPWD(con, round, branch) {
  var availableSeats = 0;

  try {
    [availableSeats] = await con.query(
      `SELECT SeatsAllocated, (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R') AND offercat REGEXP 'PWD$' AND branch=?) AS SeatsTaken FROM seatMatrix WHERE category REGEXP 'COMMON_PWD' AND branch=?;`,
      [branch, branch]
    );
  } catch (error) {
    throw error;
  }

  // console.log(
  //   "Seats available for common_PWD in branch",
  //   branch,
  //   "is:",
  //   Math.max(0, availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken)
  // );

  return Math.max(
    0,
    availableSeats[0].SeatsAllocated - availableSeats[0].SeatsTaken
  );
}

async function findAvailableSeatsGeneral(con, category, round, branch) {
  var availableSeats = 0;
  var availablePWDSeats = [{ SeatsAllocated: 0, seatsTaken: 0 }];

  try {
    [availableSeats] = await con.query(
      `SELECT SeatsAllocated FROM seatMatrix WHERE category=? AND branch=?;`,
      [category, branch]
    );

    [availablePWDSeats] = await con.query(
      `SELECT SeatsAllocated, (SELECT COUNT(*) FROM applicationstatus WHERE (accepted='Y' OR accepted='R' OR OfferedRound=?) AND offercat=? AND branch=?) AS SeatsTaken FROM seatMatrix WHERE category=? AND branch=?;`,
      [round, category + "_PWD", branch, category + "_PWD", branch]
    );
  } catch (error) {
    throw error;
  }

  var seatsAvailable =
    availablePWDSeats[0].SeatsAllocated -
    availablePWDSeats[0].SeatsTaken +
    Math.max(0, availableSeats[0].SeatsAllocated);
  // console.log(
  //   "Seats available for",
  //   category,
  //   "in branch",
  //   branch,
  //   "is:",
  //   seatsAvailable
  // );

  return seatsAvailable;
}

module.exports = {
  findAvailableSeats,
  findAvailableSeatsPWD,
  findAvailableSeatsCommonPWD,
  findAvailableSeatsGeneral,
};
