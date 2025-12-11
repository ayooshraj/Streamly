# Streamly - Virtual Event Hosting Platform

A full-stack virtual event hosting platform that supports live streaming, attendee registration, real-time chat, and event scheduling.

## Features

- **User Authentication** - Signup/Login with JWT tokens
- **Role-based Access** - Organizers and Attendees
- **Event Management** - Create, edit, and manage virtual events
- **Live Streaming** - Embed YouTube/Twitch streams
- **Real-time Chat** - Socket.IO powered live chat during events
- **Event Scheduling** - Session management with PostgreSQL
- **Registration System** - Attendees can register for events

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- PostgreSQL
- Socket.IO
- JWT Authentication

### Frontend
- React 18
- React Router v6
- Axios
- Socket.IO Client

### Deployment
- Render (Backend & Frontend)
- MongoDB Atlas
- Neon PostgreSQL

## Project Structure

```
streamly/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context (Auth, Socket)
│   │   ├── hooks/          # Custom hooks
│   │   └── utils/          # Helper functions
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/             # Database & Socket config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, validation middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── socket/             # Socket.IO handlers
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Neon PostgreSQL account

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/streamly.git
cd streamly
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd ../client
npm install
```

4. Create environment file
```bash
cd ../server
cp ../.env.example .env
# Edit .env with your credentials
```

5. Run development servers

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Organizer)
- `PUT /api/events/:id` - Update event (Organizer)
- `DELETE /api/events/:id` - Delete event (Organizer)

### Registrations
- `POST /api/registrations` - Register for event
- `GET /api/registrations/my-registrations` - Get user's registrations
- `PATCH /api/registrations/:id/cancel` - Cancel registration

### Sessions (PostgreSQL)
- `GET /api/sessions/event/:eventId` - Get event sessions
- `POST /api/sessions` - Create session (Organizer)
- `PUT /api/sessions/:id` - Update session (Organizer)
- `DELETE /api/sessions/:id` - Delete session (Organizer)

### Chat
- `GET /api/chat/:eventId` - Get chat messages

## Team

- Member 1: Authentication & User Management
- Member 2: Events & Registrations
- Member 3: Live Room, Chat & Sessions

## License

MIT
# Streamly
