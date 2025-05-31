const{createchat,chatitem}=require ('../models/Chats')
const { Dbconnection } = require("../config/connectionURI");



const chatController=async(req,res)=>{
    await Dbconnection()

    const chat= await chatitem.find()
    res.send(chat)




    




}


const postChatController=async(req,res)=>{

        
    const{username,chat,roomid}=req.body
if (!username || !chat || !roomid) {
    return res.status(400).send({ error: "All fields are required" });
}

    createchat(username, chat,roomid)



}



module.exports={chatController,postChatController}