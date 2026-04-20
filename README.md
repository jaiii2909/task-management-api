# Task Management API v2.0

**Event-Driven Notifications & Advanced Data Handling**

A comprehensive RESTful API for task management with real-time reminders, webhook notifications, categories, tags, and advanced filtering capabilities. Built with Node.js, Express.js, PostgreSQL, MongoDB, Redis, and BullMQ.

## 🆕 What's New in v2.0 (Assignment 3)

### ✨ New Features

1. **Real-Time Task Reminders**
   - Automated reminders triggered 1 hour before task due date
   - Powered by BullMQ and Redis for reliable job scheduling
   - Intelligent handling of task updates and completions
   - Console logging and optional webhook notifications

2. **Task Categorization**
   - Create custom categories with names, descriptions, and colors
   - User-specific categories with full CRUD operations
   - Filter tasks by category
   - Associate tasks with categories

3. **Task Tagging System**
   - Add multiple free-form tags to tasks
   - Filter tasks by single or multiple tags
   - Get list of all used tags
   - Maximum 10 tags per task

4. **Webhook Integration**
   - Automated webhook notifications when tasks are completed
   - Configurable webhook URL via environment variables
   - Exponential backoff retry logic (3 attempts)
   - Detailed payload with task information

5. **Advanced Task Filtering**
   - Filter by category, tags, and status
   - Combine multiple filters
   - Efficient database queries with indexes

## 🚀 Features

### Core Features (v1.0)
- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Task CRUD operations
- ✅ User-specific task isolation
- ✅ Input validation with Joi
- ✅ Global error handling
- ✅ RESTful API design

