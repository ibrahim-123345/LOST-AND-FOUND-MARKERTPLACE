const express = require("express");
const { checkUser } = require("./middlewares/checkUser");
const dotenv = require("dotenv");
const cors=require('cors')
const path = require('path');



const {
  registerController,
  loginController,UserToken,passwordReset,
  deleteUser,userUpdate,
  userBasedonToken,
} = require("./controllers/authcontroller");
const {
  lostItemController,lostItem,lostItemId,itemLostByUser,
  deleteLostItem,lostItems,
  LostItemUpddate,
} = require("./controllers/lostItem");



const{foundItemController,itemFoundByUser,
  foundItemUpdate,foundItemLimit,foundItems,singleFound
  ,deleteFound
}=require('./controllers/founItem')
const { getMessages, sendMessage } = require('./controllers/communityChat');


const{upload}=require('./controllers/imagehandler')

const { verfyToken } = require("./middlewares/virifyToken");
const{checkRoles}=require('./middlewares/checkRoles')
const { chatController ,postChatController} = require("./controllers/chatController");
const router = express.Router();


const app = express();
app.use(cors())
const port = process.env.PORT ||7000;

// Middleware
app.use(express.json());
app.use(express.static('public'))
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
app.delete("/user/delete/:id", verfyToken,checkRoles(["Admin"]), deleteUser);
app.patch("/user/update/:id", verfyToken,checkRoles(["Admin","User"]), userUpdate);
app.post("/password/reset", verfyToken,checkRoles(["Admin","User"]) ,passwordReset);
app.get("/user/getuserBasedonToken",verfyToken,checkRoles(["Admin","User"]),userBasedonToken)



//lost item crud
app.get("/lostItems",verfyToken,checkRoles(["Admin","User"]),lostItem);//this endpoint have limit
app.get("/lostItem/:id",verfyToken,checkRoles(["Admin","User"]),lostItemId);//this endpoint to specific based input id

app.get("/lostItem",verfyToken,lostItems);//this endpoint have no limit it displays all losts item reported

app.post("/post/lostItem",verfyToken,checkRoles(["Admin","User"]),upload.single('image') ,lostItemController);

app.delete("/lost/delete/:id",checkRoles(["Admin","User"]), deleteLostItem);

app.patch("/lost/update/:id",checkRoles(["Admin","User"]), LostItemUpddate);
app.get("/lostItemsByUser/:id",verfyToken,checkRoles(["Admin","User"]),itemLostByUser)





app.post("/foundItems",verfyToken,checkRoles(["Admin","User"]),upload.single('image'), foundItemController);
app.get("/foundItems", foundItems);
app.get("/foundItem",foundItemLimit);
app.get("/foundItemsByUser/:id",verfyToken,checkRoles(["Admin","User"]),itemFoundByUser)



app.get("/foundone/:id", verfyToken,checkRoles(["Admin","User"]),singleFound);

app.delete("/found/delete/:id",verfyToken,checkRoles(["Admin","User"]), deleteFound);

app.patch("/found/update/:id", verfyToken,checkRoles(["Admin","User"]),foundItemUpdate);

app.post("/post/chats",verfyToken,checkRoles(["Admin","User"]), postChatController);
app.get("/User/chats",verfyToken,checkRoles(["Admin","User"]), chatController);


app.get('/chat/messages',verfyToken,checkRoles(["Admin","User"]), getMessages);
app.post('/chat/messages',verfyToken,checkRoles(["Admin","User"]), sendMessage);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




