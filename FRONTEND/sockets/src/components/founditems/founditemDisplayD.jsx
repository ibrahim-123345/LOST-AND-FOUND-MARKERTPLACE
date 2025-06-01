import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Button } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdChatboxes } from "react-icons/io";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import useThemeStore from "../store/colorStore";
import axiosInstance from "../../axiosInstance";
import Swal from 'sweetalert2';


const FoundItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const { isDarkMode } = useThemeStore();

  const [currentUser, setCurrentUser] = useState({});




const fetchCurrentUser =  () => {
  try {
    const userId = localStorage.getItem('userid');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('username');
    
    if (!userId || !role || !name) {
      throw new Error('User data not found in localStorage');
    }
    
    return {
      _id: userId,
      name: name,
      role: role
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};




const fetchUserChats = async (userId,itemId) => {
  try {
    const { data: matches } = await axiosInstance.get('/matches');

    const chats = await Promise.all(matches.map(async (match) => {
      const roomId = `${match.lostUser.userId}_${match.foundUser.userId}`;
      const isMatchUser = [match.lostUser.userId, match.foundUser.userId].includes(userId);
      const foundItemId=match.foundItemId || match.lostItemId;
      
      // Only continue if user is patch is related to the current itemrt of the match
      if (match.matchScore >= 0.6 && isMatchUser && foundItemId === itemId) {
        let roomExists = false;

        try {
          const { data } = await axiosInstance.get(`/room/${roomId}`);
          roomExists = !!data[0];
        } catch (_) {}

        if (!roomExists) {
          try {
            await axiosInstance.post(`/room/${roomId}`, {
              user1: match.lostUser,
              user2: match.foundUser,
              matchId: match._id,
            });
          } catch (err) {
            console.error('Room creation failed:', err);
            return null;
          }
        }

        // Redirect only if room exists or was just created and user is involved
        window.location.href = `/chat/${roomId}`;
        return null;
      }

      // Skip if not part of the match
      if (!isMatchUser) return null;

      // If not redirected, return match chat info
      let lastMessage = '';
      let lastMessageAt = null;
      let unreadCount = 0;

      try {
        const { data } = await axiosInstance.get(`/room/${roomId}`);
        const room = data[0];
        if (room) {
          lastMessage = room.lastMessage || '';
          lastMessageAt = room.lastMessageAt ? new Date(room.lastMessageAt) : null;
          unreadCount = room.unreadCount || 0;
        }
      } catch (_) {}

      return {
        _id: `chat_${match._id}`,
        roomId,
        user1: match.lostUser,
        user2: match.foundUser,
        lastMessage,
        lastMessageAt,
        unreadCount,
        matchData: {
          score: match.matchScore,
          status: match.status,
          explanation: match.explanation
        }
      };
    }));

    return chats
      .filter(Boolean)
      .map(chat => ({
        ...chat,
        participant: chat.user1.userId === userId ? chat.user2 : chat.user1,
        isUnread: chat.unreadCount > 0
      }));

  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};












  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axiosInstance.get(`foundone/${id}`);
        setItem(response.data);
        const user=fetchCurrentUser()
        setCurrentUser(user);
        
      } catch (error) {
        console.error("Error fetching item details:", error);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? "#1a1a1a" : "#f8f9fa";
  }, [isDarkMode]);

  if (!item) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Container
      className="py-4"
      style={{
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      {/* Simple back button */}
      <div className="mb-4">
        <Link
          to="/"
          className="d-flex align-items-center text-decoration-none"
          style={{ color: isDarkMode ? "#f5f5f5" : "#333" }}
        >
          <FaArrowLeft className="me-2" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Item Card */}
      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: isDarkMode
            ? "0 10px 20px rgba(0, 0, 0, 0.3)"
            : "0 10px 20px rgba(0, 0, 0, 0.1)",
          background: isDarkMode ? "#2d2d2d" : "#ffffff",
          color: isDarkMode ? "#f5f5f5" : "#333",
          transition: "all 0.3s ease",
        }}
      >
        {/* Item Image */}
        <div
          style={{
            height: "400px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <img
            src={item.image}
            alt="Found Item"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Item Details */}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h2
                style={{
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  color: isDarkMode ? "#ffffff" : "#212529",
                }}
              >
                {item.name}
              </h2>
              <p
                style={{
                  color: isDarkMode ? "#adb5bd" : "#6c757d",
                  fontSize: "0.9rem",
                }}
              >
                {moment(item.dateFound).fromNow()}
              </p>
            </div>
            {item.status === "found" && (
              <Button
                variant={isDarkMode ? "outline-light" : "outline-primary"}
                className="d-flex align-items-center"
                onClick={async () => {
                  
                  await fetchUserChats(currentUser._id, item._id);

Swal.fire({
  icon: 'info',
  title: 'Hang Tight!',
  text: 'Your item hasn’t been recovered yet. Please be patient as our algorithm works for you.',
  confirmButtonText: 'Okay',
  confirmButtonColor: '#3085d6',
});
                
                }}
              >
                <IoMdChatboxes className="me-2" />
                Chat
              </Button>
            )}
          </div>

          <hr style={{ borderColor: isDarkMode ? "#495057" : "#e9ecef" }} />

          <div className="mb-4">
            <h5
              style={{
                fontWeight: "600",
                marginBottom: "1rem",
                color: isDarkMode ? "#f8f9fa" : "#343a40",
              }}
            >
              Description
            </h5>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: "1.7",
                color: isDarkMode ? "#e9ecef" : "#495057",
              }}
            >
              {item.description}
            </p>
          </div>

          <div className="mb-3">
            <h5
              style={{
                fontWeight: "600",
                marginBottom: "1rem",
                color: isDarkMode ? "#f8f9fa" : "#343a40",
              }}
            >
              Found Location
            </h5>
            <p
              style={{
                fontSize: "1.05rem",
                color: isDarkMode ? "#e9ecef" : "#495057",
              }}
            >
              {item.location || "Not specified"}
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FoundItemDetails;