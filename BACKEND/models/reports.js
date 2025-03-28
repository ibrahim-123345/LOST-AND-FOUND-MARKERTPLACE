const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const{User}=require('./UserModels')
// Report Schema for storing user-submitted reports
const reportSchema = new Schema(
  {
    report: { type: String, required: true }, // Text description of the reported issue
    createdAt: { type: Date, default: Date.now }, // Timestamp when the report was created
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