### Advanced Features (v2.0)
- ✅ Real-time task reminders (BullMQ)
- ✅ Task categories with colors
- ✅ Multi-tag support
- ✅ Advanced filtering
- ✅ Webhook notifications with retry logic
- ✅ Event-driven architecture
- ✅ Reminder rescheduling on task updates

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Redis** (v6 or higher) - [Download](https://redis.io/download/) - **NEW for v2.0**
- **npm** or **yarn** package manager

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd task-management-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Databases

#### PostgreSQL
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskmanagement;

# Or use the SQL script
psql -U postgres -f database/setup.sql
```

#### MongoDB
```bash
# Start MongoDB
# On Linux/Mac:
sudo systemctl start mongod
# On Windows:
net start MongoDB

# Verify
mongosh
```

#### Redis (NEW)
```bash
# On Linux:
sudo systemctl start redis

# On Mac:
brew services start redis

# On Windows:
# Download from https://github.com/microsoftarchive/redis/releases
# Or use Docker

# Verify
redis-cli ping
# Should return: PONG
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=taskmanagement
PG_USER=postgres
PG_PASSWORD=your_actual_password

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/taskmanagement

# Redis Configuration (NEW)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration
JWT_SECRET=generate_a_strong_random_secret_here
JWT_EXPIRE=7d

# Webhook Configuration (NEW)
WEBHOOK_URL=https://webhook.site/your-unique-url
WEBHOOK_RETRY_ATTEMPTS=3
WEBHOOK_RETRY_DELAY=1000

# Notification Configuration (NEW)
REMINDER_TIME_BEFORE_DUE=60
```

**Important:**
- Get your webhook URL from [webhook.site](https://webhook.site/)
- `REMINDER_TIME_BEFORE_DUE` is in minutes (default: 60 = 1 hour before due date)

### 5. Start the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Connected to MongoDB database
✅ Connected to Redis
✅ Users table created/verified
✅ Reminder service initialized
============================================================
🚀 Task Management API v2.0
============================================================
📍 Server: http://localhost:5000
📍 Environment: development
✨ Features:
   - User Authentication (JWT)
   - Task Management (CRUD)
   - Categories & Tags
   - Real-time Reminders (BullMQ)
   - Webhook Notifications
============================================================
```

### 6. Using Docker (Recommended)

The easiest way to run all services:

```bash
# Start all services (PostgreSQL, MongoDB, Redis, App)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. Register User
**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 2. Login User
**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 3. Get Profile
**GET** `/api/auth/profile`

Headers: `Authorization: Bearer <token>`

---

### Category Endpoints (NEW)

All category endpoints require authentication.

#### 4. Create Category
**POST** `/api/categories`

Headers: `Authorization: Bearer <token>`

```json
{
  "name": "Work",
  "description": "Work-related tasks",
  "color": "#3B82F6"
}
```

Response:
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category": {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "work",
      "description": "Work-related tasks",
      "color": "#3B82F6",
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### 5. Get All Categories
**GET** `/api/categories`

Headers: `Authorization: Bearer <token>`

#### 6. Get Category by ID
**GET** `/api/categories/:id`

#### 7. Update Category
**PUT** `/api/categories/:id`

```json
{
  "description": "Updated description",
  "color": "#EF4444"
}
```

#### 8. Delete Category
**DELETE** `/api/categories/:id`

---

### Task Endpoints (Enhanced)

#### 9. Create Task (Enhanced)
**POST** `/api/tasks`

Headers: `Authorization: Bearer <token>`

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "status": "pending",
  "category": "65a1b2c3d4e5f6g7h8i9j0k1",
  "tags": ["urgent", "high-priority", "documentation"]
}
```

**What happens:**
- Task is created in MongoDB
- If due date is in future, a reminder is scheduled in BullMQ
- Reminder will trigger 60 minutes before due date (configurable)

#### 10. Get All Tasks (Enhanced with Filters)
**GET** `/api/tasks?category=<categoryId>&tags=urgent,important&status=pending`

Query Parameters:
- `category` - Filter by category ID
- `tags` - Filter by tags (comma-separated for multiple)
- `status` - Filter by status (pending/completed)

Example:
```
GET /api/tasks?tags=urgent&status=pending
GET /api/tasks?category=65a1b2c3d4e5f6g7h8i9j0k1
GET /api/tasks?tags=urgent,high-priority&status=pending
```

#### 11. Get Task by ID
**GET** `/api/tasks/:id`

#### 12. Update Task (Enhanced)
**PUT** `/api/tasks/:id`

```json
{
  "status": "completed",
  "tags": ["completed", "archived"]
}
```

**What happens:**
- If status changes to "completed":
  - `completedAt` timestamp is set
  - Scheduled reminder is cancelled
  - Webhook is triggered to external service
- If due date changes:
  - Existing reminder is cancelled
  - New reminder is scheduled

#### 13. Delete Task
**DELETE** `/api/tasks/:id`

**What happens:**
- Scheduled reminder (if any) is cancelled
- Task is deleted from MongoDB

#### 14. Get All Tags (NEW)
**GET** `/api/tasks/tags/list`

Returns all unique tags used by the authenticated user:

```json
{
  "success": true,
  "count": 5,
  "data": {
    "tags": ["urgent", "high-priority", "bug-fix", "feature", "documentation"]
  }
}
```

---

## 🎯 Event-Driven Features

### 1. Real-Time Reminders

**How it works:**

1. **Task Creation:**
   ```
   User creates task with dueDate: "2024-12-31 15:00:00"
   ↓
   System calculates reminder time: 60 minutes before = "2024-12-31 14:00:00"
   ↓
   Job is scheduled in BullMQ/Redis
   ↓
   At 14:00:00, reminder is triggered
   ```

2. **Reminder Output:**
   ```
   ⏰ ===== REMINDER TRIGGERED =====
   Task ID: 65a1b2c3d4e5f6g7h8i9j0k1
   User ID: 1
   Title: Complete project documentation
   Due Date: 2024-12-31T15:00:00.000Z
   Triggered At: 2024-12-31T14:00:00.000Z
   ================================
   ```

3. **Reminder sent to webhook (if configured):**
   ```json
   {
     "type": "task_reminder",
     "timestamp": "2024-12-31T14:00:00.000Z",
     "taskId": "65a1b2c3d4e5f6g7h8i9j0k1",
     "userId": 1,
     "title": "Complete project documentation",
     "dueDate": "2024-12-31T15:00:00.000Z",
     "message": "Reminder: Task 'Complete project documentation' is due in 1 hour!"
   }
   ```

**Intelligent Handling:**

- **Task Updated:** Reminder is rescheduled with new due date
- **Task Completed:** Reminder is cancelled
- **Task Deleted:** Reminder is cancelled
- **Reminder time in past:** Reminder is not scheduled

### 2. Webhook Notifications

**Triggered when:** Task status changes to "completed"

**Payload sent to webhook:**
```json
{
  "event": "task.completed",
  "timestamp": "2024-01-15T16:45:00.000Z",
  "data": {
    "taskId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "userId": 1,
    "completedAt": "2024-01-15T16:45:00.000Z",
    "createdAt": "2024-01-10T09:00:00.000Z",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "category": "65a1b2c3d4e5f6g7h8i9j0k1",
    "tags": ["urgent", "documentation"]
  }
}
```

**Retry Logic:**

```
Attempt 1: Failed (500 Server Error)
↓ Wait 1000ms
Attempt 2: Failed (Timeout)
↓ Wait 2000ms (exponential backoff)
Attempt 3: Failed
↓
Give up, log error
```

**Console Output:**
```
🔔 ===== WEBHOOK TRIGGERED =====
URL: https://webhook.site/abc123
Attempt: 1/4
Payload: {...}
✅ Webhook sent successfully
Status: 200
================================
```

---

## 🗂️ Project Structure

```
task-management-api/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   ├── mongodb.js           # MongoDB connection
│   │   └── redis.js             # Redis connection (NEW)
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── taskController.js    # Task CRUD + filtering (ENHANCED)
│   │   └── categoryController.js # Category management (NEW)
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── validate.js          # Request validation
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # PostgreSQL User model
│   │   ├── Task.js              # MongoDB Task model (ENHANCED)
│   │   └── Category.js          # MongoDB Category model (NEW)
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── taskRoutes.js        # Task endpoints (ENHANCED)
│   │   └── categoryRoutes.js    # Category endpoints (NEW)
│   ├── services/
│   │   ├── reminderService.js   # BullMQ reminder jobs (NEW)
│   │   └── webhookService.js    # Webhook with retry logic (NEW)
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   ├── validators/
│   │   └── schemas.js           # Joi validation schemas (ENHANCED)
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server startup
├── database/
│   └── setup.sql                # PostgreSQL setup script
├── .env.example                 # Environment variables template (UPDATED)
├── .gitignore
├── docker-compose.yml           # Docker orchestration (UPDATED)
├── Dockerfile
├── package.json                 # Dependencies (UPDATED)
└── README.md                    # This file
```

---

## 🏗️ Design Decisions

### 1. Task Categorization Approach

**Decision:** User-specific dynamic categories

**Rationale:**
- Each user can create their own categories
- Categories are stored in MongoDB (flexible schema)
- No pre-defined categories - users have full control
- Categories include name, description, and color for better UX
- Lowercase normalization prevents duplicates

**Alternative Considered:** Pre-defined categories
- Rejected because different users have different needs
- A developer might need "Bug Fix", "Feature", "Refactor"
- A student might need "Homework", "Project", "Exam"

### 2. Tag Management System

**Decision:** Free-form tags (array of strings)

**Rationale:**
- Maximum flexibility for users
- No need to pre-create tags
- Tags automatically populated from usage
- Can add multiple tags per task (max 10)
- Indexed for fast filtering

**Implementation:**
- Tags stored as array in Task model
- Separate endpoint to get all used tags
- Filter by single tag or multiple tags (OR logic)

**Alternative Considered:** Tag entity with relationships
- Rejected due to added complexity
- Free-form tags are simpler and more flexible

### 3. Reminder Scheduling System

**Decision:** BullMQ with Redis for job queue

**Rationale:**
- **Reliability:** Jobs persist in Redis (survive server restarts)
- **Scalability:** Can handle thousands of scheduled tasks
- **Retry Logic:** Built-in retry mechanisms
- **Distributed:** Can run multiple workers
- **Production-Ready:** Battle-tested in production systems

**How Reminders Work:**

```
Task Created (dueDate: Dec 31, 15:00)
         ↓
Calculate reminder time (14:00)
         ↓
Create BullMQ job with delay
         ↓
Job stored in Redis
         ↓
[Time passes...]
         ↓
Job executes at 14:00
         ↓
Worker processes job
         ↓
Check task still exists & pending
         ↓
Log reminder & send webhook
```

**Cancellation & Rescheduling:**
- Each task stores its `reminderJobId`
- On update/delete, job is removed from queue
- On due date change, old job cancelled, new job created
- On completion, job cancelled

**Alternative Considered:** Simple setTimeout
- Rejected because:
  - Lost on server restart
  - Memory-intensive for many tasks
  - No persistence
  - Not production-ready

### 4. Webhook Retry Logic

**Decision:** Exponential backoff with configurable attempts

**Implementation:**
```javascript
Attempt 1: Immediate
Attempt 2: After 1000ms
Attempt 3: After 2000ms
Attempt 4: After 4000ms
```

**Rationale:**
- Handles temporary network issues
- Prevents overwhelming failed services
- Exponential backoff is industry standard
- Configurable via environment variables

**Configuration:**
- `WEBHOOK_RETRY_ATTEMPTS`: Number of retries (default: 3)
- `WEBHOOK_RETRY_DELAY`: Base delay in ms (default: 1000)

**Alternative Considered:** Webhook queue with dead letter queue
- Too complex for this use case
- Current solution is simpler and sufficient

### 5. Database Design

**PostgreSQL for Users:**
- Relational data (users)
- ACID compliance for auth
- Structured schema

**MongoDB for Tasks & Categories:**
- Flexible schema for tags
- Better for nested data (category reference)
- Fast queries with indexes

**Redis for Job Queue:**
- In-memory speed
- Perfect for ephemeral job queue
- BullMQ integration

---

## 🧪 Testing Guide

### Test Reminder System

1. Create a task with due date 2 minutes in future:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Reminder",
    "description": "Testing reminder system",
    "dueDate": "2024-01-15T10:03:00.000Z"
  }'
