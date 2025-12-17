const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: [true, 'Message cannot be empty'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for fetching messages by event
chatMessageSchema.index({ event: 1, timestamp: 1 });

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
