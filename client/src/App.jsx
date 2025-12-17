import { Routes, Route } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import LiveRoom from './pages/LiveRoom'
import Dashboard from './pages/Dashboard'
import MyRegistrations from './pages/MyRegistrations'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />

          {/* Protected Routes - Any authenticated user */}
          <Route path="/live/:id" element={
            <ProtectedRoute>
              <LiveRoom />
            </ProtectedRoute>
          } />
          <Route path="/my-registrations" element={
            <ProtectedRoute>
              <MyRegistrations />
            </ProtectedRoute>
          } />

          {/* Protected Routes - Organizer only */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="organizer">
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App
