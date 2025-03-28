const mongoose = require("mongoose");
const { Dbconnection } = require("../config/connectionURI");
//const { default: Chat } = require("../../FRONTEND/sockets/src/Chat");

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    chat: {
      type: String,
      required: true,
    },
    roomid: {
        type: String,
        required: true,
      },
     
  },
  {
    timestamps: true,
  }
);

const chatitem = mongoose.model("chat", chatSchema);

const createchat = async (username, chat,roomid) => {
  try {
    await Dbconnection();
    const item = new chatitem({
      username,
      chat,
      roomid});
     
    await item.save();
    console.log("new item created successfully");
  } catch (e) {
    console.log(e);
  }
};


module.exports = { chatitem,createchat };
