# Subscription Manager - Backend

This is the backend API for the Subscription Manager application, built with Node.js, Express, and MySQL.

## Project Structure

The backend follows a layered architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Models**: Interact with the database
- **Routes**: Define API endpoints
- **Middlewares**: Handle cross-cutting concerns like authentication
- **Utils**: Helper functions and utilities
- **Config**: Configuration settings

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd subscription-manager/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory of the backend and add the following variables:

```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=subscription_manager
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
```

### 4. Set up the database

Run the SQL script to create the database schema:

```bash
mysql -u root -p < database-schema.sql
```

### 5. Start the server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on http://localhost:5000 by default.

### 6. Email Configuration

To use email features (password reset, notification emails), configure your email settings:

```
# Email Configuration in .env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password  # Use app-specific password if 2FA is enabled
EMAIL_FROM_ADDRESS=your_email@gmail.com
EMAIL_FROM_NAME=Subscription Manager
TEST_EMAIL=your-test-email@example.com  # Optional: For testing purposes
```

#### Gmail App Password Setup (Recommended)

For Gmail, you should use an App Password instead of your regular password:

1. Enable 2-Step Verification on your Google account
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification if not already enabled

2. Generate an App Password
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" for the app and your device type
   - Copy the generated 16-character password (no spaces)
   - Use this password in your EMAIL_PASSWORD environment variable

### 7. Testing Email Features

Run the following command to test email functionality:

```bash
# Test email features (uses TEST_EMAIL from .env or pass email as argument)
npm run test-emails [test-email@example.com]
```

### 8. Generating Payment Reminders

Set up a scheduled task (cron job) to run the payment reminder generator:

```bash
# Generate payment reminders and send notification emails
npm run generate-reminders

# Only test email configuration
npm run generate-reminders -- --email-test
```

### 9. Cleaning Up Expired Tokens

Set up a scheduled task to clean up expired password reset tokens:

```bash
# Clean up expired password reset tokens
npm run cleanup-tokens
```

#### Recommended Cron Schedule

```
# Generate reminders daily at 8 AM
0 8 * * * cd /path/to/app && npm run generate-reminders

# Clean up expired tokens daily at midnight
0 0 * * * cd /path/to/app && npm run cleanup-tokens
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/reset-password-request` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Subscriptions

- `GET /api/subscriptions` - Get all subscriptions (protected)
- `GET /api/subscriptions/:id` - Get subscription by ID (protected)
- `POST /api/subscriptions` - Create new subscription (protected)
- `PUT /api/subscriptions/:id` - Update subscription (protected)
- `DELETE /api/subscriptions/:id` - Delete subscription (protected)

### Summary and Analytics

- `GET /api/summary` - Get spending summary (protected)
- `GET /api/summary/categories` - Get category statistics (protected)

### Notifications

- `GET /api/notifications` - Get user notifications (protected)
- `PUT /api/notifications/:id/read` - Mark notification as read (protected)
- `PUT /api/notifications/read-all` - Mark all notifications as read (protected)
- `GET /api/notifications/settings` - Get notification settings (protected)
- `PUT /api/notifications/settings` - Update notification settings (protected)

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the JWT token in the Authorization header for protected routes:

```
Authorization: Bearer <token>
```

## Error Handling

The API returns consistent error responses with appropriate HTTP status codes and error messages.

Example error response:

```json
{
  "success": false,
  "error": "Resource not found"
}
```
