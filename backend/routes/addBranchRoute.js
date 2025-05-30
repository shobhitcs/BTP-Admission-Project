// Import required modules
const express = require("express");
const router = express.Router();
const db = require("../config/dbConfig"); // Import the MySQL connection

// // Import the branch schema
// const { branchSchema } = require("../schemas/branchesSchema");

// // Check if branches table exists, if not, create it
// const createTableQuery = `CREATE TABLE IF NOT EXISTS branches ${branchSchema}`;
// db.query(createTableQuery, (err, result) => {
//   if (err) {
//     throw err;
//   }
//   console.log("Branches table created or already exists");
// });

// Route to add a new branch
// router.put("/addBranch", (req, res) => {
//   const newBranch = req.body.newBranch;

//   // Check if the branch already exists in the database
//   db.query(
//     "SELECT * FROM branches WHERE branch = ?",
//     newBranch,
//     (err, result) => {
//       if (err) {
//         throw err;
//       }

//       // If the branch already exists, return an error
//       if (result.length > 0) {
//         return res.status(400).json({ error: "Branch already exists" });
//       }

//       // If the branch does not exist, insert it into the database
//       db.query(
//         "INSERT INTO branches (branch) VALUES (?)",
//         newBranch,
//         (err, result) => {
//           if (err) {
//             throw err;
//           }
//           // console.log("New branch added:", newBranch);
//           res.sendStatus(200);
//         }
//       );
//     }
//   );
// });
router.put("/addBranch", async (req, res) => {
  const newBranch = req.body.newBranch;

  try {
    // Check if the branch already exists
    const [existing] = await db.query("SELECT * FROM branches WHERE branch = ?", [newBranch]);

    if (existing.length > 0) {
      return res.status(400).json({ error: "Branch already exists" });
    }

    // Insert new branch
    await db.query("INSERT INTO branches (branch) VALUES (?)", [newBranch]);

    res.sendStatus(200);
  } catch (err) {
    console.error("Error in /addBranch:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// router.get("/branches", (req, res) => {
//   db.query("SELECT branch FROM branches", (err, result) => {
//     if (err) {
//       console.error("Error fetching branches:", err);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//     const branches = result.map((row) => row.branch);
//     res.json(branches);
//   });
// });
router.get("/branches", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT branch FROM branches");
    const branches = rows.map((row) => row.branch);
    res.json(branches);
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
