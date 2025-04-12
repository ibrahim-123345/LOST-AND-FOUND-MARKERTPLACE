const mongoose = require("mongoose");

 require("dotenv").config();

const connec = process.env.DB_URI||'mongodb://localhost:27017/User';

const Dbconnection = async () => {
  try {
    await mongoose.connect(connec);

    const conn = mongoose.connection;

    
  } catch (e) {
    console.log("error in database connection");
  }
};





module.exports = { Dbconnection};
