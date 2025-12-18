const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  updateStreamStatus
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { isOrganizer } = require('../middleware/roleMiddleware');
const { validateEvent, validateObjectId } = require('../middleware/validationMiddleware');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `event-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// Public routes
router.get('/', getEvents);

// Protected routes (Organizer only) - MUST come before /:id
router.get('/organizer/my-events', protect, isOrganizer, getMyEvents);

// Public route with ID parameter - MUST come last
router.get('/:id', validateObjectId, getEvent);

// Other protected routes
router.post('/', protect, isOrganizer, upload.single('thumbnail'), createEvent);
router.put('/:id', protect, isOrganizer, upload.single('thumbnail'), validateObjectId, updateEvent);
router.delete('/:id', protect, isOrganizer, validateObjectId, deleteEvent);
router.patch('/:id/stream-status', protect, isOrganizer, validateObjectId, updateStreamStatus);

module.exports = router;
