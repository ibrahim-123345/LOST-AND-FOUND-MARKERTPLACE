require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Dbconnection } = require("../config/connectionURI");
const { User ,Createnewuser} = require("../models/UserModels");
const { LostItem } = require("../models/losItem");
const { FoundItem } = require("../models/foundItem")
const secret = process.env.SECRET || "YOUR_SECRET";

const registerController = async (req, res) => {
  try {
    
    const { username,email, password,country,pinCode, }= req.body;
    console.log(username , password)



    const image = req.file
    ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    : null;

    await Dbconnection();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    Createnewuser(username,email, hashedPassword,country,pinCode,image,role="User")
    res.status(201).json({ message: "User successfully created" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error registering user"})
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

    const object = { userename: user.username, role: user.role ,status:user.status,id:user._id};
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
  const { idP,username, email, password,role } = req.body;


  try {
    await Dbconnection();
    const hashedPassword = await bcrypt.hash(password, 10)
    const update = await User.findOneAndUpdate({ _id: id }, { idP,username, email, password: hashedPassword ,role}, {
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

    res.status(200).json({ user }); 
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



const FindRegisteredUsers=async(req,res)=>{

  try {
    await Dbconnection();
    const usersRegistered = await User.find();
    res.status(200).json(usersRegistered); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }

}














const filterProfiles=async(req,res)=>{
  try {
    const { username } = req.body;
    await Dbconnection();
    const user = await User.find({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.profileImage);}

    catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });}
}













module.exports = { registerController,filterProfiles, loginController, UserToken,FindRegisteredUsers, deleteUser, userUpdate, passwordReset,userBasedonToken };
