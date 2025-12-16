# Subscription Tracker API

A REST API for managing and tracking user subscriptions.

## Features

- **User Authentication**: Secure sign-up, sign-in, and sign-out with JWT tokens
- **Subscription Management**: Create, view, and manage subscriptions with multiple currencies and frequencies
- **Automated Reminders**: Workflow-based email reminders sent 7, 6, 5, 2, and 1 days before renewal
- **Security**: Arcjet integration for rate limiting, bot detection, and DDoS protection
- **Multi-Currency Support**: USD, BHD, and EGP
- **Flexible Frequencies**: Daily, weekly, monthly, and yearly subscription cycles
- **Error Handling**: Comprehensive error middleware with proper status codes
- **Database Transactions**: ACID-compliant operations for data integrity

## Table of Contents

- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Running the Project](#-running-the-project)
- [Security Features](#-security-features)
- [Deployment](#-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 4.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs
- **Security**: Arcjet (rate limiting, bot detection, shield)
- **Workflows**: Upstash Workflow (for scheduled reminders)
- **Email**: Nodemailer
- **Date Handling**: Day.js
- **Logging**: Morgan (HTTP request logger)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd subscription-tracker-api
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.development.local.example .env.development.local
   ```
   Edit the `.env.development.local` file with your configuration (see [Configuration](#-configuration))

4. **Start the development server**
   ```bash
   pnpm dev
   ```

## Configuration

Create environment files based on your environment:

- `.env.development.local` - Development environment
- `.env.production.local` - Production environment
- `.env.test.local` - Test environment

### Environment Variables

```env
# Server Configuration
NODE_ENV=development
PORT=3000
BASE_URL=http://localhost:3000

# Database
DB_URI=your-mongodb-url

# JWT Configuration
JWT_SECRET=your-secret-jwt-key
JWT_EXPIRES_IN=7d

# Arcjet Security
ARCJET_KEY=your-arcjet-api-key
ARCJET_ENV=development

# Upstash Workflow
QSTASH_URL=your-upstash-qstash-url
QSTASH_TOKEN=your-upstash-qstash-token

# Email Configuration (Nodemailer)
NODEMAILER_PASSWORD=your-email-app-password
```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication Routes (`/api/v1/auth`)

##### Sign Up
```http
POST /api/v1/auth/sign-up
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "user created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

##### Sign In
```http
POST /api/v1/auth/sign-in
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "singed in successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

##### Sign Out
```http
POST /api/v1/auth/sign-out
Authorization: Bearer <token>
```

#### Subscription Routes (`/api/v1/subscriptions`)

##### Create Subscription
```http
POST /api/v1/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Netflix Premium",
  "price": 15.99,
  "currency": "USD",
  "frequency": "monthly",
  "paymentMethod": "Credit Card",
  "startDate": "2024-01-15T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "subscription created successfully",
  "data": {
    "_id": "...",
    "name": "Netflix Premium",
    "price": 15.99,
    "currency": "USD",
    "frequency": "monthly",
    "paymentMethod": "Credit Card",
    "startDate": "2024-01-15T00:00:00.000Z",
    "renewalDate": "2024-02-15T00:00:00.000Z",
    "status": "active",
    "user": "...",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "workflowRunId": "..."
}
```

**Supported Values:**
- `currency`: `USD`, `BHD`, `EGP`
- `frequency`: `daily`, `weekly`, `monthly`, `yearly`
- `status`: `active`, `canceled`, `expired`

##### Get User Subscriptions
```http
GET /api/v1/subscriptions/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "get all subscriptions successfully",
  "data": [
    {
      "_id": "...",
      "name": "Netflix Premium",
      "price": 15.99,
      "currency": "USD",
      "frequency": "monthly",
      "status": "active",
      "renewalDate": "2024-02-15T00:00:00.000Z",
      ...
    }
  ]
}
```

#### Workflow Routes (`/api/v1/workflows`)

##### Subscription Reminder (Internal)
```http
POST /api/v1/workflows/subscription/reminder
Content-Type: application/json

{
  "subscriptionId": "..."
}
```

> **Note**: This endpoint is triggered automatically by Upstash Workflow and should not be called directly.

### Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Project Structure

```
subscription-tracker-api/
├── app.js                      # Application entry point
├── config/                     # Configuration files
│   ├── arcjet.js              # Arcjet security configuration
│   ├── env.js                 # Environment variables loader
│   ├── nodemailer.js          # Email service configuration
│   └── upstash.js             # Upstash workflow configuration
├── controllers/                # Route controllers
│   ├── auth.controller.js     # Authentication logic
│   ├── subscription.controller.js  # Subscription CRUD operations
│   ├── user.controller.js     # User management
│   └── workflow.controller.js # Workflow handlers
├── database/                   # Database configuration
│   └── mongodb.js             # MongoDB connection
├── middleware/                 # Express middleware
│   ├── arject.middleware.js   # Arcjet security middleware
│   ├── auth.middleware.js     # JWT authentication middleware
│   └── error.middleware.js    # Global error handler
├── models/                     # Mongoose models
│   ├── subscription.model.js  # Subscription schema
│   └── user.model.js          # User schema
├── routes/                     # Express routes
│   ├── auth.route.js          # Authentication routes
│   ├── subscription.route.js  # Subscription routes
│   ├── user.route.js          # User routes
│   └── workflow.route.js      # Workflow routes
├── utils/                      # Utility functions
│   ├── emailTemplates.js      # Email template generators
│   └── sendEmail.js           # Email sending utility
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

## Running the Project

### Development Mode

```bash
pnpm dev
```

This starts the server with nodemon for automatic reloading on file changes.

### Production Mode

```bash
pnpm start
```

### Environment-Specific Execution

The application automatically loads environment variables based on `NODE_ENV`:
- `NODE_ENV=development` → loads `.env.development.local`
- `NODE_ENV=production` → loads `.env.production.local`

## Security Features

### Arcjet Integration

- **Shield Mode**: Protects against common attacks
- **Bot Detection**: Filters out malicious bots while allowing search engines
- **Rate Limiting**: Token bucket algorithm (10 requests per 10 seconds)

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds (10)
- **Protected Routes**: Middleware-based route protection
- **User Verification**: Token validation and user existence checks

### Data Validation

- **Mongoose Validation**: Schema-level validation
- **Email Format**: Regex validation for email addresses
- **Password Strength**: Minimum 6 characters
- **Date Validation**: Ensures renewal dates are after start dates

### Error Handling

- **Centralized Error Middleware**: Consistent error responses
- **Status Code Mapping**: Proper HTTP status codes
- **Error Logging**: Console logging for debugging (consider using a logging service in production)

## Testing

### Manual Testing

Use tools like Postman, Insomnia, or curl to test API endpoints:

```bash
# Sign up
curl -X POST http://localhost:3000/api/v1/auth/sign-up \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Sign in
curl -X POST http://localhost:3000/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create subscription (replace TOKEN with actual token)
curl -X POST http://localhost:3000/api/v1/subscriptions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Netflix","price":15.99,"currency":"USD","frequency":"monthly","paymentMethod":"Credit Card","startDate":"2024-01-15T00:00:00.000Z"}'
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## API Rate Limits

Current rate limits (via Arcjet):
- **10 requests per 10 seconds** per IP address
- Adjustable in `config/arcjet.js`

