# Deployment Guide

This guide covers deploying the Task Management API to production environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Using Docker](#using-docker)
3. [Manual Deployment](#manual-deployment)
4. [Cloud Platforms](#cloud-platforms)
5. [Security Checklist](#security-checklist)

---

## Prerequisites

For production deployment, ensure you have:
- A Linux server (Ubuntu 20.04+ recommended)
- Node.js 18+ installed
- PostgreSQL 12+ installed
- MongoDB 4.4+ installed
- A domain name (optional but recommended)
- SSL certificate (for HTTPS)

---

## Using Docker (Recommended)

Docker provides the easiest deployment method with all dependencies containerized.

### Step 1: Install Docker

```bash
# Update package index
sudo apt update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 2: Configure Environment

```bash
# Clone your repository
git clone <your-repo-url>
cd task-management-api

# Create production .env file
cp .env.example .env
nano .env
```

Update `.env` for production:
```env
PORT=5000
NODE_ENV=production

PG_HOST=postgres
PG_PORT=5432
PG_DATABASE=taskmanagement
PG_USER=postgres
PG_PASSWORD=STRONG_PASSWORD_HERE

MONGO_URI=mongodb://mongodb:27017/taskmanagement

JWT_SECRET=GENERATE_STRONG_RANDOM_SECRET_HERE
JWT_EXPIRE=7d
```

### Step 3: Start Services

```bash
# Start all services in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Step 4: Verify Deployment

```bash
# Test the API
curl http://localhost:5000

# Should return:
# {"success":true,"message":"Task Management API is running",...}
```

### Docker Management Commands

```bash
# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs for specific service
docker-compose logs -f app

# Update and restart
git pull
docker-compose up -d --build

# Backup databases
docker exec task-api-postgres pg_dump -U postgres taskmanagement > backup.sql
docker exec task-api-mongodb mongodump --out=/backup
```

---

## Manual Deployment

For deployment without Docker:

### Step 1: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
```

### Step 2: Configure Databases

**PostgreSQL:**
```bash
# Create user and database
sudo -u postgres psql

CREATE USER taskuser WITH PASSWORD 'secure_password';
CREATE DATABASE taskmanagement OWNER taskuser;
GRANT ALL PRIVILEGES ON DATABASE taskmanagement TO taskuser;
\q
```

**MongoDB:**
```bash
# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd task-management-api

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env

# Update .env with production values
```

### Step 4: Use Process Manager (PM2)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start src/server.js --name task-api

# Enable startup on boot
pm2 startup
pm2 save

# View logs
pm2 logs task-api

# Monitor
pm2 monit

# Restart
pm2 restart task-api
```

---

## Cloud Platforms

### Heroku Deployment

**Procfile:**
```
web: npm start
```

**Commands:**
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Add MongoDB (using MongoDB Atlas)
# Sign up at https://www.mongodb.com/cloud/atlas
# Get connection string and add to Heroku config

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_here
heroku config:set MONGO_URI=your_mongodb_atlas_uri

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure environment variables in the dashboard
3. Add PostgreSQL managed database
4. Add MongoDB managed database
5. Deploy automatically on git push

### AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init

# Create environment
eb create production-env

# Set environment variables
eb setenv NODE_ENV=production JWT_SECRET=your_secret

# Deploy
eb deploy

# Open in browser
eb open
```

---

## Nginx Reverse Proxy

For production, use Nginx as a reverse proxy:

### Install Nginx

```bash
sudo apt install nginx
```

### Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/task-api
```

**Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/task-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Security Checklist

### Environment Security
- [ ] Use strong, random JWT secret (min 64 characters)
- [ ] Use strong database passwords
- [ ] Never commit `.env` file to git
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Use environment variables for all secrets

### Application Security
- [ ] Enable CORS with specific origins
- [ ] Implement rate limiting
- [ ] Add helmet.js for security headers
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use parameterized queries
- [ ] Keep dependencies updated

### Database Security
- [ ] Use strong database passwords
- [ ] Restrict database access to localhost/private network
- [ ] Enable database authentication
- [ ] Regular backups
- [ ] Monitor database logs

### Server Security
- [ ] Keep OS updated
- [ ] Configure firewall (UFW)
- [ ] Disable root SSH login
- [ ] Use SSH keys (not passwords)
- [ ] Regular security audits
- [ ] Monitor server logs

---

## Monitoring & Logging

### Install Logging

```bash
# Install Winston
npm install winston

# Add to production dependencies
```

### Setup Monitoring

```bash
# Use PM2 monitoring
pm2 install pm2-logrotate

# Or use external services:
# - DataDog
# - New Relic
# - Sentry (for error tracking)
```

---

## Backup Strategy

### Automated Backups

**PostgreSQL:**
```bash
# Create backup script
cat > /home/backup-postgres.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U taskuser taskmanagement > $BACKUP_DIR/backup_$DATE.sql
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /home/backup-postgres.sh

# Add to crontab (daily at 2 AM)
(crontab -l ; echo "0 2 * * * /home/backup-postgres.sh") | crontab -
```

**MongoDB:**
```bash
# Create backup script
cat > /home/backup-mongo.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mongodump --db taskmanagement --out $BACKUP_DIR/backup_$DATE
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
EOF

chmod +x /home/backup-mongo.sh

# Add to crontab
(crontab -l ; echo "0 3 * * * /home/backup-mongo.sh") | crontab -
```

---

## Performance Optimization

### 1. Enable Compression

```javascript
// Install compression
npm install compression

// In src/app.js
const compression = require('compression');
app.use(compression());
```

### 2. Add Caching

```javascript
// Install Redis
npm install redis

// Implement caching for frequently accessed data
```

### 3. Database Indexing

Already implemented in the code:
- User email index (PostgreSQL)
- Task userId index (MongoDB)

### 4. Connection Pooling

PostgreSQL connection pooling is already configured via `pg.Pool`.

---

## Troubleshooting

### Application won't start
```bash
# Check logs
pm2 logs task-api

# Check environment variables
pm2 env 0

# Restart
pm2 restart task-api
```

### Database connection errors
```bash
# Check PostgreSQL
sudo systemctl status postgresql
sudo -u postgres psql -c "SELECT 1"

# Check MongoDB
sudo systemctl status mongod
mongosh --eval "db.adminCommand('ping')"
```

### Port already in use
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill process
sudo kill -9 <PID>
```

---

## Post-Deployment Verification

```bash
# Test all endpoints
curl https://your-domain.com/
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Monitor logs
pm2 logs task-api

# Check resource usage
pm2 monit
```

---

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, HAProxy)
- Deploy multiple app instances
- Use shared databases or database clusters
- Implement session storage (Redis)

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching
- Use CDN for static assets

---

Good luck with your deployment! 🚀
