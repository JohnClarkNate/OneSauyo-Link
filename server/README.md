# PHP Backend Setup Guide

## Installation & Setup

### 1. Start XAMPP
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services

### 2. Create Database
1. Visit `http://localhost/sauyo/server/setup-db.php` in your browser
2. This will automatically create the database and tables
3. You should see "Database setup complete!"

### 3. Access phpMyAdmin (Optional)
- Visit `http://localhost/phpmyadmin`
- Login with username: `root` (no password by default)
- You'll see the `sauyo` database with the created tables

## API Endpoints

The API is available at `http://localhost/sauyo/server/api.php`

### Authentication Endpoints

#### Login
- **URL**: `http://localhost/sauyo/server/api.php?action=login`
- **Method**: POST
- **Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "status": "success",
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "resident"
  }
}
```

#### Register
- **URL**: `http://localhost/sauyo/server/api.php?action=register`
- **Method**: POST
- **Body**:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "role": "resident"
}
```
- **Response**:
```json
{
  "status": "success",
  "message": "Registration successful",
  "user_id": 1
}
```

#### Get Current User
- **URL**: `http://localhost/sauyo/server/api.php?action=getUser`
- **Method**: GET
- **Response**:
```json
{
  "status": "success",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "resident"
  }
}
```

#### Logout
- **URL**: `http://localhost/sauyo/server/api.php?action=logout`
- **Method**: POST
- **Response**:
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

## File Structure

```
server/
├── config.php          # Database connection & CORS setup
├── api.php            # Main API router and endpoints
├── index.php          # Entry point (redirects to api.php)
└── setup-db.php       # Database initialization script
```

## Frontend Integration

### Making API Calls from React

Use the provided `apiService.ts` to make requests:

```typescript
import apiService from '@/services/apiService';

// Login
const response = await apiService.post('/api.php?action=login', {
  email: 'user@example.com',
  password: 'password123'
});

// Register
await apiService.post('/api.php?action=register', {
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password123',
  role: 'resident'
});
```

## Adding New Endpoints

1. Add a new `case` in the `handleAPI()` function in `api.php`
2. Create a new function to handle the logic
3. Use `sendResponse()` to return JSON

Example:
```php
case 'getAnnouncements':
    if ($request_method === 'GET') {
        getAnnouncements();
    }
    break;

function getAnnouncements() {
    global $conn;
    $result = $conn->query('SELECT * FROM announcements ORDER BY created_at DESC');
    $announcements = $result->fetch_all(MYSQLI_ASSOC);
    sendResponse('success', ['announcements' => $announcements]);
}
```

## Security Considerations

**Important**: This is a basic setup for development. For production:

1. **Passwords**: Always use `password_hash()` and `password_verify()` (already implemented)
2. **SQL Injection**: Use prepared statements (already implemented)
3. **CORS**: Configure CORS headers properly for your domain
4. **Authentication**: Consider using JWT tokens instead of sessions
5. **HTTPS**: Use HTTPS in production
6. **Environment Variables**: Store sensitive data in `.env` files
7. **Rate Limiting**: Add rate limiting to prevent brute force attacks
8. **Input Validation**: Validate all user inputs

## Database Tables

### users
- `id` (INT, PK, AI)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `role` (ENUM: admin, staff, resident)
- `status` (ENUM: active, inactive)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### announcements
- `id` (INT, PK, AI)
- `title` (VARCHAR)
- `description` (TEXT)
- `created_by` (INT, FK)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### events
- `id` (INT, PK, AI)
- `title` (VARCHAR)
- `description` (TEXT)
- `event_date` (DATETIME)
- `location` (VARCHAR)
- `created_by` (INT, FK)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### requests
- `id` (INT, PK, AI)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM: pending, in_progress, completed, rejected)
- `created_by` (INT, FK)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Troubleshooting

- **CORS Errors**: Make sure CORS headers in `config.php` match your frontend URL
- **Database Connection Errors**: Check MySQL is running and credentials are correct
- **404 on API endpoint**: Make sure Apache is serving the PHP files correctly
- **Sessions Not Working**: Ensure PHP sessions are enabled in `php.ini`
