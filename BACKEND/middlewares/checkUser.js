const bcrypt = require("bcrypt");
const { User } = require("../models/UserModels");
const {Dbconnection}=require('../config/connectionURI')

const checkUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    await Dbconnection();
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};




const checkUserForRegistration= async (req, res, next) => {
  try {
    const { username, password } = req.body;

    await Dbconnection();
    const user = await User.findOne({ username });

    if (!user) {
      next();
    }


    
    
      return res.status(401).json({ message: "use another username that is taken" });
   
   
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = { checkUser ,checkUserForRegistration};
