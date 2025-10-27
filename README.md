# 📝 Todo Application

Full stack todo application built with NestJS, React, PostgreSQL, and Sequelize ORM, all containerized with Docker.

## 🚀 Features

- ✅ Create tasks
- ✅ View all tasks
- ✅ Mark tasks as complete
- ✅ Responsive design
- ✅ Docker containerization
- ✅ Sequelize ORM for database operations
- ✅ GitHub Actions CI pipeline
- ✅ Automated testing and coverage reports

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

### For Running the Application (Docker Only)
- **Docker Desktop** (includes Docker Compose)
  - That's it! No Node.js installation needed on your machine.
  - Docker will handle all dependencies inside containers.

### For Local Development (Optional)
- Node.js 18+
- npm or yarn

## 🏃 Running the Application with Docker

### Setup Instructions

1. **Install Docker Desktop**
   - Download from: https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop
   - Verify installation: `docker --version` and `docker-compose --version`

2. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ToDo
   ```

3. **Run the application**
   ```bash
   docker compose up --build
   ```
   - First build may take a few minutes as it downloads images and installs dependencies
   - Subsequent runs will be faster using cached layers

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Managing the Application

**Stop the application:**
```bash
docker compose down
```

**Stop and remove volumes (clears database):**
```bash
docker compose down -v
```

## 📁 Project Structure

```
ToDo/
├── backend/                  # NestJS backend application
│   ├── src/
│   │   ├── task/            # Task module (controller, service, model)
│   │   ├── app.module.ts    # Main application module
│   │   └── main.ts          # Application entry point
│   ├── test/                # E2E tests
│   ├── coverage/            # Test coverage reports
│   ├── Dockerfile           # Backend Docker configuration
│   ├── package.json         # Backend dependencies
│   └── jest.config.js       # Jest test configuration
│
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── App.tsx          # Main App component
│   │   └── main.tsx         # Application entry point
│   ├── public/              # Static assets
│   ├── coverage/            # Test coverage reports
│   ├── Dockerfile           # Frontend Docker configuration
│   ├── package.json         # Frontend dependencies
│   └── jest.config.js       # Jest test configuration
│
├── docker-compose.yml       # Docker Compose configuration
├── .dockerignore           # Docker ignore file
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI pipeline
└── README.md               # Project documentation
```

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration. The CI pipeline automatically runs on every push to the `main` branch.

### What the CI Pipeline Does

The pipeline consists of three jobs that run in parallel:

#### 1. Backend CI
- Installs dependencies
- Runs ESLint for code quality
- Executes unit tests
- Generates test coverage report
- Builds the backend application
- Uploads coverage report as artifact

#### 2. Frontend CI
- Installs dependencies
- Runs ESLint for code quality
- Executes unit tests
- Generates test coverage report
- Builds the frontend application
- Uploads coverage report as artifact

#### 3. Docker Build
- Validates Docker Compose configuration
- Builds backend Docker image
- Builds frontend Docker image
- Uses GitHub Actions cache for faster builds

### Viewing CI Results

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Select a workflow run to see detailed results
4. Download coverage reports from the **Artifacts** section

## 🧪 Running Tests (Optional)

### Backend Tests

**Prerequisites:** Node.js 18+ must be installed

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Run unit tests**
   ```bash
   npm test
   ```

3. **Run E2E tests**
   ```bash
   npm run test:e2e
   ```

4. **Generate coverage report**
   ```bash
   npm run test:cov
   ```
   Coverage report will be available in `backend/coverage/lcov-report/index.html`

### Frontend Tests

**Prerequisites:** Node.js 18+ must be installed

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Generate coverage report**
   ```bash
   npm run test:coverage
   ```
   Coverage report will be available in `frontend/coverage/lcov-report/index.html`