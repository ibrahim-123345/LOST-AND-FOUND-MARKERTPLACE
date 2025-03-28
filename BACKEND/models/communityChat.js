const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Dbconnection = require("../config/connectionURI");
const{User}=require('./UserModels')
// Message Schema
const messageSchema = new Schema(
  {
    text: { type: String, required: true }, // Message content
    createdAt: { type: Date, default: Date.now }, // Timestamp when the message was sent
  }
);

// Chat Schema to store all messages
const chatSchema = new Schema(
  {
    messages: [messageSchema], // An array of messages
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

// Function to Create a Chat Message
const CreateChat = async (messages) => {
  try {
    await Dbconnection(); // Ensure DB connection (if necessary)

    const newChat = new Chat({ messages });
    await newChat.save();

    console.log("New chat message created successfully");
  } catch (error) {
    console.error("Error creating chat message:", error);
  }
};

module.exports = { Chat, CreateChat };
