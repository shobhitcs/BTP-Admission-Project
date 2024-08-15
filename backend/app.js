const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
var cors = require("cors");
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

require("dotenv").config();
// app.use(cors());

app.use(
  cors({
    origin: [process.env.NODE_ENV !== "production" && process.env.BACKEND_URL],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
// app.use(
//   cors({
//     origin: [process.env.NODE_ENV !== "production" && "http://localhost:8004"],
//     credentials: true,
//   })
// );

(async () => {
  try {
    const user = process.env.ADMIN_USER;
    const plainPassword = process.env.ADMIN_PASSWORD;
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(plainPassword, salt);
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
  res.send("Home page of Mtech Application site!");
});

app.listen(port, () => {
  console.log(process.env.MYSQL_ROOT_PASSWORD);
  console.log(process.env.MYSQL_DATABASE);
  console.log(process.env.MYSQL_PASSWORD);
  console.log(process.env.MYSQL_HOSTNAME);

  console.log(`Example app listening on port ${port}`);
});
