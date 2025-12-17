const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private (Attendee)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      event: eventId,
      attendee: req.user.id
    });

    if (existingRegistration) {
      if (existingRegistration.status === 'confirmed') {
        return res.status(400).json({ message: 'Already registered for this event' });
      }
      // Reactivate cancelled registration
      existingRegistration.status = 'confirmed';
      await existingRegistration.save();
      return res.json({
        success: true,
        message: 'Registration reactivated',
        registration: existingRegistration
      });
    }

    // Check max attendees
    if (event.maxAttendees > 0) {
      const currentCount = await Registration.countDocuments({
        event: eventId,
        status: 'confirmed'
      });
      if (currentCount >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
    }

    // Create registration
    const registration = await Registration.create({
      event: eventId,
      attendee: req.user.id
    });

    res.status(201).json({
      success: true,
      registration
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Cancel registration
// @route   PATCH /api/registrations/:id/cancel
// @access  Private (Attendee - owner only)
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    // Check ownership
    if (registration.attendee.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    registration.status = 'cancelled';
    await registration.save();

    res.json({
      success: true,
      message: 'Registration cancelled',
      registration
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({ message: 'Server error cancelling registration' });
  }
};

// @desc    Get user's registrations
// @route   GET /api/registrations/my-registrations
// @access  Private
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({
      attendee: req.user.id,
      status: 'confirmed'
    })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({ message: 'Server error fetching registrations' });
  }
};

// @desc    Get event registrations (for organizer)
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer)
const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const registrations = await Registration.find({
      event: req.params.eventId,
      status: 'confirmed'
    })
      .populate('attendee', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: registrations.length,
      registrations
    });
  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({ message: 'Server error fetching registrations' });
  }
};

// @desc    Check if user is registered for an event
// @route   GET /api/registrations/check/:eventId
// @access  Private
const checkRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.eventId,
      attendee: req.user.id,
      status: 'confirmed'
    });

    res.json({
      success: true,
      isRegistered: !!registration,
      registration
    });
  } catch (error) {
    console.error('Check registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  checkRegistration
};
