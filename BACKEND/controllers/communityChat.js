const {CreateChat,Chat} = require('../models/communityChat');  // Import the Chat model
const{Dbconnection}=require('../config/connectionURI');
const { chatitem ,createchat} = require('../models/Chats');

// Fetch all chat messages
const getMessages = async (req, res) => {
  try {
    // Fetch the latest chat document (you can adjust this as per your requirements)
    await Dbconnection();
    const chat = await chatitem.find(); // Get the most recent chat
    if (!chat) {
      return res.status(404).json({ message: 'No chat found.' });
    }

    res.status(200).json(chat); // Return all messages in the chat
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a new message to the chat
const sendMessage = async (req, res) => {
  try {
    
    const { _id, text, createdAt, user } = req.body;
    console.log(req.body)
    await Dbconnection()
    await createchat(_id,user,text,createdAt)
    res.status(201).json({ message: "chat inserted successfylly" });
   
   

 
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
