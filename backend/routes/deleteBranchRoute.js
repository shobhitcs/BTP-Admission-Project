const express = require("express");
const router = express.Router();
const db = require("../config/dbConfig");
const { branchSchema } = require("../schemas/branchesSchema");

// router.delete("/:branchName", (req, res) => {
//   const branchName = req.params.branchName;

//   // Delete the branch and its associated users from the database
//   const deleteBranchQuery = "DELETE FROM branches WHERE branch = ?";
//   const deleteUsersQuery = "DELETE FROM users WHERE branch = ?";

//   db.beginTransaction((err) => {
//     if (err) {
//       console.error("Error beginning transaction:", err);
//       return res
//         .status(500)
//         .json({ error: "Failed to delete branch and users." });
//     }

//     // Delete the branch
//     db.query(deleteBranchQuery, branchName, (err, result) => {
//       if (err) {
//         db.rollback(() => {
//           console.error("Error deleting branch:", err);
//           res.status(500).json({ error: "Failed to delete branch." });
//         });
//       } else {
//         // Delete the users associated with the branch
//         db.query(deleteUsersQuery, branchName, (err, result) => {
//           if (err) {
//             db.rollback(() => {
//               console.error("Error deleting users:", err);
//               res.status(500).json({ error: "Failed to delete users." });
//             });
//           } else {
//             // Commit the transaction if both deletions are successful
//             db.commit((err) => {
//               if (err) {
//                 db.rollback(() => {
//                   console.error("Error committing transaction:", err);
//                   res
//                     .status(500)
//                     .json({ error: "Failed to delete branch and users." });
//                 });
//               } else {
//                 // console.log("Branch and users deleted:", branchName);
//                 res.sendStatus(200);
//               }
//             });
//           }
//         });
//       }
//     });
//   });
// });

router.delete("/:branchName", async (req, res) => {
  const branchName = req.params.branchName;

  const connection = await db.getConnection(); // get a connection from the pool

  try {
    await connection.beginTransaction();

    // Delete from branches
    await connection.query("DELETE FROM branches WHERE branch = ?", [branchName]);

    // Delete from users
    await connection.query("DELETE FROM users WHERE branch = ?", [branchName]);

    await connection.commit();
    res.sendStatus(200);
  } catch (err) {
    await connection.rollback();
    console.error("Transaction error:", err);
    res.status(500).json({ error: "Failed to delete branch and users." });
  } finally {
    connection.release(); // release the connection back to the pool
  }
});


module.exports = router;
