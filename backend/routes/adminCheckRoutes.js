const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const connection = require("../config/dbConfig");

router.post("/checkAdmin", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Query the database to retrieve the user's information
    connection.query(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      (error, results) => {
        if (error) {
          console.error("Error querying database:", error);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (results.length === 0) {
          return res.status(404).json({ error: "User not found" });
        }

        const user = results[0];
        // Check if the user is an admin
        if (user.branch === "admin" || user.isAdmin === 1) {
          // Check if the password matches
          if (bcrypt.compareSync(password, user.password)) {
            // console.log("user is", user.username);
            // console.log("user pass is", user.password);
            return res.json({ isAdmin: true });
          } else {
            return res.json({ isAdmin: false });
          }
        } else {
          return res.json({ isAdmin: false });
        }
      }
    );
  } catch (error) {
    console.error("Error checking admin status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

//
