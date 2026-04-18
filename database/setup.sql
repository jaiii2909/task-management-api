-- PostgreSQL Database Setup Script
-- Run this script to create the database

-- Create database
CREATE DATABASE taskmanagement;

-- Connect to the database
\c taskmanagement;

-- Users table will be created automatically by the application
-- But you can also create it manually:

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Display success message
SELECT 'Database setup completed successfully!' AS status;
