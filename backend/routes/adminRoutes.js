const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const connection = require("../config/dbConfig");
const { createTable } = require("../utils/sqlqueries");

// router.post("/register", (req, res) => {
//   const { username, password, branch } = req.body;

//   // Hash the password
//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//       res.status(500).json({ error: "Internal server error" });
//     } else {
//       const newUser = { username, password: hashedPassword, branch };
//       const query = "INSERT INTO users SET ?";
//       connection.query(query, newUser, (error, results) => {
//         if (error) {
//           if (error.code === "ER_DUP_ENTRY") {
//             // Send specific error message to frontend
//             res.status(400).json({ error: "Duplicate entry for username" });
//           } else {
//             // Handle other errors
//             // console.log("the error is: ", error);
//             res.status(500).json({ error: "Internal server error" });
//           }
//         } else {
//           // console.log("user");
//           res.status(201).json({ message: "User created successfully" });
//         }
//       });
//     }
//   });
// });
router.post("/register", (req, res) => {
  const { username, password, branch } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      try {
        const newUser = { username, password: hashedPassword, branch };
        const query = "INSERT INTO users SET ?";
        await connection.query(query, newUser);

        res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.status(400).json({ error: "Duplicate entry for username" });
        } else {
          console.error("Error during registration:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      }
    }
  });
});


// Get all users
// router.get("/users", (req, res) => {
//   const query = "SELECT * FROM users";
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error("Error fetching users:", error);
//       res.status(500).json({ error: "Internal server error" });
//     } else {
//       res.status(200).json(results);
//     }
//   });
// });

router.get("/users", async (req, res) => {
  const query = "SELECT * FROM users";
  try {
    const [results] = await connection.query(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Delete a user by ID
// router.delete("/users/:id", (req, res) => {
//   const userId = req.params.id;
//   const query = "DELETE FROM users WHERE id = ?";
//   connection.query(query, userId, (error, results) => {
//     if (error) {
//       console.error("Error deleting user:", error);
//       res.status(500).json({ error: "Internal server error" });
//     } else {
//       if (results.affectedRows > 0) {
//         // console.log(`User deleted`);
//         res.status(200).json({ message: "User deleted successfully" });
//       } else {
//         res.status(404).json({ error: "User not found" });
//       }
//     }
//   });
// });

router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const query = "DELETE FROM users WHERE id = ?";
  
  try {
    const [results] = await connection.query(query, [userId]);
    
    if (results.affectedRows > 0) {
      // console.log(`User deleted`);
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update user password
// router.put("/users/:id/password", (req, res) => {
//   const userId = req.params.id;
//   const { newPassword } = req.body;

//   // Hash the new password
//   bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
//     if (err) {
//       res.status(500).json({ error: "Internal server error" });
//     } else {
//       const query = "UPDATE users SET password = ? WHERE id = ?";
//       connection.query(query, [hashedPassword, userId], (error, results) => {
//         if (error) {
//           console.error("Error updating user password:", error);
//           res.status(500).json({ error: "Internal server error" });
//         } else {
//           if (results.affectedRows > 0) {
//             // console.log(`User password updated`);
//             res
//               .status(200)
//               .json({ message: "User password updated successfully" });
//           } else {
//             res.status(404).json({ error: "User not found" });
//           }
//         }
//       });
//     }
//   });
// });

router.put("/users/:id/password", (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  // Hash the new password
  bcrypt.hash(newPassword, 10, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Internal server error" });
    }

    const query = "UPDATE users SET password = ? WHERE id = ?";
    
    try {
      const [results] = await connection.query(query, [hashedPassword, userId]);

      if (results.affectedRows > 0) {
        res.status(200).json({ message: "User password updated successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error("Error updating user password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
});

module.exports = router;
