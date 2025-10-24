# Meeting Scheduler with Google Calendar Integration

A full-stack application for scheduling meetings with Google Calendar integration, built with React frontend and Laravel backend, with CI/CD using Jenkins.

## 🏗️ Architecture

```
meeting-scheduler-app/
├── backend/                    # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/  # API Controllers
│   │   ├── Models/            # Eloquent Models
│   │   └── Services/          # Business Logic
│   ├── database/
│   │   └── migrations/        # Database Migrations
│   ├── routes/
│   │   └── api.php           # API Routes
│   └── Dockerfile
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/       # Reusable Components
│   │   ├── pages/           # Page Components
│   │   └── services/        # API Service
│   └── Dockerfile
├── docker-compose.yml         # Docker orchestration
└── Jenkinsfile               # CI/CD Pipeline
```

## ✨ Features

- **Meeting Management**: Create, read, update, and delete meetings
- **Google Calendar Integration**: Sync meetings with Google Calendar
- **OAuth 2.0 Authentication**: Secure Google Calendar connection
- **Calendar View**: Visual calendar interface with react-big-calendar
- **Availability Checking**: Check time slot availability before scheduling
- **Responsive Design**: Mobile-friendly interface
- **Dockerized**: Easy deployment with Docker and Docker Compose
- **CI/CD**: Automated testing and deployment with Jenkins

## 🛠️ Technology Stack

### Backend
- **Framework**: Laravel 10.x
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum
- **Google Calendar API**: google/apiclient

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Calendar**: react-big-calendar
- **HTTP Client**: Axios
- **Notifications**: react-toastify

### DevOps
- **Containerization**: Docker & Docker Compose
- **CI/CD**: Jenkins
- **Version Control**: Git

## 📋 Prerequisites

- PHP 8.1 or higher
- Node.js 18 or higher
- Composer
- MySQL 8.0
- Docker & Docker Compose (for containerized deployment)
- Jenkins (for CI/CD)
- Google Cloud Console account (for Google Calendar API)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd meeting-scheduler-app
```

### 2. Google Calendar API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:8000/api/google/callback`
6. Save your Client ID and Client Secret

### 3. Backend Setup

```bash
cd backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure .env file with your settings
# - Database credentials
# - Google Calendar API credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
# - Frontend URL

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure .env with backend API URL
# REACT_APP_API_URL=http://localhost:8000/api

# Start development server
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- MySQL: localhost:3306

### Environment Configuration for Docker

Update environment variables in `docker-compose.yml` or create `.env` files in respective directories.

## 🔧 Configuration

### Backend Environment Variables

```env
# Application
APP_NAME="Meeting Scheduler"
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=meeting_scheduler
DB_USERNAME=root
DB_PASSWORD=

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Google Calendar API
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/google/callback
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 📡 API Endpoints

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create a new meeting
- `GET /api/meetings/{id}` - Get specific meeting
- `PUT /api/meetings/{id}` - Update meeting
- `DELETE /api/meetings/{id}` - Delete meeting
- `POST /api/meetings/{id}/sync` - Sync meeting to Google Calendar

### Google Calendar
- `GET /api/google/auth` - Get OAuth authorization URL
- `GET /api/google/callback` - OAuth callback handler
- `POST /api/google/disconnect` - Disconnect Google Calendar
- `GET /api/calendar/events` - Get calendar events
- `GET /api/calendar/availability` - Check time slot availability

## 🧪 Testing

### Backend Tests

```bash
cd backend
php artisan test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🚀 CI/CD with Jenkins

### Pipeline Setup

1. Install Jenkins plugins:
   - Docker Pipeline
   - Git
   - NodeJS
   - Pipeline

2. Create new Pipeline job

3. Configure SCM:
   - Repository URL
   - Credentials
   - Branch specifier

4. Pipeline script: Use `Jenkinsfile` from repository

5. Configure credentials:
   - Docker registry credentials
   - Deployment server SSH keys

### Pipeline Stages

1. **Checkout**: Clone repository
2. **Backend Tests**: Run PHPUnit tests
3. **Frontend Tests**: Run Jest tests
4. **Build**: Create production builds
5. **Docker Build**: Build Docker images
6. **Push**: Push images to registry (main branch only)
7. **Deploy**: Deploy to staging/production

## 📝 Development Workflow

1. Create a feature branch from `develop`
2. Make your changes
3. Write/update tests
4. Commit and push to repository
5. Create Pull Request
6. Jenkins will automatically run tests
7. After review, merge to `develop` for staging deployment
8. Merge to `main` for production deployment

## 🔒 Security Considerations

- Store sensitive credentials in environment variables
- Use HTTPS in production
- Implement rate limiting for API endpoints
- Regular security updates for dependencies
- Secure OAuth token storage
- Implement proper CORS configuration

## 📦 Database Schema

### meetings
- id (PK)
- user_id (FK)
- title
- description
- start_time
- end_time
- attendees (JSON)
- google_event_id
- timestamps

### users
- id (PK)
- name
- email
- password
- google_access_token
- timestamps

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For issues and questions:
- Create an issue in the repository
- Contact the development team

## 🗺️ Roadmap

- [ ] Email notifications for meetings
- [ ] Recurring meetings support
- [ ] Meeting templates
- [ ] Multiple calendar support
- [ ] Mobile application
- [ ] Video conferencing integration
- [ ] Meeting analytics and reports
