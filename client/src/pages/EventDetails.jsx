import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './EventDetails.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const EventDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  
  const [event, setEvent] = useState(null)
  const [sessions, setSessions] = useState([])
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationId, setRegistrationId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvent()
  }, [id])

  useEffect(() => {
    if (user) checkRegistration()
  }, [user, id])

const fetchEvent = async () => {
  try {
    const eventRes = await axios.get(`${API_URL}/api/events/${id}`)
    setEvent(eventRes.data.event)
    
    // Try to fetch sessions, but don't fail if PostgreSQL is not connected
    try {
      const sessionsRes = await axios.get(`${API_URL}/api/sessions/event/${id}`)
      setSessions(sessionsRes.data.sessions)
    } catch (sessionErr) {
      console.log('Sessions not available:', sessionErr.message)
      setSessions([])
    }
  } catch (err) {
    setError('Event not found')
  } finally {
    setLoading(false)
  }
}

  const checkRegistration = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/registrations/check/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsRegistered(response.data.isRegistered)
      setRegistrationId(response.data.registration?._id)
    } catch (err) {
      console.error('Check registration error:', err)
    }
  }

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    try {
      setRegistering(true)
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/api/registrations`, 
        { eventId: id },
        { headers: { Authorization: `Bearer ${token}` }}
      )
      await checkRegistration()
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  if (error || !event) {
    return <div className="alert alert-error">{error || 'Event not found'}</div>
  }

  const canJoinLive = isRegistered && event.streamStatus === 'live'

  const getVideoThumbnail = (url) => {
    if (!url) return null
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      // Returns 16:9 aspect ratio thumbnail (maxresdefault.jpg is 1280x720)
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`
    }
    return null
  }

  return (
    <div className="event-details">
      <div className="event-left">
        <div className="event-header">
          <span className="event-category">{event.category}</span>
          <span className={`event-status status-${event.streamStatus}`}>
            {event.streamStatus}
          </span>
        </div>

        <h1>{event.title}</h1>
        <p className="event-organizer">Organized by {event.organizer?.name}</p>

        {event.streamUrl && (
          <div className="event-thumbnail">
            {getVideoThumbnail(event.streamUrl) ? (
              <img src={getVideoThumbnail(event.streamUrl)} alt={event.title} />
            ) : (
              <div className="thumbnail-placeholder">
                <span>📺</span>
                <p>Stream Preview</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="event-right">
        <div className="event-description">
          <h3>About this event</h3>
          <p>{event.description}</p>
        </div>

        <div className="event-dates">
          <p><strong>Starts:</strong> {formatDate(event.startDate)}</p>
          <p><strong>Ends:</strong> {formatDate(event.endDate)}</p>
        </div>

        {sessions.length > 0 && (
          <div className="event-sessions">
            <h3>Schedule</h3>
            {sessions.map(session => (
              <div key={session.id} className="session-item">
                <div className="session-time">
                  {new Date(session.start_time).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="session-info">
                  <h4>{session.title}</h4>
                  {session.speaker && <p className="session-speaker">Speaker: {session.speaker}</p>}
                  {session.description && <p>{session.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="registration-card">
          <p className="attendee-count">{event.registrationCount || 0} registered</p>

          {canJoinLive ? (
            <Link to={`/live/${id}`} className="btn btn-primary btn-block">
              🔴 Join Live Stream
            </Link>
          ) : isRegistered ? (
            <button className="btn btn-secondary btn-block" disabled>
              ✓ Registered
            </button>
          ) : (
            <button
              className="btn btn-primary btn-block"
              onClick={handleRegister}
              disabled={registering}
            >
              {registering ? 'Registering...' : 'Register for Event'}
            </button>
          )}

          {!isAuthenticated && (
            <p className="login-prompt">
              <Link to="/login">Login</Link> to register
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventDetails
