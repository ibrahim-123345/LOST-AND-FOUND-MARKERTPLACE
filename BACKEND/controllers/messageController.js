// controllers/chatController.js
const ChatRoom = require('../models/chartRoom');
const Message= require('../models/messageSheme');
const { Dbconnection } = require("../config/connectionURI");



// @desc    Get all chats for a user
// @route   GET /api/chat/user/:userId
// @access  Private
const getUserChat = async (req, res) => {
  try {
    await Dbconnection()
    const chats = await ChatRoom.find({
      $or: [{ user1: req.params.userId }, { user2: req.params.userId }],
    })
      .populate('user1', 'name avatar')
      .populate('user2', 'name avatar')
      .sort({ lastMessageAt: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Get messages for a room
// @route   GET /api/chat/messages/:roomId
// @access  Private
const getMessage = async (req, res) => {
  try {
        await Dbconnection()

    const room = await ChatRoom.findOne({ roomId: req.params.roomId });

   

    const messages = await Message.find({ roomId: req.params.roomId })
      .sort({ timestamp: 1 });


      console.log("Messages fetched for room:", req.params.roomId, messages);

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Start or get existing chat
// @route   POST /api/chat/start
// @access  Private
const startChat = async (req, res) => {
      await Dbconnection()

  const { userId1, userId2 } = req.body;
  console.log(req.body);

  try {
    // Check if chat already exists
    let room = await ChatRoom.findOne({
      $or: [
        { user1: userId1.userId, user2: userId2.userId },
        { user1: userId2.userId, user2: userId1.userId },
      ],
    })
      .populate('user1', 'name avatar')
      .populate('user2', 'name avatar');

    if (!room) {
      const roomId = `${[userId1.userId, userId2.userId].sort().join('_')}`;
      
      room = new ChatRoom({
        roomId,
        user1: userId1.userId,
        user2: userId2.userId,
      });

      await room.save();
      
      // Populate user data
      room = await ChatRoom.findById(room._id)
        .populate('user1', 'name avatar')
        .populate('user2', 'name avatar');
    }

    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Send message
// @route   POST /api/chat/send
// @access  Private
const sendMessages = async (req, res) => {
  const { roomId, senderId, content } = req.body;
  console.log("sendMessages called with:", { roomId, senderId, content });

      await Dbconnection()


  try {
    const room = await ChatRoom.findOne({ roomId });
    //console.log(room)
    
    // Check if user is part of the room
    if (![room.user1.toString(), room.user2.toString()].includes(senderId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = new Message({
      roomId,
      senderId,
      content,
    });

    await message.save();

    // Update last message in room
    room.lastMessage = content;
    room.lastMessageAt = new Date();
    await room.save();

    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getUserChat,
  getMessage,
  startChat,
  sendMessages,
};