# User Information Collection Web App

A production-quality web application that collects user information via a responsive form and stores it using a REST API backend.

## 🎯 Features

### Frontend
- **Responsive Form** with clean, modern UI
- **Client-side Validation**
  - Required field validation
  - Email format validation
  - Phone number validation (10+ digits)
  - Zip code format validation
- **Real-time Feedback** with inline error messages
- **Success/Error Messages** with auto-dismiss
- **Loading State** on form submission
- **View Submissions** Modal to see all collected data
- **Professional Design** with gradient background and smooth animations

### Backend
- **REST API** built with Express.js
- **POST /api/users** - Submit user information
- **GET /api/users** - Retrieve all submissions
- **Input Validation** on backend (double validation)
- **Error Handling** with meaningful error messages
- **Unique IDs** for each submission
- **Timestamps** for all entries
- **JSON File Storage** for simplicity and portability

## 📋 Form Fields

All fields are required except "Additional Notes":
- Full Name
- Email Address
- Phone Number
- Street Address
- City
- State/Province
- Country
- Zip Code
- Additional Notes (optional)

## 💻 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Storage**: JSON file (server/data/users.json)
- **Package Manager**: npm

## 📁 Project Structure

```
project-root/
│
├── client/                 # Frontend
│   ├── index.html         # Main HTML file
│   ├── style.css          # Styles and responsive design
│   └── script.js          # Form logic and API interaction
│
├── server/                # Backend
│   ├── app.js             # Express application setup
│   ├── routes/
│   │   └── userRoutes.js  # User endpoints
│   ├── controllers/
│   │   └── userController.js  # Business logic
│   ├── models/
│   │   ├── User.js        # Data persistence
│   │   └── validation.js  # Validation logic
│   └── data/
│       └── users.json     # Data storage
│
├── package.json           # Dependencies
├── .gitignore            # Git ignore rules
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd Web-Form-CI-CD-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   Or use development mode with hot reload:
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📝 API Documentation

### Get All Users
```http
GET /api/users
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "1234567890",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "(123) 456-7890",
      "address": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "United States",
      "zipCode": "10001",
      "notes": "This is a test submission",
      "createdAt": "2024-03-24T12:34:56.789Z"
    }
  ],
  "count": 1
}
```

### Submit User Information
```http
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "(123) 456-7890",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "country": "United States",
  "zipCode": "10001",
  "notes": "Optional additional notes"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "User added successfully",
  "data": {
    "id": "1234567890",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "(123) 456-7890",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "country": "United States",
    "zipCode": "10001",
    "notes": "Optional additional notes",
    "createdAt": "2024-03-24T12:34:56.789Z"
  }
}
```

**Response (Validation Error):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Email format is invalid",
    "Phone Number must be at least 10 digits"
  ]
}
```

## ✅ Validation Rules

### Email
- Must be a valid email format (e.g., user@example.com)

### Phone Number
- Must contain at least 10 digits
- Can include formatting characters: spaces, hyphens, parentheses, plus sign

### Zip Code
- Must be at least 3 characters long
- Can contain letters, numbers, hyphens, and spaces

### Other Fields
- All required fields must be non-empty
- Whitespace is trimmed before validation

## 🎨 Features Implemented

✅ Professional, responsive UI with modern design  
✅ Real-time field validation with error messages  
✅ Client-side and server-side validation (defense in depth)  
✅ Loading states during form submission  
✅ Success and error message alerts  
✅ View all submissions modal with formatted data  
✅ Clean, modular code architecture  
✅ Separation of concerns (routes, controllers, models)  
✅ Unique IDs for each submission  
✅ Timestamps for tracking  
✅ XSS protection with HTML escaping  
✅ Responsive design (mobile, tablet, desktop)  
✅ Keyboard accessibility (Escape to close modal)  
✅ Error handling throughout the application  

## 🔒 Security Features

- **Input Validation**: Both client-side and server-side validation
- **XSS Protection**: HTML entities are escaped in the submissions view
- **Data Integrity**: Automatic ID generation prevents duplicates
- **Error Messages**: Generic error messages prevent information leakage

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop browsers (1200px and above)
- Tablets (768px - 1199px)
- Mobile devices (below 768px)

## 🛠️ Development

### File Descriptions

#### Frontend
- **index.html** - Semantic HTML structure with proper accessibility
- **style.css** - Modern CSS with gradients, animations, and flexbox/grid
- **script.js** - Form handling, API communication, DOM manipulation

#### Backend
- **app.js** - Express configuration, middleware setup, route mounting
- **routes/userRoutes.js** - API endpoint definitions
- **controllers/userController.js** - Request handling and business logic
- **models/User.js** - File I/O operations for data persistence
- **models/validation.js** - Validation functions and rules

## 🧪 Testing

### Overview
This project includes comprehensive unit tests with Jest and Supertest. Tests are automatically run via GitHub Actions on every PR to ensure code quality and prevent regressions.

### Test Structure

```
tests/
├── models/
│   ├── validation.test.js    # Validation logic tests
│   └── User.test.js          # User model tests (persistence)
└── controllers/
    └── userController.test.js # API endpoint tests
```

