# 📝 Todo Application

Full stack todo application built with NestJS, React, PostgreSQL, and Sequelize ORM, all containerized with Docker.

## 🚀 Features

- ✅ Create tasks
- ✅ View all tasks
- ✅ Mark tasks as complete
- ✅ Responsive design with dark mode
- ✅ Docker containerization
- ✅ Sequelize ORM for database operations
- ✅ GitHub Actions CI/CD pipeline
- ✅ Automated testing and coverage reports
- ✅ End-to-end testing with Playwright

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **E2E Testing**: Playwright

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
│   ├── test/                # Backend E2E tests
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
├── e2e/                     # Playwright E2E tests
│   ├── tests/
│   │   └── todo-app.spec.ts # Main test suite
│   ├── playwright.config.ts # Playwright configuration
│   ├── package.json         # E2E test dependencies
│   └── README.md           # E2E testing documentation
│
├── docker-compose.yml       # Docker Compose configuration
├── .dockerignore           # Docker ignore file
├── .github/
│   └── workflows/
│       ├── ci.yml           # GitHub Actions CI pipeline
│       └── e2e.yml          # GitHub Actions E2E tests
└── README.md               # Project documentation
```

## 🔄 CI/CD Pipeline

This project uses **GitHub Actions** for continuous integration and end-to-end testing. The pipelines automatically run on every push to the `main` branch.

### CI Pipeline (`.github/workflows/ci.yml`)

The CI pipeline consists of three jobs that run in parallel:

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

### E2E Testing Pipeline (`.github/workflows/e2e.yml`)

The E2E pipeline runs **after** the CI pipeline completes successfully:

#### Playwright E2E Tests
- Starts all services using Docker Compose
- Waits for database, backend, and frontend to be ready
- Installs Playwright and browser dependencies
- Runs comprehensive E2E tests
- Uploads Playwright HTML report as artifact

**Trigger Options:**
- Automatically runs after CI pipeline succeeds
- Can be manually triggered via GitHub Actions UI (`workflow_dispatch`)

### Viewing CI/CD Results

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Select a workflow run to see detailed results
4. Download artifacts:
   - **Coverage reports** from CI pipeline
   - **Playwright HTML report** from E2E pipeline
   - **Test results** for detailed debugging

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

### End-to-End (E2E) Tests with Playwright

**Prerequisites:**
- Node.js 18+ must be installed
- Backend and Frontend servers must be running (either via Docker or locally)
  - Backend: http://localhost:3000 or http://localhost:8080
  - Frontend: http://localhost:5173

#### Setup and Run E2E Tests Locally

1. **Navigate to the e2e directory**
   ```bash
   cd e2e
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers** (first time only)
   ```bash
   npx playwright install --with-deps
   ```

4. **Start the application** (in a separate terminal)
   ```bash
   # From the root directory
   docker compose up --build
   ```
   Or if running locally without Docker:
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run start:dev

   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

5. **Run the E2E tests**
   ```bash
   # Run all tests (headless)
   npm test

   # Run tests with visible browser
   npm run test:headed

   # Run tests in specific browser
   npm run test:chromium
   npm run test:webkit
   ```

6. **View test results**
   ```bash
   # Show HTML report
   npm run report
   ```

#### E2E Test Coverage

The Playwright test suite includes **40+ comprehensive tests** covering:

- ✅ **Initial page load** - Header, title, empty state
- ✅ **Dark mode** - Toggle functionality and persistence
- ✅ **Task creation** - Modal interactions, form validation, successful creation
- ✅ **Task completion** - Confirmation flow, task deletion
- ✅ **Toast notifications** - Success messages, auto-dismiss, manual close
- ✅ **Keyboard interactions** - Escape to close, Enter to submit
- ✅ **Responsive design** - Mobile and tablet viewports
- ✅ **Edge cases** - Long text, special characters, XSS prevention

For detailed documentation, see [e2e/README.md](./e2e/README.md)

#### CI/CD Integration

E2E tests run automatically in GitHub Actions after the CI pipeline succeeds:
- Located in `.github/workflows/e2e.yml`
- Starts all services using Docker Compose
- Runs full test suite in headless mode
- Uploads test reports as artifacts
- Can be manually triggered via GitHub Actions UI