import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/SocketContext'
import './LiveRoom.css'

const API_URL = import.meta.env.VITE_API_URL || ''

const LiveRoom = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { socket, isConnected, joinEvent, leaveEvent, sendMessage } = useSocket()
  
  const [event, setEvent] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  
  const messagesEndRef = useRef(null)

  useEffect(() => {
    fetchEventAndMessages()
    
    return () => {
      if (id) leaveEvent(id)
    }
  }, [id])

  useEffect(() => {
    if (isConnected && id) {
      joinEvent(id)
    }
  }, [isConnected, id])

  useEffect(() => {
    if (socket) {
      socket.on('new-message', (message) => {
        setMessages(prev => [...prev, message])
      })

      socket.on('announcement', (data) => {
        setMessages(prev => [...prev, {
          _id: Date.now(),
          senderName: '📢 Announcement',
          message: data.message,
          timestamp: data.timestamp,
          isAnnouncement: true
        }])
      })

      return () => {
        socket.off('new-message')
        socket.off('announcement')
      }
    }
  }, [socket])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchEventAndMessages = async () => {
    try {
      const token = localStorage.getItem('token')
      const [eventRes, chatRes] = await Promise.all([
        axios.get(`${API_URL}/api/events/${id}`),
        axios.get(`${API_URL}/api/chat/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      setEvent(eventRes.data.event)
      setMessages(chatRes.data.messages)
    } catch (err) {
      console.error('Error:', err)
      navigate('/events')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    sendMessage(id, newMessage.trim())
    setNewMessage('')
  }

  const getEmbedUrl = (url) => {
    if (!url) return null
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`
    }
    return url
  }

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>
  }

  if (!event) {
    return <div className="alert alert-error">Event not found</div>
  }

  return (
    <div className="live-room">
      <div className="stream-section">
        <div className="stream-header">
          <h1>{event.title}</h1>
          <span className={`event-status status-${event.streamStatus}`}>
            {event.streamStatus === 'live' ? '🔴 LIVE' : event.streamStatus}
          </span>
        </div>
        
        <div className="video-container">
          {event.streamUrl ? (
            <iframe
              src={getEmbedUrl(event.streamUrl)}
              title={event.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="no-stream">
              <p>Stream not started yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="chat-section">
        <div className="chat-header">
          <h3>💬 Live Chat</h3>
          <span className={`connection-status ${isConnected ? 'connected' : ''}`}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>
        
        <div className="chat-messages">
          {messages.map(msg => (
            <div 
              key={msg._id} 
              className={`chat-message ${msg.isAnnouncement ? 'announcement' : ''}`}
            >
              <span className="message-sender">{msg.senderName}</span>
              <span className="message-text">{msg.message}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            maxLength={500}
          />
          <button type="submit" disabled={!isConnected}>Send</button>
        </form>
      </div>
    </div>
  )
}

export default LiveRoom
