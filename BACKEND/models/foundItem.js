const mongoose = require("mongoose");
const { Dbconnection } = require("../config/connectionURI");
const { User } = require("./UserModels");

const Schema = mongoose.Schema;

const foundItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dateFound: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["lost", "found"],
      default: "found",
    },
    image: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
      
    },
  },
  {
    timestamps: true,
  }
);

const FoundItem = mongoose.model("FoundItem", foundItemSchema);

const createFoundItem = async (
  name,
  description,
  dateFound,
  location,
  contactInfo,
  image,
  user
) => {
  try {
    await Dbconnection();
    const item = new FoundItem({
      name,
      description,
      dateFound,
      location,
      contactInfo,
      image,
      user,
    });
    await item.save();
    console.log("New found item created successfully");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { FoundItem, createFoundItem };
