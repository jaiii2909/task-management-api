# Task Management API

A RESTful API for managing tasks with user authentication, built with Node.js, Express.js, PostgreSQL, and MongoDB.

## 🚀 Features

- **User Management**
  - User registration with email and hashed password
  - User login with JWT authentication
  - Protected user profile endpoint

- **Task Management**
  - Create, read, update, and delete tasks
  - Tasks associated with specific users
  - User-specific task access control
  - Task statuses: pending/completed

- **Security**
  - JWT-based authentication
  - Password hashing with bcrypt
  - Protected routes
  - Input validation

- **Database**
  - PostgreSQL for user data
  - MongoDB for task data

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
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

### 3. Set Up PostgreSQL

#### Option A: Using PostgreSQL Command Line

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskmanagement;

# Exit
\q
```

#### Option B: Using the provided SQL script

```bash
psql -U postgres -f database/setup.sql
```

### 4. Set Up MongoDB

MongoDB should be running on your local machine. Start MongoDB:

**On Linux/Mac:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**On Windows:**
```bash
net start MongoDB
```

Verify MongoDB is running:
```bash
mongosh
# or
mongo
```

### 5. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Configuration
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=taskmanagement
PG_USER=postgres
PG_PASSWORD=your_postgres_password

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/taskmanagement

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

⚠️ **Important:** Replace `your_postgres_password` with your actual PostgreSQL password and change the `JWT_SECRET` to a secure random string.

### 6. Start the Application

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

You should see:
```
✅ Connected to PostgreSQL database
✅ Connected to MongoDB database
✅ Users table created/verified
🚀 Server running on port 5000
📍 Environment: development
🔗 API URL: http://localhost:5000
```

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. Register a New User

**POST** `/api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

---

#### 2. Login User

**POST** `/api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### 3. Get User Profile

**GET** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "No token provided. Authorization denied."
}
```

---

### Task Endpoints

**Note:** All task endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### 4. Create a New Task

**POST** `/api/tasks`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "status": "pending"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "6589f1234567890abcdef123",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "status": "pending",
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

#### 5. Get All Tasks (for authenticated user)

**GET** `/api/tasks`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": {
    "tasks": [
      {
        "_id": "6589f1234567890abcdef123",
        "title": "Complete project documentation",
        "description": "Write comprehensive documentation for the API",
        "dueDate": "2024-12-31T23:59:59.000Z",
        "status": "pending",
        "userId": 1,
        "createdAt": "2024-01-15T10:30:00.000Z",
        "updatedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "_id": "6589f9876543210fedcba456",
        "title": "Review code",
        "description": "Review pull requests",
        "dueDate": "2024-12-25T18:00:00.000Z",
        "status": "completed",
        "userId": 1,
        "createdAt": "2024-01-14T09:20:00.000Z",
        "updatedAt": "2024-01-15T14:30:00.000Z"
      }
    ]
  }
}
```

---

#### 6. Get Single Task by ID

**GET** `/api/tasks/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "6589f1234567890abcdef123",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "status": "pending",
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. You do not have permission to access this task."
}
```

---

#### 7. Update a Task

**PUT** `/api/tasks/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

**Request Body (partial update supported):**
```json
{
  "status": "completed"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "6589f1234567890abcdef123",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "status": "completed",
      "userId": 1,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T11:45:00.000Z"
    }
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. You do not have permission to modify this task."
}
```

---

#### 8. Delete a Task

**DELETE** `/api/tasks/:id`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {}
}
```

**Error Response (403):**
```json
{
  "success": false,
  "message": "Access denied. You do not have permission to delete this task."
}
```

---

## 🗂️ Project Structure

```
task-management-api/
├── src/
│   ├── config/
│   │   ├── database.js          # PostgreSQL connection
│   │   └── mongodb.js           # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   └── taskController.js    # Task CRUD logic
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── validate.js          # Validation middleware
│   │   └── errorHandler.js      # Global error handler
│   ├── models/
│   │   ├── User.js              # PostgreSQL User model
│   │   └── Task.js              # MongoDB Task model
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication routes
│   │   └── taskRoutes.js        # Task routes
│   ├── utils/
│   │   └── jwt.js               # JWT utilities
│   ├── validators/
│   │   └── schemas.js           # Joi validation schemas
│   ├── app.js                   # Express app configuration
│   └── server.js                # Server startup
├── database/
│   └── setup.sql                # PostgreSQL setup script
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🏗️ Design Decisions

### 1. **Dual Database Architecture**
- **PostgreSQL for Users**: Relational database ideal for structured user data with ACID properties
- **MongoDB for Tasks**: Document-based NoSQL for flexible task schema and scalability

### 2. **Security Measures**
- Passwords hashed using bcrypt with salt rounds
- JWT tokens for stateless authentication
- Protected routes with authentication middleware
- Environment variables for sensitive data

### 3. **Data Validation**
- Server-side validation using Joi
- Validation middleware applied before controller execution
- Clear error messages for validation failures

### 4. **Error Handling**
- Global error handler middleware
- Consistent error response format
- HTTP status codes following REST conventions
- Development vs production error details

### 5. **Code Organization**
- MVC pattern for clear separation of concerns
- Middleware for cross-cutting concerns
- Modular route definitions
- Reusable utility functions

## 🧪 Testing the API

### Using cURL

**Register a user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Create a task (replace TOKEN with your JWT):**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title":"My Task",
    "description":"Task description",
    "dueDate":"2024-12-31T23:59:59.000Z",
    "status":"pending"
  }'
```

### Using Postman

1. Import the API endpoints manually or use the examples above
2. Set up an environment variable for `baseUrl` = `http://localhost:5000`
3. After login, save the token and use it in Authorization header
4. Test all endpoints with different scenarios

## 🔒 Security Best Practices

- ✅ Passwords are hashed, never stored in plain text
- ✅ JWT secret stored in environment variables
- ✅ Database credentials in environment variables
- ✅ Input validation on all endpoints
- ✅ Protected routes require authentication
- ✅ User can only access their own tasks
- ✅ CORS enabled for cross-origin requests

## 🐛 Common Issues & Troubleshooting

### Issue: "Connection refused" error
**Solution:** Make sure PostgreSQL and MongoDB are running

### Issue: "Database does not exist"
**Solution:** Run the setup.sql script or create the database manually

### Issue: "Authentication failed"
**Solution:** Check your PostgreSQL credentials in .env file

### Issue: "Invalid token"
**Solution:** Make sure you're including "Bearer " before the token

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| PG_HOST | PostgreSQL host | localhost |
| PG_PORT | PostgreSQL port | 5432 |
| PG_DATABASE | PostgreSQL database name | taskmanagement |
| PG_USER | PostgreSQL username | postgres |
| PG_PASSWORD | PostgreSQL password | - |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/taskmanagement |
| JWT_SECRET | Secret key for JWT | - |
| JWT_EXPIRE | JWT expiration time | 7d |

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **pg**: PostgreSQL client
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **dotenv**: Environment variables
- **joi**: Data validation
- **cors**: Cross-origin resource sharing

## 🚀 Deployment Considerations

For production deployment:

1. Use environment-specific `.env` files
2. Enable HTTPS
3. Set `NODE_ENV=production`
4. Use a process manager (PM2)
5. Set up database backups
6. Implement rate limiting
7. Add logging (Winston, Morgan)
8. Use a reverse proxy (Nginx)

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created for Backend Developer Intern Assignment

---

**Happy Coding! 🎉**
