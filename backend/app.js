const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
var cors = require("cors");
const morgan=require('morgan');
const port = 4444;
const initialiseDatabaseRoutes = require("./routes/initialiseDatabase");
const seatMatrixRoutes = require("./routes/seatMatrix");
const roundsRoutes = require("./routes/rounds");
const searchCandidatesRoutes = require("./routes/searchCandidates");
const manualUpdate = require("./routes/manualUpdate");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const { initializeUsersTable } = require("./utils/initialiseUsers"); // Import the function
const { initializeBranchTable } = require("./utils/initialiseBranch");
const bcrypt = require("bcrypt");
const adminCheckRoutes = require("./routes/adminCheckRoutes");
const authenticationRouter = require("./routes/authenticationRouter");
const addBranchRoute = require("./routes/addBranchRoute");
const deleteBranchRoute = require("./routes/deleteBranchRoute");
const connection = require("./config/dbConfig");


require("dotenv").config();
app.use(morgan('dev'))
// app.use(cors());

// app.use(
//   cors({
//     origin: [process.env.NODE_ENV !== "production" && process.env.BACKEND_URL],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
// app.use((req, res, next) => {
//   console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
//   // Log headers
//   console.log('Headers:', req.headers);
  
//   // Log query parameters
//   console.log('Query Parameters:', req.query);
  
//   // Log request body (requires body parsing middleware, like express.json())
//   console.log('Body:', req.body);
  
//   // Proceed to the next middleware or route handler
//   next();
// });

(async () => {
  try {
    const user = process.env.ADMIN_USER;
    const plainPassword = process.env.ADMIN_PASSWORD;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);
    // connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE}`, function (error, results, fields) {
    //   // if (error) throw error;
    //   console.log('Database created or already exists.');
    //   // console.log(process.env.MYSQL_DATABASE);
    // });
    // connection.query(`USE ${process.env.MYSQL_DATABASE}`, function (error, results, fields) {
    //   if (error) {
    //     console.error('Error selecting database:', error.message);
    //   } else {
    //     console.log(`Successfully selected the database '${process.env.MYSQL_DATABASE}'.`);
    //   }});
    // // console.log(`Database '${process.env.MYSQL_DATABASE}' selected.`);
    
    await initializeBranchTable(process.env.MYSQL_DATABASE, [["admin"]]);
    await initializeUsersTable(process.env.MYSQL_DATABASE, [
      [1, user, hashedPassword, "admin", true],
    ]);
  } catch (error) {
    console.error("Error initializing users table:", error);
  }
})();

app.use("/api/initialise", initialiseDatabaseRoutes);
app.use("/api/seatMatrix", seatMatrixRoutes);
app.use("/api/rounds", roundsRoutes);
app.use("/api/search", searchCandidatesRoutes);
app.use("/api/candidate", manualUpdate);
app.use("/admin", adminRoutes);
app.use("/api/admin", adminCheckRoutes);
app.use("/api", authenticationRouter);
app.use("/api/branch", addBranchRoute);
app.use("/admin/deleteBranch", deleteBranchRoute);

// Apply authentication middleware to all routes except authRoutes
// app.use((req, res, next) => {
//   if (req.path.startsWith("/auth")) {
//     // Skip authentication for authRoutes
//     next();
//   } else {
//     authMiddleware(req, res, next);
//   }
// });

// app.use(function (request, response, next) {
//   response.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   response.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// // CORS preflight handling for specific route
// app.options("/api/initialise/getMasterFileUploadStatus", (req, res) => {
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With, Content-Type"
//   );
//   res.sendStatus(200);
// });
// app.use("/api/initialise", initialiseDatabaseRoutes);
// app.use("/api/seatMatrix", seatMatrixRoutes);
// app.use("/api/rounds", roundsRoutes);
// app.use("/api/search", searchCandidatesRoutes);
// app.use("/api/candidate", manualUpdate);

app.use("/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  console.log("hello");
  res.send("Home page of Mtech Application site!");
});

app.listen(port, () => {
  // console.log("---------------------------------")
  // console.log(process.env.MYSQL_ROOT_PASSWORD);
  // console.log(process.env.MYSQL_DATABASE);
  // console.log(process.env.MYSQL_PASSWORD);
  // console.log(process.env.MYSQL_HOSTNAME);
  // console.log("---------------------------------")

  console.log(`Example app listening on port ${port}`);
});
