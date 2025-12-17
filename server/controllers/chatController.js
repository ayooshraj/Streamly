const ChatMessage = require('../models/ChatMessage');

// @desc    Get chat messages for an event
// @route   GET /api/chat/:eventId
// @access  Private
const getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { limit = 50, before } = req.query;

    let query = { event: eventId };

    // Pagination: get messages before a certain timestamp
    if (before) {
      query.timestamp = { $lt: new Date(before) };
    }

    const messages = await ChatMessage.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .populate('sender', 'name avatar');

    // Reverse to get chronological order
    res.json({
      success: true,
      count: messages.length,
      messages: messages.reverse()
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// @desc    Save a chat message (called from socket handler)
// @access  Internal
const saveMessage = async (eventId, senderId, senderName, message) => {
  try {
    const chatMessage = await ChatMessage.create({
      event: eventId,
      sender: senderId,
      senderName,
      message
    });
    return chatMessage;
  } catch (error) {
    console.error('Save message error:', error);
    throw error;
  }
};

// @desc    Delete all messages for an event
// @route   DELETE /api/chat/:eventId
// @access  Private (Organizer)
const clearEventChat = async (req, res) => {
  try {
    const { eventId } = req.params;

    await ChatMessage.deleteMany({ event: eventId });

    res.json({
      success: true,
      message: 'Chat cleared'
    });
  } catch (error) {
    console.error('Clear chat error:', error);
    res.status(500).json({ message: 'Server error clearing chat' });
  }
};

module.exports = {
  getEventMessages,
  saveMessage,
  clearEventChat
};
