const express = require('express');
const router = express.Router();
const {
  createSession,
  getEventSessions,
  updateSession,
  deleteSession,
  getSession
} = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/roleMiddleware');
const { validateSession } = require('../middleware/validationMiddleware');

// Public routes
router.get('/event/:eventId', getEventSessions);
router.get('/:id', getSession);

// Protected routes (Organizer only)
router.post('/', protect, isOrganizer, validateSession, createSession);
router.put('/:id', protect, isOrganizer, updateSession);
router.delete('/:id', protect, isOrganizer, deleteSession);

module.exports = router;
