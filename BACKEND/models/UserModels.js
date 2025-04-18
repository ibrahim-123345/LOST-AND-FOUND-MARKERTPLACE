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
    default:"mrope@gmail.com"
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
    default:"ibra@123"
  }, 
  country: {
    type: String,
    required: true,
    default:"Tanzania",
    },

  pinCode: {
      type: String,
      required: true,
      default:"67789H"
      },

  profileImage: {
    type: String,
    default: "default.jpg",
  },

    
  role: {
    type: String,
    enum: ["User", "admin"],
    default: "User",
  },
   



  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", Userschema);

const Createnewuser = async (username, email, password,country,pinCode,profileImage, role) => {
  try {
    await Dbconnection();
    const newUser = new User({ username, email, password,country,pinCode,profileImage, role});
    await newUser.save();
    console.log("new user created successfully");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { Createnewuser, User };
