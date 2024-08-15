const express = require("express");
const router = express.Router();
const db = require("../config/dbConfig");
const { branchSchema } = require("../schemas/branchesSchema");

router.delete("/:branchName", (req, res) => {
  const branchName = req.params.branchName;

  // Delete the branch and its associated users from the database
  const deleteBranchQuery = "DELETE FROM branches WHERE branch = ?";
  const deleteUsersQuery = "DELETE FROM users WHERE branch = ?";

  db.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res
        .status(500)
        .json({ error: "Failed to delete branch and users." });
    }

    // Delete the branch
    db.query(deleteBranchQuery, branchName, (err, result) => {
      if (err) {
        db.rollback(() => {
          console.error("Error deleting branch:", err);
          res.status(500).json({ error: "Failed to delete branch." });
        });
      } else {
        // Delete the users associated with the branch
        db.query(deleteUsersQuery, branchName, (err, result) => {
          if (err) {
            db.rollback(() => {
              console.error("Error deleting users:", err);
              res.status(500).json({ error: "Failed to delete users." });
            });
          } else {
            // Commit the transaction if both deletions are successful
            db.commit((err) => {
              if (err) {
                db.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res
                    .status(500)
                    .json({ error: "Failed to delete branch and users." });
                });
              } else {
                // console.log("Branch and users deleted:", branchName);
                res.sendStatus(200);
              }
            });
          }
        });
      }
    });
  });
});

module.exports = router;
