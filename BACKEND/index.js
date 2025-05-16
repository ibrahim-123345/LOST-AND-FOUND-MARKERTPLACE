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
app.get("/lostItems",verfyToken, checkingStatus,checkRoles(["Admin","User"]),lostItem);//this endpoint have limit

app.get("/lostItem/:id",verfyToken, checkingStatus,checkRoles(["Admin","User"]),lostItemId);//this endpoint to specific based input id

app.get("/lostItem",verfyToken, checkingStatus,lostItems);//this endpoint have no limit it displays all losts item reported

app.post("/post/lostItem",verfyToken, checkingStatus,checkRoles(["Admin","User"]),upload.single('image') ,lostItemController);

app.delete("/lost/delete/:id",verfyToken, checkingStatus,checkRoles(["Admin","User"]), deleteLostItem);

app.put("/lost/update/:id",verfyToken,checkingStatus,checkRoles(["Admin","User"]),upload.single('image'), LostItemUpddate);
app.get("/lostItemsByUser/:id",checkingStatus,verfyToken,checkRoles(["Admin","User"]),itemLostByUser)



//found items crud

app.post("/foundItems",verfyToken,checkingStatus,checkRoles(["Admin","User"]),upload.single('image'), foundItemController);
app.get("/foundItems",checkingStatus,checkingStatus, foundItems);
app.get("/foundItem",foundItemLimit);
app.get("/foundItemsByUser/:id",verfyToken,checkingStatus,checkRoles(["Admin","User"]),itemFoundByUser)



app.get("/foundone/:id",verfyToken,checkRoles(["Admin","User"]),singleFound);

app.delete("/found/delete/:id",verfyToken,checkingStatus,checkRoles(["Admin","User"]), deleteFound);

app.put("/found/update/:id",verfyToken,checkingStatus,checkRoles(["Admin","User"]),upload.single('image'),foundItemUpdate);

app.post("/post/chats",verfyToken,checkingStatus,checkRoles(["Admin","User"]), postChatController);
app.get("/User/chats",verfyToken,checkingStatus,checkRoles(["Admin","User"]), chatController);




//chats crud and reports


app.get('/reports',verfyToken,checkRoles(["Admin","User"]), getReports);
app.post('/reports',verfyToken,checkRoles(["Admin","User"]), createReportHandler);


app.get('/community/messages',verfyToken,checkRoles(["Admin","User"]), getMessages);
app.post('/community/messages',verfyToken,checkRoles(["Admin","User"]), sendMessage);




//matching utiltiy route

app.post('/api/matches', createMatch);          
app.get('/api/matches', getAllMatches);         
app.get('/api/matches/:id', getMatchById);     
app.put('/api/matches/:id', updateMatch);      
app.delete('/api/matches/:id', deleteMatch);   


//port listering
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




