import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const Dashboard = () => {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    category: 'other',
    streamUrl: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyEvents()
  }, [])

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/events/organizer/my-events`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setEvents(response.data.events)
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      await axios.post(`${API_URL}/api/events`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setShowForm(false)
      setFormData({ title: '', description: '', startDate: '', endDate: '', category: 'other', streamUrl: '' })
      fetchMyEvents()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event')
    } finally {
      setSubmitting(false)
    }
  }

  const updateStreamStatus = async (eventId, status) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(`${API_URL}/api/events/${eventId}/stream-status`, 
        { streamStatus: status },
        { headers: { Authorization: `Bearer ${token}` }}
      )
      fetchMyEvents()
    } catch (err) {
      setError('Failed to update status')
    }
  }

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Organizer Dashboard</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {showForm && (
        <div className="event-form card">
          <div className="card-body">
            <h2>Create New Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">End Date & Time</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="technology">Technology</option>
                  <option value="business">Business</option>
                  <option value="education">Education</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Stream URL (YouTube/Twitch)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.streamUrl}
                  onChange={(e) => setFormData({...formData, streamUrl: e.target.value})}
                />
              </div>
              
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Event'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="events-list">
        <h2>Your Events</h2>
        {events.length === 0 ? (
          <p>No events yet. Create your first event!</p>
        ) : (
          events.map(event => (
            <div key={event._id} className="event-item card">
              <div className="card-body">
                <div className="event-item-header">
                  <h3>{event.title}</h3>
                  <span className={`event-status status-${event.streamStatus}`}>
                    {event.streamStatus}
                  </span>
                </div>
                <p className="event-date">
                  {new Date(event.startDate).toLocaleString()}
                </p>
                <div className="event-actions">
                  {event.streamStatus === 'scheduled' && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => updateStreamStatus(event._id, 'live')}
                    >
                      Go Live
                    </button>
                  )}
                  {event.streamStatus === 'live' && (
                    <>
                      <Link to={`/live/${event._id}`} className="btn btn-primary">
                        View Live Room
                      </Link>
                      <button 
                        className="btn btn-danger"
                        onClick={() => updateStreamStatus(event._id, 'ended')}
                      >
                        End Stream
                      </button>
                    </>
                  )}
                  <Link to={`/events/${event._id}`} className="btn btn-outline">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard
