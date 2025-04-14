const jwt = require('jsonwebtoken');
const { User }= require('../models/UserModels');
const { Dbconnection } = require('../config/connectionURI');

const checkingStatus = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "YOUR_SECRET");
    const {object:{userename}} = decoded;
    
    
    // Find user by ID from decoded token
    await Dbconnection();
    const user = await User.findOne({username:userename})
   
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });

    }
    
    if (user.status==='Blocked') {
      return res.status(403).json({ 
        error: 'Account blocked. Contact support for assistance.',
        blocked: true
      });
    }

    // Attach fresh user data to request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please login again' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }
    next(error);
  }
};

module.exports = {checkingStatus};