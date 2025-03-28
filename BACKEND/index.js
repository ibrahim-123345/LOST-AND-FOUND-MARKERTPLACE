const express = require("express");
const { checkUser } = require("./middlewares/checkUser");
const dotenv = require("dotenv");
const cors=require('cors')
const path = require('path');



const {
  registerController,
  loginController,UserToken
} = require("./controllers/authcontroller");
const {
  lostItemController,lostItem,lostItemId,
  deleteLostItem,lostItems,
  LostItemUpddate,
} = require("./controllers/lostItem");

//const{matchLostAndFound}=require('./utilities/matchingSystem')

const{foundItemController,
  foundItemUpdate,foundItemLimit,foundItems,singleFound
  ,deleteFound
}=require('./controllers/founItem')
const { getMessages, sendMessage } = require('./controllers/communityChat');


const{upload}=require('./controllers/imagehandler')

const { verfyToken } = require("./middlewares/virifyToken");
const { chatController ,postChatController} = require("./controllers/chatController");
const router = express.Router();


const app = express();
app.use(cors())
const port = process.env.PORT ||7000;

// Middleware
app.use(express.json());
app.use(express.static('public'))

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get("/", verfyToken, (req, res) => {
  res.send(
    "Welcome to the Lost and Found Marketplace API " + req.user.username
  );
});

app.post("/auth/createUser", registerController);

app.post("/auth/login", checkUser, loginController);
app.post("/userToken", verfyToken, UserToken);




//lost item crud
app.get("/lostItems",verfyToken,lostItem);//this endpoint have limit
app.get("/lostItem/:id",verfyToken,lostItemId);//this endpoint to specific based input id

app.get("/lostItem",lostItems);//this endpoint have no limit it displays all losts item reported

app.post("/post/lostItem",verfyToken,upload.single('image') ,lostItemController);

app.delete("/lost/delete/:id", deleteLostItem);

app.patch("/lost/update/:id", LostItemUpddate);


//found item crud

app.post("/foundItems",verfyToken,upload.single('image'), foundItemController);
app.get("/foundItems",verfyToken, foundItems);
app.get("/foundItem",foundItemLimit);



app.get("/foundone/:id", verfyToken,singleFound);

app.delete("/found/delete/:id",verfyToken, deleteFound);

app.patch("/found/update/:id", verfyToken,foundItemUpdate);

app.post("/post/chats",verfyToken, postChatController);
app.get("/User/chats",verfyToken, chatController);


app.get('/chat/messages',verfyToken, getMessages);
app.post('/chat/messages',verfyToken, sendMessage);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




