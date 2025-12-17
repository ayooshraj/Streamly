import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { user, logout, isOrganizer } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          📺 Streamly
        </Link>

        <div className="navbar-links">
          <Link to="/events">Events</Link>
          
          {user ? (
            <>
              {isOrganizer ? (
                <Link to="/dashboard">Dashboard</Link>
              ) : (
                <Link to="/my-registrations">My Events</Link>
              )}
              <span className="navbar-user">Hi, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="btn btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