```

2. Set `REMINDER_TIME_BEFORE_DUE=1` in .env (1 minute)

3. Watch console - reminder should trigger 1 minute before due date

### Test Webhook Integration

1. Get unique URL from [webhook.site](https://webhook.site/)

2. Set in `.env`:
```env
WEBHOOK_URL=https://webhook.site/your-unique-id
```

3. Create and complete a task:
```bash
# Create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Webhook",
    "description": "Testing webhook integration",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "status": "pending"
  }'

# Complete task
curl -X PUT http://localhost:5000/api/tasks/TASK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'
```

4. Check webhook.site - you should see the payload

### Test Categories & Tags

```bash
# Create category
curl -X POST http://localhost:5000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Work",
    "description": "Work tasks",
    "color": "#3B82F6"
  }'

# Create task with category and tags
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Development",
    "description": "Build REST API",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "category": "CATEGORY_ID",
    "tags": ["urgent", "backend", "api"]
  }'

# Filter tasks by tag
curl -X GET "http://localhost:5000/api/tasks?tags=urgent" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get all tags
curl -X GET http://localhost:5000/api/tasks/tags/list \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Troubleshooting

### Redis Connection Error

**Error:** `❌ Redis connection error`

**Solution:**
```bash
# Check if Redis is running
redis-cli ping

# If not, start Redis
sudo systemctl start redis  # Linux
brew services start redis   # Mac
```

