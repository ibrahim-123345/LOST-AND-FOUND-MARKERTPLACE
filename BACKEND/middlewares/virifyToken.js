const jwt = require("jsonwebtoken");
const secret = process.env.SECRET || "YOUR_SECRET";

const verfyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ message: "No token provided, please log in." });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = {
      
      username: decoded.object.userename, 
      role: decoded.object.role, 
    };
    console.log(req.user)
 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Token is invalid or expired." });
  }
};

module.exports = { verfyToken };
