require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Dbconnection } = require("../config/connectionURI");
const { User } = require("../models/UserModels");
const { LostItem } = require("../models/losItem");
const { FoundItem } = require("../models/foundItem")
const secret = process.env.SECRET || "YOUR_SECRET";

const registerController = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    await Dbconnection();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();
    res.status(201).json({ message: "User successfully created" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


const deleteUser = async (req, res) => {

  try {
    const { id } = req.params;

    await Dbconnection();

    const user = await User.findOne({ _id: id });
    if (user) {

      await User.deleteOne({ _id: id });
      return res.status(201).json({ message: " Admin deleted User" });
    }


    res.status(404).json({ message: " User not found" });


  }

  catch (err) {
    res.status(500).json({ message: " Server error", error: error.message });

  }

}

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    await Dbconnection();

    const user = await User.findOne({ username });

    const object = { userename: user.username, role: user.role }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwttoken = jwt.sign({ object }, secret, { expiresIn: "1w" });
    const userename = jwt.decode(jwttoken)


    return res.status(200).json({ message: "Login successful", token: jwttoken, user: userename });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error: error.message });
  }
};





const UserToken = async (req, res) => {
  try {
    const { userename, role } = req.body;

    await Dbconnection();

    const user = await User.findOne({ username: userename });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    const postLost = await LostItem.find({ user: user._id })
    console.log(postLost)
    const postFound = await FoundItem.find({ user: user._id })
    console.log(postFound)

    res.status(200).json(user, postFound, postLost);

  }

  catch (error) {
    res.status(500).json({ message: " Server error", error: error.message });


  }

}


const userUpdate = async (req, res) => {

  const { id } = req.params;
  const { username, email, password } = req.body;


  try {
    await Dbconnection();
    const hashedPassword = await bcrypt.hash(password, 10)
    const update = await User.findOneAndUpdate({ _id: id }, { username, email, password: hashedPassword }, {
      new: true,
    });

    if (!update) {
      return res.status(404).send(" User was not found");
    }

    res.status(200).send({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

const passwordReset = async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await Dbconnection();
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect old password" });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);


    user.password = newHashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });

  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
const userBasedonToken = async (req, res) => {
  try {
    // Check if authorization header exists
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const decoded = jwt.verify(token, secret);
    
   
    const { object: { userename } } = decoded; 
    
    await Dbconnection();
    const user = await User.find({ username:userename }); 
    
    if (!user) {
      console.log(userename)
      return res.status(404).json({ message: "User not found" });
      
    }

    res.status(200).json({ message: "User found", user }); 
  } catch (err) {
    console.error(err); 
    
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }
    
    res.status(500).json({ 
      message: "An error occurred",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
};

module.exports = { registerController, loginController, UserToken, deleteUser, userUpdate, passwordReset,userBasedonToken };
