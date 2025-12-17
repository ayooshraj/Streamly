// Check if user has required role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}` 
      });
    }

    next();
  };
};

// Check if user is an organizer
const isOrganizer = requireRole('organizer');

// Check if user is an attendee
const isAttendee = requireRole('attendee');

// Check if user is either organizer or attendee
const isAuthenticated = requireRole('organizer', 'attendee');

module.exports = { requireRole, isOrganizer, isAttendee, isAuthenticated };
