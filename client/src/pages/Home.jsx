import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const Home = () => {
  const { user, isOrganizer } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Streamly</h1>
        <p>Your platform for hosting and attending virtual events</p>
        
        <div className="hero-buttons">
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
          {!user && (
            <Link to="/signup" className="btn btn-outline">
              Get Started
            </Link>
          )}
          {isOrganizer && (
            <Link to="/dashboard" className="btn btn-secondary">
              Create Event
            </Link>
          )}
        </div>
      </section>

      <section className="features">
        <h2>Why Streamly?</h2>
        <div className="grid grid-3">
          <div className="feature-card">
            <span className="feature-icon">📺</span>
            <h3>Live Streaming</h3>
            <p>Stream your events using YouTube or Twitch integration</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💬</span>
            <h3>Real-time Chat</h3>
            <p>Engage with attendees through live chat during events</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Easy Scheduling</h3>
            <p>Create and manage event schedules effortlessly</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
