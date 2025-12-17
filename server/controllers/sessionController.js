const { query } = require('../config/postgres');

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private (Organizer)
const createSession = async (req, res) => {
  try {
    const { event_id, title, description, speaker, start_time, end_time, order_index } = req.body;

    const result = await query(
      `INSERT INTO sessions (event_id, title, description, speaker, start_time, end_time, order_index)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [event_id, title, description || '', speaker || '', start_time, end_time, order_index || 0]
    );

    res.status(201).json({
      success: true,
      session: result.rows[0]
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error creating session' });
  }
};

// @desc    Get sessions for an event
// @route   GET /api/sessions/event/:eventId
// @access  Public
const getEventSessions = async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await query(
      `SELECT * FROM sessions 
       WHERE event_id = $1 
       ORDER BY order_index ASC, start_time ASC`,
      [eventId]
    );

    res.json({
      success: true,
      count: result.rows.length,
      sessions: result.rows
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error fetching sessions' });
  }
};

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private (Organizer)
const updateSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, speaker, start_time, end_time, order_index } = req.body;

    const result = await query(
      `UPDATE sessions 
       SET title = $1, description = $2, speaker = $3, start_time = $4, end_time = $5, order_index = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title, description, speaker, start_time, end_time, order_index, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      success: true,
      session: result.rows[0]
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ message: 'Server error updating session' });
  }
};

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private (Organizer)
const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'DELETE FROM sessions WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      success: true,
      message: 'Session deleted'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ message: 'Server error deleting session' });
  }
};

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Public
const getSession = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT * FROM sessions WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      success: true,
      session: result.rows[0]
    });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ message: 'Server error fetching session' });
  }
};

module.exports = {
  createSession,
  getEventSessions,
  updateSession,
  deleteSession,
  getSession
};
