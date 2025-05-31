const express = require("express");
const { checkUser, checkUserForRegistration } = require("./middlewares/checkUser");
const dotenv = require("dotenv");
const cors=require('cors')
const path = require('path');



const {
  createMatch,
  getAllMatches,
  getMatchById,
  updateMatch,
  deleteMatch
} = require('./controllers/matchUtility');

const {getUserProfile}=require('./controllers/profile')

const { startChat,getMessage,getUserChat,sendMessages } = require('./controllers/messageController');



const {
  registerController,
  loginController,UserToken,passwordReset,
  deleteUser,userUpdate,
  userBasedonToken,
  FindRegisteredUsers,filterProfiles
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
const{checkingStatus}=require("./middlewares/checkingBlockedUser")
const{checkRoles}=require('./middlewares/checkRoles')
const { chatController ,postChatController} = require("./controllers/chatController");
const { getReports ,createReportHandler} = require("./controllers/reports");
const { sendFoundItemNotification, sendFoundItemNotificationController } = require("./controllers/email");
const { getRoomById } = require("./controllers/rooms");




const app = express();
app.use(cors({origin:'*'}))
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

app.post("/auth/createUser",upload.single('Image'),checkUserForRegistration,registerController);

app.post("/auth/login",checkUser, loginController);
app.post("/userToken",verfyToken, checkingStatus, UserToken);
app.delete("/user/delete/:id", verfyToken,checkRoles(["Admin"]), deleteUser);
app.patch("/user/update/:id",verfyToken, checkingStatus,checkRoles(["Admin","User"]), userUpdate);
app.post("/password/reset",verfyToken, checkingStatus,checkRoles(["Admin","User"]) ,passwordReset);
app.get("/user/getuserBasedonToken",verfyToken, checkingStatus,checkRoles(["Admin","User"]),userBasedonToken)
app.get("/user/Getuser",verfyToken,checkRoles(["Admin","User"]),FindRegisteredUsers)
app.post("/user/Getuser",verfyToken,checkRoles(["Admin","User"]),filterProfiles)
app.get("/user/profile/:username",verfyToken,checkRoles(["Admin","User"]),getUserProfile)




//lost item crud
app.get("/lostItems",verfyToken, checkingStatus,checkRoles(["Admin","User"]),lostItem);

app.get("/lostItem/:id",verfyToken, checkingStatus,checkRoles(["Admin","User"]),lostItemId);

app.get("/lostItem",lostItems);

app.post("/post/lostItem",verfyToken, checkingStatus,checkRoles(["Admin","User"]),upload.single('image') ,lostItemController);

app.delete("/lost/delete/:id",verfyToken, checkingStatus,checkRoles(["Admin","User"]), deleteLostItem);

app.put("/lost/update/:id",verfyToken,checkingStatus,checkRoles(["Admin","User"]),upload.single('image'), LostItemUpddate);
app.get("/lostItemsByUser/:id",checkingStatus,verfyToken,checkRoles(["Admin","User"]),itemLostByUser)




app.post("/foundItems",verfyToken,checkingStatus,checkRoles(["Admin","User"]),upload.single('image'), foundItemController);
app.get("/foundItems", foundItems);
app.get("/foundItem",foundItemLimit);
app.get("/foundItemsByUser/:id",verfyToken,checkingStatus,checkRoles(["Admin","User"]),itemFoundByUser)



app.get("/foundone/:id",verfyToken,checkRoles(["Admin","User"]),singleFound);

app.delete("/found/delete/:id",verfyToken,checkingStatus,checkRoles(["Admin","User"]), deleteFound);

app.put("/found/update/:id",verfyToken,checkingStatus,checkRoles(["Admin","User"]),upload.single('image'),foundItemUpdate);

app.post("/post/chats",verfyToken,checkingStatus,checkRoles(["Admin","User"]), postChatController);
app.get("/User/chats",verfyToken,checkingStatus,checkRoles(["Admin","User"]), chatController);






app.get('/reports',verfyToken,checkRoles(["Admin","User"]), getReports);
app.post('/reports',verfyToken,checkRoles(["Admin","User"]), createReportHandler);


app.get('/community/messages',verfyToken,checkRoles(["Admin","User"]), getMessages);
app.post('/community/messages',verfyToken,checkRoles(["Admin","User"]), sendMessage);




//matches
app.post('/api/matches', createMatch);          
app.get('/matches', getAllMatches);         
app.get('/matches/:id', getMatchById);     
app.put('/matches/:id', updateMatch);      
app.delete('/matches/:id', deleteMatch);  



//chatRooms
app.get('/chat/user/:userId', getUserChat);
app.get('/messages/:roomId', getMessage);
app.post('/start', startChat);
app.post('/send', sendMessages);
app.get('/room/:roomId', getRoomById);


//email notification

app.post("/email/notify", verfyToken, checkingStatus,checkRoles(["Admin","User"]),sendFoundItemNotificationController);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




