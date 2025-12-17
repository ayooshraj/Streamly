import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext(null)

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || ''

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      setIsConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    setSocket(newSocket)

    return () => newSocket.disconnect()
  }, [user])

  const joinEvent = (eventId) => {
    if (socket && isConnected) socket.emit('join-event', eventId)
  }

  const leaveEvent = (eventId) => {
    if (socket && isConnected) socket.emit('leave-event', eventId)
  }

  const sendMessage = (eventId, message) => {
    if (socket && isConnected && user) {
      socket.emit('send-message', {
        eventId,
        userId: user.id,
        userName: user.name,
        message
      })
    }
  }

  const value = {
    socket,
    isConnected,
    joinEvent,
    leaveEvent,
    sendMessage
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) throw new Error('useSocket must be used within SocketProvider')
  return context
}

export default SocketContext
