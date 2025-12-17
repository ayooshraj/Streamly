import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './MyRegistrations.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`${API_URL}/api/registrations/my-registrations`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setRegistrations(response.data.registrations)
    } catch (err) {
      setError('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  return (
    <div className="my-registrations">
      <h1>My Registered Events</h1>

      {error && <div className="alert alert-error">{error}</div>}

      {registrations.length === 0 ? (
        <div className="no-registrations">
          <p>You haven't registered for any events yet.</p>
          <Link to="/events" className="btn btn-primary">Browse Events</Link>
        </div>
      ) : (
        <div className="registrations-list">
          {registrations.map(reg => (
            <div key={reg._id} className="registration-card card">
              <div className="card-body">
                <div className="reg-header">
                  <h3>{reg.event.title}</h3>
                  <span className={`event-status status-${reg.event.streamStatus}`}>
                    {reg.event.streamStatus}
                  </span>
                </div>
                <p className="reg-date">{formatDate(reg.event.startDate)}</p>
                <p className="reg-organizer">By {reg.event.organizer?.name}</p>
                
                <div className="reg-actions">
                  {reg.event.streamStatus === 'live' ? (
                    <Link to={`/live/${reg.event._id}`} className="btn btn-primary">
                      🔴 Join Live
                    </Link>
                  ) : (
                    <Link to={`/events/${reg.event._id}`} className="btn btn-outline">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyRegistrations
