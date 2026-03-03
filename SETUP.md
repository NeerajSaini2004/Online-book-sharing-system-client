# BookShare Setup Guide

## Quick Start

### Option 1: Automatic Setup (Recommended)
1. Double-click `start-bookshare.bat`
2. Wait for both servers to start
3. Open http://localhost:3000 in your browser

### Option 2: Manual Setup

#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

#### Step 1: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### Step 2: Start MongoDB
```bash
# Windows
mongod --dbpath "C:\data\db"

# macOS/Linux
mongod --dbpath "/usr/local/var/mongodb"
```

#### Step 3: Create Test Users
```bash
cd backend
npm run seed:users
cd ..
```

#### Step 4: Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm start
```

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Student | student@test.com | student123 |
| Library | library@test.com | library123 |

## URLs

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5001
- **API Health**: http://localhost:5001/health
- **API Test**: http://localhost:5001/api/test

## Features

### ✅ Working
- User authentication (login/register)
- Frontend-backend connection
- MongoDB integration
- Role-based access (Admin/Student/Library)
- Responsive UI components
- API service layer

### 🚧 In Development
- Book listings
- Search functionality
- User dashboard
- File uploads
- Payment integration

## Troubleshooting

### MongoDB Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service (Windows)
net start MongoDB

# Create data directory
mkdir C:\data\db
```

### Port Issues
```bash
# Check what's running on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Connection Issues
1. Check if backend is running on port 5001
2. Verify MongoDB is connected
3. Check browser console for errors
4. Ensure no firewall blocking ports

## Development

### Adding New Features
1. Backend: Add routes in `backend/routes/`
2. Frontend: Add components in `src/components/`
3. API: Update `src/services/api.ts`

### Database
- Models: `backend/models/`
- Seeds: `backend/seeds/`
- Connection: `backend/config/db.js`

## Support

If you encounter issues:
1. Check the console logs
2. Verify all dependencies are installed
3. Ensure MongoDB is running
4. Check port availability

Happy coding! 🚀