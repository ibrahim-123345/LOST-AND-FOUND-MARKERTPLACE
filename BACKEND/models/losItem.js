const mongoose = require("mongoose");
const { Dbconnection } = require("../config/connectionURI");
const { User } = require("./UserModels");

const Schema = mongoose.Schema;

const lostItemSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dateLost: {
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
      default: "lost",
    },
    image: {
      type: String,
      required: false,
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

const LostItem = mongoose.model("LostItem", lostItemSchema);

const createLostItem = async (
  name,
  description,
  dateLost,
  location,
  contactInfo,
  image,
  user
) => {
  try {
    await Dbconnection();
    const item = new LostItem({
      name,
      description,
      dateLost,
      location,
      contactInfo,
      image,
      user 
    });
    await item.save();
    console.log("New lost item created successfully");
  } catch (e) {
    console.log(e);
  }
};

module.exports = { LostItem, createLostItem };
