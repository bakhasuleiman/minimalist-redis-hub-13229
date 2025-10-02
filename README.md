# Minimalist Productivity Hub - Full Stack Application

A comprehensive productivity platform with a minimalistic design, featuring task management, note-taking, goal tracking, financial monitoring, and content creation capabilities.

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM v6
- **State Management**: React Query (TanStack Query)
- **Design**: Minimalistic black & white with Redis red accent
- **Port**: 8080

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting
- **Port**: 3001

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd minimalist-redis-hub-13229
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd backend
npm install
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
```

5. **Return to root directory**
```bash
cd ..
```

### Running the Application

#### Option 1: Automated Start (Recommended)
```bash
# Windows Batch
start-fullstack.bat

# Or PowerShell
.\start-fullstack.ps1
```

#### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (new terminal)
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3001
- **API Health Check**: http://localhost:3001/health
- **API Documentation**: `/backend/API_DOCUMENTATION.md`

## 📋 Features

### Core Modules

1. **📋 Tasks Management**
   - Create, update, complete, and delete tasks
   - Privacy controls (private, public, shared)
   - Real-time progress tracking

2. **📝 Notes System**
   - Rich text note creation and editing
   - Content sharing and collaboration
   - Search and organization

3. **🎯 Goals Tracking** 
   - Goal setting with deadlines
   - Progress percentage tracking
   - Achievement milestones

4. **💰 Finance Management**
   - Income and expense tracking
   - Balance calculation
   - Financial statistics and insights

5. **📚 Articles/Blog**
   - Content creation and publishing
   - Draft and published states
   - Public/private content

6. **📊 Activity Feed**
   - Real-time activity tracking
   - User action logging
   - Social feed of public activities

### Technical Features

- **🔐 Authentication**: JWT-based user authentication
- **🛡️ Privacy Controls**: Three-tier privacy system
- **⌨️ Keyboard Navigation**: Comprehensive hotkey system
- **📱 Responsive Design**: Mobile-first approach
- **🎨 Minimalist UI**: Clean, distraction-free interface
- **⚡ Real-time Updates**: Live data synchronization
- **🔍 API Integration**: RESTful API with comprehensive endpoints

## 🎮 Keyboard Shortcuts

- **1-6**: Navigate between modules
- **C or N**: Create new item in current module
- **Esc**: Go back/cancel
- **?**: Show help modal

## 🔧 Development

### Project Structure
```
/
├── src/                 # Frontend source
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Utilities and API client
│   └── ...
├── backend/            # Backend application
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/     # API routes
│   │   ├── middleware/ # Express middleware
│   │   ├── lib/        # Database and utilities
│   │   └── server.ts   # Entry point
│   ├── prisma/         # Database schema
│   └── ...
└── ...
```

### API Endpoints

- **Authentication**: `/api/auth/*`
- **Tasks**: `/api/tasks/*`
- **Notes**: `/api/notes/*`
- **Goals**: `/api/goals/*`
- **Finance**: `/api/finance/*`
- **Articles**: `/api/articles/*`
- **Activity Feed**: `/api/feed/*`

See `/backend/API_DOCUMENTATION.md` for detailed API documentation.

### Database Schema

The application uses SQLite with Prisma ORM. Key models:
- Users (authentication)
- Tasks, Notes, Goals, Transactions, Articles (content)
- Sharing system (privacy controls)
- Activity logging (user actions)

### Environment Variables

#### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3001/api
```

#### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:8080
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization
- SQL injection protection (Prisma ORM)

## 🚦 Privacy System

- **Private**: Only creator can access
- **Public**: All users can view
- **Specific**: Shared with selected users by email

## 📊 Monitoring & Logging

- Activity tracking for all user actions
- API request logging
- Error handling and reporting
- Performance monitoring

## 🔧 Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 3001 and 8080 are available
2. **Database issues**: Run `npx prisma db push` in backend directory
3. **Module resolution**: Ensure all dependencies are installed
4. **CORS errors**: Check backend CORS configuration

### Reset Database
```bash
cd backend
npx prisma db push --force-reset
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Built with modern React and Node.js ecosystem
- Inspired by minimalist design principles
- Uses Redis branding color as accent
- Powered by TypeScript for type safety