### Reminders Not Working

**Checklist:**
- [ ] Redis is running
- [ ] `.env` has `REDIS_HOST` and `REDIS_PORT`
- [ ] Due date is in the future
- [ ] `REMINDER_TIME_BEFORE_DUE` is reasonable (e.g., 60)

**Debug:**
```bash
# Check Redis
redis-cli
> KEYS *
> EXIT

# Check BullMQ jobs
npm install -g bull-board
# Then access http://localhost:3000/queues
```

### Webhook Not Receiving Data

**Checklist:**
- [ ] `WEBHOOK_URL` is set in `.env`
- [ ] URL is accessible (test with curl)
- [ ] Task status changed to "completed"

**Debug:**
Check console logs for webhook attempts

---

## 📦 Dependencies

### Production
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **pg** - PostgreSQL client
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **joi** - Data validation
- **cors** - Cross-origin resource sharing
- **bullmq** - Job queue (NEW)
- **ioredis** - Redis client (NEW)
- **axios** - HTTP client for webhooks (NEW)
- **node-cron** - Task scheduling (NEW)

### Development
- **nodemon** - Auto-restart server

---

## 🚀 Deployment

For production deployment, see [DEPLOYMENT.md](DEPLOYMENT.md)

**Additional considerations for v2.0:**
- Redis must be available in production
- Consider managed Redis (AWS ElastiCache, Redis Cloud)
- Set appropriate webhook retry limits
- Monitor BullMQ job queue
- Set up webhook endpoint security


## 🎉 Assignment 3 Completion Checklist

- [x] Real-time task reminders implemented
- [x] BullMQ/Redis job queue setup
- [x] Reminder cancellation on task update/delete
- [x] Task categorization system
- [x] Tag management system
- [x] Filter tasks by category and tags
- [x] Webhook integration on task completion
- [x] Exponential backoff retry logic
- [x] Updated API documentation
- [x] Docker Compose with Redis
- [x] Design decisions documented

---
