

const [username, setUsername] = useState("");
//const [room, setRoom] = useState("");
const [showChat, setShowChat] = useState(false);




<div className="App">
     
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <input
            type="text"
            placeholder="John..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      
        <Chat socket={socket} username={username} room={room} />
  
    </div>