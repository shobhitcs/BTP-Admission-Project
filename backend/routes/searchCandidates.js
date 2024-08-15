const router = require("express").Router();
const mysql = require("mysql2");
const isAuthenticated = require("../middleware/authMiddleware");

router.get("/getCoapIds", isAuthenticated, async (req, res) => {
  // console.log("csearch wala request", req.user);
  // console.log("csearch wala request branch", req.user.branch);
  const branch = req.user.branch;

  try {
    var con = mysql
      .createPool({
        // host: process.env.MYSQL_HOSTNAME,
        host: process.env.MYSQL_HOST_IP || "127.0.0.1",
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        debug: false,
        insecureAuth: true,
      })
      .promise();
    const [coapIdsList] = await con.query(
      `SELECT COAP as label FROM mtechappl WHERE branch = '${branch}'`
    );

    res.status(200).send({ result: coapIdsList });
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: "Internal Server Error" });
  }
});

router.post("/getinfo", isAuthenticated, async (req, res) => {
  // console.log("req.user.branch is :", req.user.branch);
  try {
    var con = mysql
      .createPool({
        // host: process.env.MYSQL_HOSTNAME,
        host: process.env.MYSQL_HOST_IP || "127.0.0.1",
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        debug: false,
        insecureAuth: true,
      })
      .promise();
    const { category, gender, coapId } = req.body;

    const filteredCategory = category ? category.label : "\\w*";
    const filteredGender = gender ? gender.label : "\\w*";
    const filteredCoapId = coapId ? coapId.label : "\\w*";

    const [filteredList] = await con.query(`
      SELECT COAP as coap, gender, Category as category,
      maxgatescore, ews, pwd, AppNo as appno
      FROM mtechappl
      WHERE branch = '${req.user.branch}'
      AND category REGEXP '${filteredCategory}' 
      AND COAP REGEXP '${filteredCoapId}' 
      AND gender REGEXP '${filteredGender}'
      ORDER BY maxGateScore DESC
      LIMIT 50
    `);

    res.status(200).send({ result: filteredList });
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: "Internal Server Error" });
  }
});

router.get("/getinfo/:coapid", isAuthenticated, async (req, res) => {
  try {
    var con = mysql
      .createPool({
        // host: process.env.MYSQL_HOSTNAME,
        host: process.env.MYSQL_HOST_IP || "127.0.0.1",
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        debug: false,
        insecureAuth: true,
      })
      .promise();
    const coapid = req.params.coapid;

    const [filteredList] = await con.query(`
      SELECT FullName, AppNo AS ApplicationNumber, mtechappl.COAP, Email, MaxGateScore, Gender, Category,
      EWS, PWD, Adm, SSCper, HSSCper, DegreeCGPA8thSem,
      Offered, Accepted, OfferCat, IsOfferPwd, OfferedRound,
      RetainRound, RejectOrAcceptRound
      FROM mtechappl
      LEFT JOIN applicationstatus
      ON mtechappl.COAP = applicationstatus.COAP
      WHERE mtechappl.COAP ='${coapid}' AND mtechappl.branch = '${req.user.branch}'
    `);

    res.status(200).send({ result: filteredList });
  } catch (error) {
    console.error(error);
    res.status(500).send({ result: "Internal Server Error" });
  }
});

module.exports = router;
