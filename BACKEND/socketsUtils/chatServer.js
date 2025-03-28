const {Server} = require('socket.io');
const Http = require('http');
const app=require('express')
const cors=require('cors')
app.request(cors())


const httpserver=Http.createServer(app);
const io=new Server(httpserver,{
    cors:{
        origin:"http://localhost:8000",
        methods:["GET","POST"]

    }
});




httpserver.listen(5173,()=>{
    console.log('we got a socket running at 5115')
})


io.on(
    "connection",(mysocket)=>{
        console.log('connected',mysocket.id)
    }
)







