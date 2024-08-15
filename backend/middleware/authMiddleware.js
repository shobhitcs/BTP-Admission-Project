// middleware/authMiddleware.js

const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  // Check if JWT token exists in the request cookies
  const token = req.cookies.jwtToken;
  // console.log("tokenee: ", token);

  // If token does not exist, send unauthorized response
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decoded: ", decoded);
    // If token is valid, set user information in request object
    req.user = decoded;
    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // If token is invalid, send unauthorized response
    console.error("Error verifying JWT token:", error.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
