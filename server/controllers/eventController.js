const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer)
const createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate, category, tags, streamUrl, maxAttendees } = req.body;

    const event = await Event.create({
      title,
      description,
      organizer: req.user.id,
      startDate,
      endDate,
      category,
      tags: tags || [],
      streamUrl,
      maxAttendees,
      thumbnail: req.file ? `/uploads/${req.file.filename}` : ''
    });

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error creating event' });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { category, search, status, page = 1, limit = 10 } = req.query;

    // Build query
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status) {
      query.streamStatus = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email')
      .sort({ startDate: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      count: events.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      events
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error fetching events' });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get registration count
    const registrationCount = await Registration.countDocuments({ 
      event: event._id,
      status: 'confirmed'
    });

    res.json({
      success: true,
      event: {
        ...event.toObject(),
        registrationCount
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({ message: 'Server error fetching event' });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer - owner only)
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    // Update fields
    const updates = { ...req.body };
    if (req.file) {
      updates.thumbnail = `/uploads/${req.file.filename}`;
    }

    event = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error updating event' });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer - owner only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check ownership
    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();

    // Delete associated registrations
    await Registration.deleteMany({ event: req.params.id });

    res.json({
      success: true,
      message: 'Event deleted'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error deleting event' });
  }
};

// @desc    Get organizer's events
// @route   GET /api/events/organizer/my-events
// @access  Private (Organizer)
const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({ message: 'Server error fetching your events' });
  }
};

// @desc    Update stream status
// @route   PATCH /api/events/:id/stream-status
// @access  Private (Organizer - owner only)
const updateStreamStatus = async (req, res) => {
  try {
    const { streamStatus } = req.body;
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    event.streamStatus = streamStatus;
    await event.save();

    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('Update stream status error:', error);
    res.status(500).json({ message: 'Server error updating stream status' });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  updateStreamStatus
};
