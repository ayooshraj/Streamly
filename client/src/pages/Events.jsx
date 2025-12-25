import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './Events.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('all')

  useEffect(() => {
    fetchEvents()
  }, [category])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const params = category !== 'all' ? `?category=${category}` : ''
      const response = await axios.get(`${API_URL}/api/events${params}`)
      setEvents(response.data.events)
    } catch (err) {
      setError('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getVideoThumbnail = (url) => {
    if (!url) return null
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`
    }
    return null
  }

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  return (
    <div className="events-page">
      <div className="events-header">
        <h1>Upcoming Events</h1>
        <select 
          className="form-input category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="technology">Technology</option>
          <option value="business">Business</option>
          <option value="education">Education</option>
          <option value="entertainment">Entertainment</option>
          <option value="other">Other</option>
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {events.length === 0 ? (
        <p className="no-events">No events found</p>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <Link to={`/events/${event._id}`} key={event._id} className="event-card">
              <div className="event-thumbnail">
                {getVideoThumbnail(event.streamUrl) ? (
                  <img src={getVideoThumbnail(event.streamUrl)} alt={event.title} />
                ) : event.thumbnail ? (
                  <img src={`${API_URL}${event.thumbnail}`} alt={event.title} />
                ) : (
                  <div className="event-placeholder">📺</div>
                )}
                <span className={`event-status status-${event.streamStatus}`}>
                  {event.streamStatus}
                </span>
              </div>
              <div className="event-info">
                <span className="event-category">{event.category}</span>
                <h3>{event.title}</h3>
                <p className="event-date">{formatDate(event.startDate)}</p>
                <p className="event-organizer">By {event.organizer?.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events
