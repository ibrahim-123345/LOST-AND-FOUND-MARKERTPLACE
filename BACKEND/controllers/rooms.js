const chatroom =require("../models/chartRoom")
const { Dbconnection } = require("../config/connectionURI");






const getAllRooms = async (req, res) => {
  try {
    await Dbconnection();
    const rooms = await chatroom.find().populate('user1', 'name avatar').populate('user2', 'name avatar');
    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}
 


const createRoom = async (req, res) => {
  const { user1, user2 } = req.body;

  if (!user1 || !user2) {
    return res.status(400).json({ message: 'Both users are required' });
  }

  try {
    await Dbconnection();
    const newRoom = new chatroom({ user1, user2 });
    await newRoom.save();
    res.status(201).json(newRoom);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}



const updateRoom = async (req, res) => {
  const { roomId, user1, user2 } = req.body;

  if (!roomId || !user1 || !user2) {
    return res.status(400).json({ message: 'Room ID and both users are required' });
  }

  try {
    await Dbconnection();
    const updatedRoom = await chatroom.findByIdAndUpdate(
      roomId,
      { user1, user2 },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(updatedRoom);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}



const deleteRoom = async (req, res) => {
  const { roomId } = req.body;

  if (!roomId) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  try {
    await Dbconnection();
    const deletedRoom = await chatroom.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ message: 'Room deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}



const getRoomById = async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ message: 'Room ID is required' });
  }

  try {
    await Dbconnection();
    const room = await chatroom.find({roomId:roomId}).populate('user1', 'username profileImage').populate('user2', 'username profileImage');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    //console.log(room);

    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
}




module.exports = {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomById
};