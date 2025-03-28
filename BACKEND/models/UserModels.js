const mongoose = require("mongoose");

const { Dbconnection } = require("../config/connectionURI");

require("dotenv").config();

//Userschema

const Userschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
  }, 
  role: {
    type: String,
    enum: ["Admin", "User"],
    default: "Admin"},



  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", Userschema);

const Createnewuser = async (username, email, password, user) => {
  try {
    await Dbconnection();
    const newUser = new User({ username, email, password, user });
    await newUser.save();
    console.log("new user created successfully");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { Createnewuser, User };
