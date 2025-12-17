const express = require('express');
const router = express.Router();
const { getEventMessages, clearEventChat } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/roleMiddleware');

// All routes are protected
router.use(protect);

// Get messages for an event
router.get('/:eventId', getEventMessages);

// Clear chat (organizer only)
router.delete('/:eventId', isOrganizer, clearEventChat);

module.exports = router;
