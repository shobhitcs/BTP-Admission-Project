const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");
const mysql = require("mysql2");

router.post("/updateSeatsBulk", isAuthenticated, async (req, res) => {
  const updates = req.body;

  try {
    const con = mysql.createPool({
      host: process.env.MYSQL_HOST_IP || "127.0.0.1",
      user: "root",
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      debug: false,
      insecureAuth: true,
    }).promise();

    const promises = updates.map(row => {
      const query = `UPDATE seatMatrix SET SeatsAllocated=? WHERE Category=? AND branch=?`;
      return con.query(query, [row.seats, row.category, req.user.branch]);
    });

    await Promise.all(promises);
    res.status(200).send({ message: "Seats successfully updated!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error updating seats" });
  }
});

module.exports = router;
