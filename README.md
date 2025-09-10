# PingPal - Realtime Chat Application

A modern, feature-rich realtime chat application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Socket.IO.

![PingPal Logo](/frontend/public/logo.svg)

## Features

- 🔐 **User Authentication**
  - Secure signup and login
  - JWT-based authentication
  - Protected routes

- 💬 **Real-time Messaging**
  - Instant message delivery
  - Online/offline user status
  - Message timestamps
  - Image sharing support
  - Read receipts

- 👤 **User Profile**
  - Customizable profile pictures
  - Profile information management
  - Cloudinary integration for image storage

- 🎨 **Customizable Themes**
  - 30+ built-in themes
  - Live theme preview
  - Persistent theme preferences

- 📱 **Responsive Design**
  - Mobile-friendly interface
  - Adaptive layout
  - Smooth transitions

## Tech Stack

### Frontend
- React.js
- Zustand (State Management)
- TailwindCSS + DaisyUI
- Socket.IO Client
- React Router DOM
- Axios
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.IO
- JWT Authentication
- Cloudinary
- CORS
- Cookie Parser

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Cloudinary account

### Installation

#### Using Docker Hub (Easiest)
1. Create a file named `docker-compose.prod.yml` and add the following content:
\`\`\`yaml
version: '3.8'

services:
  frontend:
    container_name: pingpal-frontend
    image: ritiksharma454/pingpal:frontend-v1.0
    ports:
      - "3000:80"
    depends_on:
      - backend
    environment:
      - NODE_ENV=production
    networks:
      - app-network

  backend:
    container_name: pingpal-backend
    image: ritiksharma454/pingpal:backend-v1.0
    env_file:
      - ./backend/.env
    ports:
      - "8000:8000"
    networks:
      - app-network
    depends_on:
      - mongodb

  mongodb:
    image: mongo:latest
    container_name: pingpal-db
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - app-network

volumes:
  mongodb_data:

networks:
  app-network:
    driver: bridge
\`\`\`

2. Create a `.env` file in the `backend` directory with the following variables:
```
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb://mongodb:27017/chat-app
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Run the application
```bash
docker compose -f docker-compose.prod.yml up -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000


#### Building from source with Docker

1. Clone the repository
```bash
git clone https://github.com/ritiksharma-code/Realtime-Chat-App.git
cd Realtime-Chat-App
```

2. Configure Environment Variables
Update the environment variables in `docker-compose.yml`:

```yaml
backend:
  environment:
    - NODE_ENV=production
    - PORT=8000
    - MONGODB_URI=mongodb://mongodb:27017/chat-app
    - JWT_SECRET=your_jwt_secret
    - CLOUDINARY_CLOUD_NAME=your_cloud_name
    - CLOUDINARY_API_KEY=your_api_key
    - CLOUDINARY_API_SECRET=your_api_secret
```

3. Build and Run with Docker Compose
```bash
docker compose up --build -d
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

#### Manual Installation (Development)

1. Install dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. Environment Variables

Create a .env file in the backend directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

3. Run the application

Development mode:
```bash
# Run backend
cd backend
npm run dev

# Run frontend (in a new terminal)
cd frontend
npm run dev
```

Production mode:
```bash
# Build and start
npm run build
npm start
```

## Features in Detail

### Authentication
- Secure password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Persistent login sessions

### Real-time Communication
- Socket.IO for real-time message delivery
- Online user tracking
- Typing indicators
- Message status updates

### File Sharing
- Image upload support
- Cloudinary integration for media storage
- Preview before sending
- Multiple file formats supported

### User Interface
- Clean and modern design
- Responsive layout
- Loading skeletons
- Toast notifications
- Error handling

## API Endpoints

### Auth Routes
- POST `/api/auth/signup` - Create new user
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- PUT `/api/auth/update-profile` - Update user profile
- GET `/api/auth/check` - Check authentication status

### Message Routes
- GET `/api/messages/users` - Get all users for sidebar
- GET `/api/messages/:id` - Get messages with specific user
- POST `/api/messages/send/:id` - Send message to user

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## Docker Configuration

The application is containerized using Docker and includes three services:

### 1. Frontend Service
- Uses Node.js for building and Nginx for serving
- Multi-stage build for optimized image size
- Configuration in `frontend/Dockerfile`
- Nginx configuration in `frontend/nginx.conf`

### 2. Backend Service
- Node.js application container
- Direct communication with MongoDB
- Environment variables for configuration
- Configuration in `backend/Dockerfile`

### 3. MongoDB Service
- Official MongoDB image
- Persistent volume for data storage
- Internal network for secure communication

### Docker Commands

```bash
# Build and start all services
docker compose up --build -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Rebuild specific service
docker compose up -d --build backend  # or frontend

# View running containers
docker compose ps
```

### Container Architecture
- Frontend container exposes port 3000
- Backend container exposes port 8000
- MongoDB container exposes port 27017 internally
- All services communicate through Docker network
- Nginx handles API proxying and static file serving

### Volume Management
- MongoDB data persisted in named volume
- Supports backup and restore operations
- Configuration in docker-compose.yml

## License

This project is licensed under the ISC License.

## Acknowledgments

- Socket.IO for real-time communication
- Cloudinary for image hosting
- DaisyUI for UI components
- All contributors and supporters
