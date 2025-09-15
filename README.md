# AI Customer Support Agent

A full-stack AI-powered customer support application built with modern MERN stack technologies. This project provides an intelligent chat interface with secure authentication, conversation management, and real-time AI responses.

## Live Demo

**[Try the live application](https://virallens-agent.netlify.app/)**

## Screenshots

### Registration & Authentication
![Register](https://via.placeholder.com/800x400?text=Registration+Page)
![Login](https://via.placeholder.com/800x400?text=Login+Page)

### Dashboard & Chat Interface
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard)
![Chat](https://via.placeholder.com/800x400?text=Chat+Interface)
![Chat History](https://via.placeholder.com/800x400?text=Chat+History)

## Tech Stack

### Frontend
- **React** with Vite for fast development
- **TailwindCSS** for modern, responsive styling
- **JWT Authentication** for secure sessions
- Deployed on **Netlify**

### Backend
- **Node.js** with Express framework
- **MongoDB Atlas** with Mongoose ODM
- **JWT + bcrypt** for authentication security
- **OpenRouter API** for AI responses
- Deployed on **Render**

### DevOps
- **Docker** containerization
- **GitHub Actions** for CI/CD (optional)

## Project Structure

```
server/
│── src/
│   ├── index.js                    # Main Express app entry point
│   ├── config/database.js          # MongoDB connection setup
│   ├── middleware/auth.js          # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                 # User schema with hashed passwords
│   │   └── Conversation.js         # Conversation and message schema
│   ├── controllers/
│   │   ├── authController.js       # Authentication logic
│   │   ├── chatController.js       # AI chat and message handling
│   │   └── conversationController.js # Conversation management
│   ├── routes/
│   │   ├── auth.js                 # Authentication routes
│   │   ├── chat.js                 # Chat API routes
│   │   └── conversations.js        # Conversation management routes
│   └── utils/
│       ├── jwt.js                  # JWT utilities
│       └── openRouter.js           # OpenRouter API integration
├── package.json
├── Dockerfile
└── docker-compose.yml
```

## Features

- ** Secure Authentication**: JWT-based auth with bcrypt password hashing
- ** Real-time AI Chat**: Powered by OpenRouter API for intelligent responses
- ** Conversation Management**: Save, view, and organize chat history
- ** User Profiles**: Customizable user preferences and settings
- ** Responsive Design**: Mobile-friendly interface with TailwindCSS
- ** Docker Support**: Containerized for easy deployment
- ** Cloud Deployment**: Production-ready deployment on Netlify and Render

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- OpenRouter API key

### Environment Setup

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-jwt-secret-key
OPENROUTER_API_KEY=your-openrouter-api-key
```

### Installation & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/SURIYAPRASAAD04/Virallens-Customer-Support-Agent.git
   cd Virallens-Customer-Support-Agent
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run individual services
docker build -t ai-support-backend .
docker run -p 5000:5000 ai-support-backend
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/register` | ❌ | User registration |
| POST | `/api/auth/login` | ❌ | User login |
| POST | `/api/auth/logout` | ✅ | User logout |
| GET | `/api/auth/profile` | ✅ | Get user profile |
| PUT | `/api/auth/profile` | ✅ | Update user profile |

### Chat Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/chat/send` | ✅ | Send message and get AI response |

### Conversation Endpoints

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/api/conversations/:userId` | ✅ | Get all user conversations |
| GET | `/api/conversations/single/:conversationId` | ✅ | Get specific conversation |
| POST | `/api/conversations/save` | ✅ | Save new conversation |
| POST | `/api/conversations/update-title` | ✅ | Update conversation title |
| DELETE | `/api/conversations/bulk` | ✅ | Delete multiple conversations |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server and database status |

##  Database Schema

### Users Collection
```javascript
{
  "_id": ObjectId,
  "fullName": String,
  "email": String (unique),
  "password": String (bcrypt hashed),
  "avatar": String (nullable),
  "role": String (user/admin),
  "isVerified": Boolean,
  "lastLogin": Date,
  "preferences": {
    "notifications": { "email": Boolean, "push": Boolean },
    "theme": String (light/dark),
    "language": String
  },
  "status": String (active/inactive/banned),
  "createdAt": Date,
  "updatedAt": Date
}
```

### Conversations Collection
```javascript
{
  "_id": ObjectId,
  "conversation_id": String,
  "user_id": ObjectId (ref: users),
  "title": String,
  "type": String,
  "status": String,
  "preview": String,
  "messages": [{
    "content": String,
    "isUser": Boolean,
    "timestamp": Date
  }],
  "messageCount": Number,
  "duration": Number,
  "createdAt": Date,
  "updatedAt": Date
}
```

## Configuration

### Frontend Configuration
- API base URL configuration in `utils/api.js`
- JWT token management with localStorage
- Responsive design with TailwindCSS utilities

### Backend Configuration
- CORS enabled for frontend domain
- JWT middleware for protected routes
- MongoDB connection with error handling
- OpenRouter API integration with error handling

## Deployment

### Frontend (Netlify)
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables for API endpoints

### Backend (Render)
1. Connect GitHub repository to Render
2. Select Node.js environment
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## Author

**Suriya Prasaad S**
- GitHub: [@SURIYAPRASAAD04](https://github.com/SURIYAPRASAAD04)
- Email: suriyaprasaadjayasugumar04@gmail.com 

## Support

If you have any questions or need support, please:
1. Check the [Issues](https://github.com/SURIYAPRASAAD04/Virallens-Customer-Support-Agent/issues) page
2. Create a new issue if your problem isn't already listed
3. Contact me directly via email



**Star this repository if you found it helpful!**

*Last updated: September 16, 2025*
