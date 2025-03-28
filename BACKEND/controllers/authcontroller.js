require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const { Dbconnection } = require("../config/connectionURI");
const { User } = require("../models/UserModels");
const { LostItem } = require("../models/losItem");
const {FoundItem} =require("../models/foundItem")

const registerController = async (req, res) => {
  try {
    const { username, email, password ,user} = req.body;

    await Dbconnection(); 

    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, 
      user
    });

    await newUser.save();
    res.status(201).json({ message: "User successfully created" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body; 

    const secret = process.env.SECRET || "YOUR_SECRET";

    await Dbconnection();

    const user = await User.findOne({ username });
    
    const object={userename:user.username,role:user.role}
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

 
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwttoken = jwt.sign({ object }, secret, { expiresIn: "10m" });
    const userename=jwt.decode(jwttoken)

    return res.status(200).json({ message: "Login successful", token: jwttoken,user:userename });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
};





const UserToken = async (req, res) => {
  try {
    const { userename, role } = req.body; 
    console.log(userename,role)

    

    await Dbconnection();

    const user = await User.findOne({username:userename});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const postLost=await LostItem.find({user:user._id})
    console.log(postLost)
    const postFound=await FoundItem.find({user:user._id})
    console.log(postFound)
    
    
   

    res.status(200).json(user,postFound,postLost);







 
  }

  catch(err){



      
  }

}

module.exports = { registerController, loginController,UserToken };
