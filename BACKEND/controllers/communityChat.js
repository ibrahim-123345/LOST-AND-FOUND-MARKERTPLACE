const {CreateChat,Chat} = require('../models/communityChat');  // Import the Chat model
const{Dbconnection}=require('../config/connectionURI')

// Fetch all chat messages
const getMessages = async (req, res) => {
  try {
    // Fetch the latest chat document (you can adjust this as per your requirements)
    await Dbconnection();
    const chat = await Chat.find().sort({ createdAt: -1 }); // Get the most recent chat
    if (!chat) {
      return res.status(404).json({ message: 'No chat found.' });
    }

    res.status(200).json(chat.messages); // Return all messages in the chat
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a new message to the chat
const sendMessage = async (req, res) => {
  try {
    const { text } = req.body; // Destructure the message text from the request body

    // Validate that the message is not empty
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Message cannot be empty.' });
    }

    // Create a new message object
    const newMessage = {
      text: text,
      createdAt: new Date(),
    };

    // Check if there's an existing chat (if none, create a new one)
    await Dbconnection();
    let chat = await Chat.findOne();
    if (!chat) {
      // If no chat exists, create a new chat document
      chat = new Chat({
        messages: [newMessage],
      });
      await chat.save();
    } else {
      // If a chat exists, add the new message to the existing chat
      chat.messages.push(newMessage);
      await chat.save();
    }

    res.status(201).json({ message: 'Message sent successfully!', newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
