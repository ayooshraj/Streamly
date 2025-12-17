const { saveMessage } = require('../controllers/chatController');

const chatHandler = (io, socket) => {
  // Join event room
  socket.on('join-event', (eventId) => {
    socket.join(eventId);
    console.log(`User ${socket.id} joined event: ${eventId}`);
    
    // Notify others in the room
    socket.to(eventId).emit('user-joined', {
      message: 'A new attendee joined the event'
    });
  });

  // Leave event room
  socket.on('leave-event', (eventId) => {
    socket.leave(eventId);
    console.log(`User ${socket.id} left event: ${eventId}`);
  });

  // Handle chat message
  socket.on('send-message', async (data) => {
    try {
      const { eventId, userId, userName, message } = data;

      // Validate data
      if (!eventId || !userId || !message) {
        socket.emit('error', { message: 'Invalid message data' });
        return;
      }

      // Save message to database
      const savedMessage = await saveMessage(eventId, userId, userName, message);

      // Broadcast to all users in the event room (including sender)
      io.to(eventId).emit('new-message', {
        _id: savedMessage._id,
        event: eventId,
        sender: userId,
        senderName: userName,
        message: message,
        timestamp: savedMessage.timestamp
      });
    } catch (error) {
      console.error('Socket message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicator
  socket.on('typing', (data) => {
    const { eventId, userName } = data;
    socket.to(eventId).emit('user-typing', { userName });
  });

  // Handle stop typing
  socket.on('stop-typing', (data) => {
    const { eventId } = data;
    socket.to(eventId).emit('user-stop-typing');
  });

  // Handle stream status update (organizer only)
  socket.on('stream-status-change', (data) => {
    const { eventId, status } = data;
    io.to(eventId).emit('stream-status-updated', { status });
  });

  // Handle announcement (organizer only)
  socket.on('send-announcement', (data) => {
    const { eventId, message } = data;
    io.to(eventId).emit('announcement', {
      message,
      timestamp: new Date()
    });
  });
};

module.exports = chatHandler;
