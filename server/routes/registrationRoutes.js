const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  checkRegistration
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/roleMiddleware');

// All routes are protected
router.use(protect);

// Attendee routes
router.post('/', registerForEvent);
router.patch('/:id/cancel', cancelRegistration);
router.get('/my-registrations', getMyRegistrations);
router.get('/check/:eventId', checkRegistration);

// Organizer routes
router.get('/event/:eventId', isOrganizer, getEventRegistrations);

module.exports = router;