### What's Tested

#### 1. **Validation Tests** (`tests/models/validation.test.js`)
- ✅ Email format validation (valid/invalid cases)
- ✅ Phone number validation (10+ digits, various formats)
- ✅ Zip code validation (alphanumeric, hyphens)
- ✅ Complete user data validation
- ✅ Required vs optional field handling
- ✅ Whitespace trimming
- ✅ Multiple simultaneous validation errors

#### 2. **User Model Tests** (`tests/models/User.test.js`)
- ✅ File initialization (creating `users.json` on demand)
- ✅ Reading all users
- ✅ Adding new users with auto-generated IDs
- ✅ Unique ID generation
- ✅ Timestamp creation
- ✅ Data persistence and retrieval
- ✅ Data integrity across multiple operations

#### 3. **Controller/API Tests** (`tests/controllers/userController.test.js`)
- ✅ GET /api/users endpoint
  - Returns correct response structure
  - Returns array of users
  - Correct user count
- ✅ POST /api/users endpoint
  - Creates user with valid data
  - Returns user with ID and timestamp
  - Validation error handling (missing fields)
  - Invalid email rejection
  - Invalid phone rejection
  - Invalid zip code rejection
- ✅ Data processing
  - Whitespace trimming
  - Email lowercase conversion
  - Optional fields handling
- ✅ Response formats
  - Consistent success/error structures
  - Proper HTTP status codes
- ✅ Edge cases
  - Special characters in names
  - Long text in notes field
  - Empty request bodies

### Running Tests Locally

**Run all tests:**
```bash
npm test
```

**Run tests in watch mode** (re-run on file changes):
```bash
npm run test:watch
```

**View coverage report:**
```bash
npm run test:coverage
```

**CI mode** (used in GitHub Actions):
```bash
npm run test:ci
```

### Test Coverage

Current coverage targets (configurable in `jest.config.js`):
- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

View detailed coverage after running tests:
```bash
npm run test:coverage
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
```

### GitHub Actions CI/CD Pipeline

Every PR triggers automated testing and quality checks:

#### Workflow: `.github/workflows/tests.yml`

**Test Job:**
- Runs on Node.js versions: 16.x, 18.x, 20.x
- Installs dependencies
- Executes all tests
- Uploads coverage to Codecov
- Generates coverage report

**Code Quality Job:**
- Checks for security vulnerabilities
- Runs code quality checks
- Depends on tests passing

**Build Job:**
- Verifies application builds correctly
- Tests server startup
- Depends on tests passing

### PR Merge Requirements

All of the following must pass before merging a PR:
1. ✅ **All tests pass** on all Node.js versions
2. ✅ **Code coverage** meets threshold (70%)
3. ✅ **No security vulnerabilities** (npm audit)
4. ✅ **Build succeeds**

### Test Examples

#### Example: Email Validation Test
```javascript
test('should accept valid email addresses', () => {
  expect(isValidEmail('user@example.com')).toBe(true);
  expect(isValidEmail('john.doe@company.co.uk')).toBe(true);
});

test('should reject invalid email addresses', () => {
  expect(isValidEmail('invalid.email')).toBe(false);
  expect(isValidEmail('user@')).toBe(false);
});
```

#### Example: API Endpoint Test
```javascript
test('should create user with valid data', async () => {
  const response = await request(app)
    .post('/api/users')
    .send({
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '(123) 456-7890',
      // ... other fields
    });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.data).toHaveProperty('id');
});
```

### Adding New Tests

When adding new features:
1. Write test cases first (TDD approach)
2. Implement the feature
3. Ensure all tests pass
4. Maintain >70% coverage
5. Commit with clear test descriptions

### Debugging Tests

**Run a specific test file:**
```bash
npm test -- tests/models/validation.test.js
```

**Run tests matching a pattern:**
```bash
npm test -- --testNamePattern="email"
```

**Run with verbose output:**
```bash
npm test -- --verbose
```

**Debug with Node inspector:**
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Troubleshooting

**Tests fail locally but pass in CI?**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Ensure clean data: Delete `server/data/users.json`

**Coverage not meeting threshold?**
- Run: `npm run test:coverage`
- Check: `coverage/lcov-report/index.html`
- Add tests for untested code paths

**Test timeout?**
- Increase timeout in test: `jest.setTimeout(10000);`
- Check for infinite loops or unresolved promises

## 🔧 Environment Variables

Currently, the application uses default settings:
- **Port**: 3000 (can be overridden with `PORT` environment variable)
- **Data File**: `server/data/users.json`

## 📦 Dependencies

### Production
- **express** - Web framework
- **body-parser** - Middleware for parsing JSON bodies

### Development
- **nodemon** - Auto-restart on file changes
- **jest** - Testing framework (v30+)
- **supertest** - HTTP testing library

## 📄 License

This project is provided as-is for educational and commercial use.

## 👨‍💻 Author

Created as a production-quality example of best practices in full-stack web development.

---

**Happy coding! 🚀**
