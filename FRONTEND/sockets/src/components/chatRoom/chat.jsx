import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  CssBaseline, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Avatar, 
  Typography, 
  IconButton, 
  Toolbar, 
  TextField, 
  InputAdornment, 
  Badge,
  CircularProgress,
  useTheme,
  Divider
} from '@mui/material';
import { 
  Menu, 
  Search, 
  AddComment, 
  Send, 
  AttachFile, 
  Mood, 
  ArrowBack,
  Circle
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isValid, parseISO } from 'date-fns';
import axiosInstance from '../../axiosInstance';

// ========== CONSTANTS ========== //
const drawerWidth = 340;

// ========== HELPER FUNCTIONS ========== //
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const generateRoomId = (userId1, userId2) => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}_${sortedIds[1]}`;
};

// Helper to safely format dates
function safeFormatTime(val) {
  if (!val) return '';
  const date = typeof val === 'string' ? parseISO(val) : val;
  return isValid(date) ? format(date, 'h:mm a') : '';
}

// ========== API SERVICE FUNCTIONS ========== //
const fetchCurrentUser = async () => {
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
      role: role,
      avatar: ''
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

const fetchUserChats = async (userId) => {
  try {
    const response = await axiosInstance.get('/matches');
    const matches = response.data;

    const chats = await Promise.all(matches.map(async (match) => {
      const roomId = `${match.lostUser.userId}_${match.foundUser.userId}`;
      
      let lastMessage = '';
      let lastMessageAt = new Date();
      let unreadCount = 0;

      try {
        const roomRes = await axiosInstance.get(`/room/${roomId}`);
        const roomData = roomRes.data[0] || {};
        
        if (roomData.lastMessage) {
          lastMessage = roomData.lastMessage;
          lastMessageAt = new Date(roomData.lastMessageAt);
          unreadCount = roomData.unreadCount || 0;
        }
      } catch (err) {
        console.error('Error fetching room:', err);
      }

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

    return chats.map(chat => ({
      ...chat,
      participant: chat.user1.userId === userId ? chat.user2 : chat.user1,
      isUnread: chat.unreadCount > 0
    }));
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};

const fetchMessages = async (roomId, userId) => {
  try {
    const response = await axiosInstance.get(`/messages/${roomId}`);
    return response.data.map(msg => ({
      ...msg,
      isOwn: msg.senderId === userId,
      timestamp: new Date(msg.timestamp)
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

const sendChatMessage = async (messageData) => {
  try {
    const response = await axiosInstance.post('/send', messageData);
    return {
      ...response.data,
      isOwn: true,
      timestamp: new Date(response.data.timestamp)
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

// ========== COMPONENTS ========== //
const UserAvatar = ({ user, size = 40 }) => {
  return (
    <Avatar
      sx={{ 
        width: size, 
        height: size,
        bgcolor: stringToColor(user?.name || ''),
        fontSize: size * 0.4,
      }}
    >
      {user?.name?.charAt(0).toUpperCase()}
    </Avatar>
  );
};

const MessageBubble = ({ message, showAvatar }) => {
  const theme = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        display: 'flex',
        justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
        marginBottom: 8,
        gap: 8,
        width: '100%'
      }}
    >
      {!message.isOwn && showAvatar && (
        <UserAvatar user={{ name: message.senderName }} size={32} />
      )}
      
      {!message.isOwn && !showAvatar && (
        <Box sx={{ width: 40 }} /> // Spacer when avatar is hidden
      )}
      
      <Box sx={{
        maxWidth: '70%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: message.isOwn ? 'flex-end' : 'flex-start'
      }}>
        <Box sx={{
          bgcolor: message.isOwn 
            ? theme.palette.primary.main 
            : theme.palette.grey[200],
          color: message.isOwn 
            ? theme.palette.primary.contrastText 
            : theme.palette.text.primary,
          px: 2,
          py: 1.5,
          borderRadius: 4,
          borderBottomRightRadius: message.isOwn ? 4 : 16,
          borderBottomLeftRadius: message.isOwn ? 16 : 4,
          boxShadow: 1,
          wordBreak: 'break-word'
        }}>
          {message.content}
        </Box>
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mt: 0.5, px: 1 }}
        >
          {safeFormatTime(message.timestamp)}
        </Typography>
      </Box>
    </motion.div>
  );
};

// ========== MAIN COMPONENT ========== //
export default function ChatApp() {
  const theme = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState({
    user: true,
    chats: false,
    messages: false,
    sending: false
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize current user and chats
  useEffect(() => {
    const initialize = async () => {
      try {
        const user = await fetchCurrentUser();
        setCurrentUser(user);
        
        const userChats = await fetchUserChats(user._id);
        setChats(userChats);
        
        setLoading(prev => ({ ...prev, user: false }));
      } catch (error) {
        console.error('Initialization error:', error);
        setLoading(prev => ({ ...prev, user: false }));
      }
    };
    
    initialize();
  }, []);

  // Fetch messages when chat is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (selectedChat && currentUser) {
        try {
          setLoading(prev => ({ ...prev, messages: true }));
          const fetchedMessages = await fetchMessages(selectedChat.roomId, currentUser._id);
          console.log('Fetched messages:', fetchedMessages);
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Error loading messages:', error);
        } finally {
          setLoading(prev => ({ ...prev, messages: false }));
        }
      }
    };
    
    loadMessages();
  }, [selectedChat, currentUser]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser || loading.sending) return;

    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      roomId: selectedChat.roomId,
      senderId: currentUser._id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      isOwn: true,
      isTemp: true
    };

    //console.log('Sending message:', tempMessage);

    // Optimistic update
    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setLoading(prev => ({ ...prev, sending: true }));

    try {
      const messageData = {
        roomId: selectedChat.roomId,
        senderId: currentUser._id,
        content: newMessage
      };
      
      const sentMessage = await sendChatMessage(messageData);
      
      // Replace temp message with actual message
      setMessages(prev => [
        ...prev.filter(msg => msg._id !== tempId),
        sentMessage
      ]);
      
      // Update last message in chats list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.roomId === selectedChat.roomId 
            ? { 
                ...chat, 
                lastMessage: newMessage, 
                lastMessageAt: new Date(),
                unreadCount: 0
              }
            : chat
        )
      );
    } catch (error) {
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg._id !== tempId));
      console.error('Failed to send message:', error);
    } finally {
      setLoading(prev => ({ ...prev, sending: false }));
    }
  };

  // Determine if avatar should be shown for a message
  const shouldShowAvatar = (message, index) => {
    if (message.isOwn) return false;
    
    // Show avatar if this is the first message in the chat
    if (index === 0) return true;
    
    // Show avatar if the previous message is from a different sender
    const prevMessage = messages[index - 1];
    return prevMessage.senderId !== message.senderId;
  };

  if (loading.user) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading your chat...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            borderRight: 'none'
          },
          display: { xs: 'none', sm: 'block' }
        }}
      >
        <Toolbar sx={{ px: 2, pt: 2 }}>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Matched Chats
          </Typography>
        </Toolbar>
        
        <Divider />
        
        <List sx={{ overflowY: 'auto', flexGrow: 1 }}>
          {loading.chats ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            chats.map((chat) => (
              <motion.div
                key={chat._id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <ListItem 
                  disablePadding
                  selected={selectedChat?._id === chat._id}
                  onClick={() => setSelectedChat(chat)}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          chat.isUnread ? (
                            <Circle color="primary" sx={{ fontSize: 12 }} />
                          ) : null
                        }
                      >
                        <UserAvatar user={{ name: chat.participant.username }} />
                      </Badge>
                    </ListItemIcon>
                    <ListItemText
                      primary={chat.participant.username}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: 'inline-block',
                              width: '100%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {chat.lastMessage || 'No messages yet'}
                          </Typography>
                          <Typography
                            component="span"
                            variant="caption"
                            color="primary"
                            display="block"
                          >
                            Match score: {(chat.matchData?.score * 100).toFixed(0)}%
                          </Typography>
                        </>
                      }
                    />
                    <Typography variant="caption" color="text.secondary">
                      {safeFormatTime(chat.lastMessageAt)}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              </motion.div>
            ))
          )}
        </List>
      </Drawer>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { width: drawerWidth },
        }}
      >
        <Toolbar>
          <IconButton onClick={() => setMobileOpen(false)}>
            <ArrowBack />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {chats.map((chat) => (
            <ListItem 
              key={chat._id}
              button 
              selected={selectedChat?._id === chat._id}
              onClick={() => {
                setSelectedChat(chat);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>
                <UserAvatar user={{ name: chat.participant.username }} />
              </ListItemIcon>
              <ListItemText 
                primary={chat.participant.username} 
                secondary={
                  <>
                    {chat.lastMessage || 'No messages yet'}
                    <br />
                    <Typography variant="caption" color="primary">
                      Match: {(chat.matchData?.score * 100).toFixed(0)}%
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      {/* Main Content */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          height: '100vh',
          bgcolor: 'background.default'
        }}
      >
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <Toolbar sx={{ 
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
              bgcolor: 'background.paper'
            }}>
              <IconButton 
                sx={{ display: { sm: 'none' }, mr: 1 }}
                onClick={() => setMobileOpen(true)}
              >
                <Menu />
              </IconButton>
              <UserAvatar 
                user={{ name: selectedChat.participant.username }} 
                size={40}
                sx={{ mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap>
                  {selectedChat.participant.username}
                </Typography>
                <Typography variant="caption" color="primary">
                  Match score: {(selectedChat.matchData?.score * 100).toFixed(0)}% | 
                  Status: {selectedChat.matchData?.status}
                </Typography>
              </Box>
            </Toolbar>
            
            {/* Messages Area */}
            <Box sx={{
              flexGrow: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: 'rgba(0, 0, 0, 0.02)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {loading.messages ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '100%'
                }}>
                  <CircularProgress />
                </Box>
              ) : (
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={message._id}
                      message={message.text ? { ...message, content: message.text } : message}
                      index={index}
                      
                      showAvatar={shouldShowAvatar(message, index)}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </AnimatePresence>
              )}
            </Box>
            
            {/* Message Input */}
            <Box sx={{ 
              p: 2, 
              borderTop: '1px solid rgba(0, 0, 0, 0.12)',
              bgcolor: 'background.paper'
            }}>
              <TextField
                fullWidth
                multiline
                maxRows={4}
                variant="outlined"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <>
                      <IconButton>
                        <AttachFile />
                      </IconButton>
                      <IconButton>
                        <Mood />
                      </IconButton>
                    </>
                  ),
                  endAdornment: (
                    <IconButton 
                      color="primary"
                      disabled={!newMessage.trim() || loading.sending}
                      onClick={handleSendMessage}
                    >
                      {loading.sending ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Send />
                      )}
                    </IconButton>
                  ),
                  sx: {
                    borderRadius: 4,
                    bgcolor: 'background.paper'
                  }
                }}
              />
            </Box>
          </>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            textAlign: 'center',
            p: 3
          }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {chats.length === 0 ? 'No matched conversations yet' : 'Select a conversation '}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {chats.length === 0 
                ? 'Your matched items will appear here' 
                : 'Select a conversation to start chatting for Your Item recovery'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}