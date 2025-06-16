const fetchUserChats = async (userId) => {
  try {
    // First fetch matches where the current user is either lostUser or foundUser
    const response = await axiosInstance.get('/matches');
    const matches = response.data;
    console.log('Fetched matches:', matches);

    // Convert matches to chat rooms
    const chats = await Promise.all(matches.map(async match => {
      const roomId = `${match.lostUser.userId}_${match.foundUser.userId}`;

      let lastMessage = '';
      let lastMessageAt = new Date();

      try {
        const room = await axiosInstance.get(`/room/${roomId}`);
        console.log('Fetched room:', room.data);
        if (room.data && room.data.lastMessage) {
          lastMessage = room.data.lastMessage;
          lastMessageAt = room.data.lastMessageAt;
        }
      } catch (error) {
        console.error('Error fetching room:', roomId, error);
      }

      return {
        _id: `chat_${match._id}`,
        roomId: roomId,
        user1: match.lostUser.userId,
        user2: match.foundUser.userId,
        lastMessage,
        lastMessageAt,
        unreadCount: 0,
        matchData: {
          score: match.matchScore,
          status: match.status,
          explanation: match.explanation
        }
      };
    }));

    return chats.map(chat => ({
      ...chat,
      participantName: chat.user1._id === userId ? chat.user2.username : chat.user1.username,
      participantAvatar: chat.user1._id === userId ? chat.user2.avatar : chat.user1.avatar,
    }));
  } catch (error) {
    console.error('Using mock chats data:', error);
    return MOCK_CHATS.map(chat => ({
      ...chat,
      participantName: chat.user1._id === userId ? chat.user2.username : chat.user1.username,
      participantAvatar: chat.user1._id === userId ? chat.user2.avatar : chat.user1.avatar,
    }));
  }
};




lostAndFound=kzge djpr drci rfip
email =ibrahimmohamed0784@gmail.com