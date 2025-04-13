const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {Dbconnection}=require("../config/connectionURI")

const reportSchema = new Schema(
  {
    report: { type: String, required: true }, 
    username:{type:String,required:true},
    createdAt: { type: Date, default: Date.now }, 
  },
  { timestamps: true }
);


const Report = mongoose.model("Report", reportSchema);


const createReport = async (report,username,time) => {
  try {
    await Dbconnection();
    const item = new Report({
      report,
      username,
      time});
     
    await item.save();
    console.log("new Report created successfully");
  } catch (e) {
    console.log(e);
  }
};





module.exports = {Report,createReport};
