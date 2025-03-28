const mongoose = require("mongoose");

 require("dotenv").config();

const connec = process.env.DB_URI||'mongodb://127.0.0.1:27017/User';

const Dbconnection = async () => {
  try {
    await mongoose.connect(connec);

    const conn = mongoose.connection;

    if (conn.on) console.log("connection exists");
  } catch (e) {
    console.log("error in database connection");
  }
};



module.exports = { Dbconnection};
