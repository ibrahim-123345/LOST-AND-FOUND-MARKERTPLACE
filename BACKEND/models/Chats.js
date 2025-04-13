const mongoose = require("mongoose");
const { Dbconnection } = require("../config/connectionURI");
//const { default: Chat } = require("../../FRONTEND/sockets/src/Chat");

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {

    chatid: {
      type: Number,
      required: true,
    },
   
    username: {
      type: String,
      required: true,
      default:"anonymous"
    },
    text: {
      type: String,
      required: true,
    },

    time:{

      type: String,
      default: Date.now,
    }
   
  },
  {
    timestamps: true,
  }
);

const chatitem = mongoose.model("chat", chatSchema);

const createchat = async (chatid,username,text,time) => {
  try {
    await Dbconnection();
    const item = new chatitem({
      chatid,
      username,
      text,
      time});
     
    await item.save();
    console.log("new chat created successfully");
  } catch (e) {
    console.log(e);
  }
};


module.exports = { chatitem,createchat };
