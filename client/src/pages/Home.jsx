import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Home.css'

const Home = () => {
  const { user, isOrganizer } = useAuth()

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Trusted by 10,000+ event organizers worldwide</span>
        </div>

        <h1 className="hero-title">
          Create Engaging Virtual Events That
          <span className="gradient-text"> Your Audience Will Love</span>
        </h1>

        <p className="hero-subtitle">
          The all-in-one platform for hosting professional live-streamed events.
          Seamlessly integrate YouTube and Twitch, engage with real-time chat,
          and manage everything from one powerful dashboard.
        </p>

        <div className="hero-buttons">
          <Link to="/events" className="btn btn-primary btn-large">
            Browse Events
          </Link>
          {!user && (
            <Link to="/signup" className="btn btn-outline btn-large">
              Get Started
            </Link>
          )}
          {isOrganizer && (
            <Link to="/dashboard" className="btn btn-secondary btn-large">
              Create Event
            </Link>
          )}
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Events Hosted</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2M+</div>
            <div className="stat-label">Active Attendees</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <span className="section-badge">Features</span>
          <h2 className="section-title">Everything You Need to Run Successful Events</h2>
          <p className="section-subtitle">
            Powerful tools designed to help you create, manage, and scale your virtual events with ease
          </p>
        </div>

        <div className="grid grid-3">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📺</span>
            </div>
            <h3>Seamless Live Streaming</h3>
            <p>Connect your YouTube or Twitch account and go live in seconds. Professional-grade streaming infrastructure ensures crystal-clear quality for every attendee.</p>
            <ul className="feature-list">
              <li>Multi-platform integration</li>
              <li>HD streaming support</li>
              <li>Auto-scaling infrastructure</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">💬</span>
            </div>
            <h3>Real-time Engagement</h3>
            <p>Keep your audience engaged with lightning-fast chat, polls, and Q&A sessions. Build community and foster meaningful interactions during every event.</p>
            <ul className="feature-list">
              <li>Live chat & reactions</li>
              <li>Moderation tools</li>
              <li>Interactive Q&A</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📅</span>
            </div>
            <h3>Effortless Management</h3>
            <p>Create, schedule, and manage events from one intuitive dashboard. Automated reminders and analytics help you stay organized and informed.</p>
            <ul className="feature-list">
              <li>Easy event scheduling</li>
              <li>Automated notifications</li>
              <li>Detailed analytics</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🎯</span>
            </div>
            <h3>Smart Registration</h3>
            <p>Streamlined registration process that converts. Custom forms, automated confirmations, and attendee management made simple.</p>
            <ul className="feature-list">
              <li>One-click registration</li>
              <li>Custom form builder</li>
              <li>Attendee insights</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">🔒</span>
            </div>
            <h3>Enterprise Security</h3>
            <p>Your data and events are protected with enterprise-grade security. SSL encryption, secure authentication, and compliance you can trust.</p>
            <ul className="feature-list">
              <li>End-to-end encryption</li>
              <li>SOC 2 compliant</li>
              <li>Private event options</li>
            </ul>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <span className="feature-icon">📊</span>
            </div>
            <h3>Actionable Analytics</h3>
            <p>Understand your audience with in-depth analytics. Track attendance, engagement metrics, and viewer behavior to optimize future events.</p>
            <ul className="feature-list">
              <li>Real-time metrics</li>
              <li>Engagement tracking</li>
              <li>Export reports</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header">
          <span className="section-badge">How It Works</span>
          <h2 className="section-title">Go Live in 3 Simple Steps</h2>
          <p className="section-subtitle">
            No technical expertise required. Start hosting professional events in minutes.
          </p>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Create Your Event</h3>
              <p>Set up your event details, schedule, and streaming source in our intuitive dashboard. Connect your YouTube or Twitch account with one click.</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Share & Promote</h3>
              <p>Get a unique event link to share with your audience. Built-in promotion tools help you reach more attendees and maximize engagement.</p>
            </div>
          </div>

          <div className="step-arrow">→</div>

          <div className="step-card">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Go Live & Engage</h3>
              <p>Start your stream and interact with attendees through live chat. Monitor analytics in real-time and create unforgettable experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="social-proof">
        <div className="section-header">
          <span className="section-badge">Testimonials</span>
          <h2 className="section-title">Loved by Event Organizers Worldwide</h2>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "Streamly transformed how we host webinars. The interface is intuitive, and our attendees love the seamless experience. Engagement is up 300%!"
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">SJ</div>
              <div>
                <div className="author-name">Sarah Johnson</div>
                <div className="author-title">Marketing Director, TechCorp</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "The best event platform we've used. Setting up events takes minutes, and the real-time chat keeps our community engaged throughout."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MC</div>
              <div>
                <div className="author-name">Michael Chen</div>
                <div className="author-title">Founder, StreamEducate</div>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">
              "We've hosted over 200 events on Streamly. The reliability is outstanding, and the analytics help us improve every single time."
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">EP</div>
              <div>
                <div className="author-name">Emily Parker</div>
                <div className="author-title">Community Manager, DevHub</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Host Your Best Event Yet?</h2>
          <p className="cta-subtitle">
            Join thousands of organizers creating memorable virtual experiences with Streamly
          </p>
          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary btn-large">
              Browse Events
            </Link>
            {!user && (
              <Link to="/signup" className="btn btn-outline btn-large btn-white">
                Get Started
              </Link>
            )}
            {isOrganizer && (
              <Link to="/dashboard" className="btn btn-secondary btn-large">
                Create Event
              </Link>
            )}
          </div>
          <p className="cta-note">No credit card required • Free to start • Cancel anytime</p>
        </div>
      </section>
    </div>
  )
}

export default Home
