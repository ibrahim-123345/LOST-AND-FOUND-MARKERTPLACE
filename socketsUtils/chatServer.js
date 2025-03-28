const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const{createchat,chatitem}=require('../BACKEND/models/Chats')
const{Dbconnection}=require("../BACKEND/config/connectionURI")

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    //socket.to(data.room).emit("receive_message", data);
    console.log(data)
    const{room,author,message,time}=data
    createchat(author,message,room)
    const retrieveChats=async()=>{
      await Dbconnection();
      const result= await chatitem.find({roomid:room})
      
     
      result.forEach(data=>{
      
        socket.to(data.roomid).emit("receive_message", data);
      })
        
    
    }
     

    retrieveChats()
    console.log('success')

  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

server.listen(8000, () => {
  console.log("SERVER RUNNING");
});




