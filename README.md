# Notes App

A full-stack notes application built with the MERN stack. Create, organize, search, and manage your notes securely with JWT authentication and MongoDB persistence.

## 🚀 Features

- **User Authentication:** Secure registration and login with JWT tokens
- **Theme Toggle:** Device-aware light/dark mode with full-app switching
- **Create, Edit, Delete Notes:** Full CRUD operations on notes
- **Open Full Note View:** Click a note card to read full note content in modal
- **Advanced Search:** Full-text search within titles, content, and tags
- **Pagination:** Efficient note loading with load-more functionality
- **Pin/Unpin Notes:** Mark important notes for quick access
- **Tags Support:** Organize notes with custom tags
- **Responsive Design:** Works seamlessly on desktop and mobile devices
- **Rate Limiting:** API endpoints protected with rate limiting
- **Health Check:** Built-in `/health` endpoint for monitoring

## 🛠️ Technology Stack

### Frontend

- **React** 19.2.0 - UI library
- **Vite** 7.1.11 - Build tool & dev server
- **Zustand** 5.0.8 - State management (auth + notes stores)
- **Axios** 1.12.2 - HTTP client
- **SWR** 2.3.6 - Data fetching with caching
- **React Router** 7.9.4 - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vitest** 4.1.2 - Unit testing framework
- **@testing-library/react** - React testing utilities

### Backend

- **Node.js** - JavaScript runtime
- **Express** 5.1.0 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.19.1 - ODM for MongoDB
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Helmet** - HTTP security headers
- **Morgan** - HTTP request logging
- **express-rate-limit** - Rate limiting middleware
- **Jest** 29.x - Testing framework
- **Supertest** - HTTP assertion library

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** account (MongoDB Atlas or local MongoDB)
- **Git**

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd notesApp
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update `.env` with your values:

```env
ACCESS_TOKEN_SECRET=your_secret_key_here
ACCESS_TOKEN_EXPIRES_IN=15m
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-domain.com
RATE_LIMIT_MAX=200
PORT=8000
CONNECTION_STRING=your_mongodb_connection_string
```

### 3. Frontend Setup

```bash
cd frontend/notesApp
npm install
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update `.env` with your backend URL:

```env
VITE_API_BASE_URL=http://localhost:8000
# Or for production:
# VITE_API_BASE_URL=https://your-backend-domain.com
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**

```bash
cd backend
npm start
```

Server runs on `http://localhost:8000`

**Terminal 2 - Frontend:**

```bash
cd frontend/notesApp
npm run dev
```

App runs on `http://localhost:5173`

### Production Build

**Frontend:**

```bash
cd frontend/notesApp
npm run build
npm run preview
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test              # Run tests once
npm run test:watch   # Watch mode
```

Tests cover:

- User authentication (signup, login)
- Note CRUD operations
- Search functionality
- Input validation

### Frontend Tests

```bash
cd frontend/notesApp
npm test              # Run tests once
npm run test:watch   # Watch mode
```

Tests cover:

- Utility functions (email, password validation)
- State management (auth store)

## 📝 API Endpoints

### Authentication

- `POST /create-account` - User registration
- `POST /login` - User login
- `GET /get-user` - Fetch current user

### Notes

- `POST /add-note` - Create a new note
- `PUT /edit-note/:noteId` - Update a note
- `DELETE /delete-note/:noteId` - Delete a note
- `GET /get-all-notes` - Fetch notes with search & pagination
  - Query params: `search`, `page` (default 1), `limit` (default 10)

### Health Check

- `GET /health` - Server health status

## 🔐 Security Features

- **Strong Password Policy:** Minimum 8 characters with uppercase, lowercase, digit, and special character
- **JWT Authentication:** 15-minute token expiry (configurable)
- **Rate Limiting:** 200 requests per 15 minutes per IP
- **Auth Rate Limiting:** 10 requests per 15 minutes on login/signup
- **CORS Protection:** Whitelist-based origin validation
- **Helmet.js:** HTTP security headers
- **Input Sanitization:** Regex escaping in search queries
- **Password Hashing:** bcrypt with 10 salt rounds

## 🔑 Session & Token Behavior

- Access tokens are short-lived (default: `15m`).
- When token expires, protected API calls return `401 Unauthorized`.
- Frontend now handles this globally:
  - clears auth state
  - clears cached user/notes data
  - redirects user to login page
- SWR retries are disabled for `401` responses to prevent repeated error spam.
- Refresh token flow is **not** implemented yet (user must log in again after expiry).

## 📊 Database Schema

### Notes Collection

```javascript
{
  userId: ObjectId,
  title: String,
  content: String,
  tags: [String],
  isPinned: Boolean,
  createOn: Date
}
```

**Indexes:**

- Compound: `{userId, isPinned, createOn}`
- Text: `{title, content, tags}`

### Users Collection

```javascript
{
  fullName: String,
  email: String,
  password: String (hashed),
  createdOn: Date
}
```

## 🌐 Deployment

### Deploy Backend (Vercel)

```bash
cd backend
npm install -g vercel
vercel
```

Update frontend `VITE_API_BASE_URL` to your deployed backend URL.

### Deploy Frontend (Vercel/Netlify)

```bash
cd frontend/notesApp
npm run build
# Vercel
vercel
# Or Netlify
netlify deploy --prod --dir=dist
```

**Important:** Update `ALLOWED_ORIGINS` on backend with your deployed frontend URL.

## 🔄 Recent Updates (v2.0)

- ✅ Security hardening (CORS, rate limiting, helmet)
- ✅ Strong password validation
- ✅ JWT token expiry optimization (15m default)
- ✅ API pagination support
- ✅ Search sanitization (ReDoS prevention)
- ✅ Frontend state normalization with Zustand
- ✅ Comprehensive test coverage (13 automated tests)
- ✅ Request logging with Morgan
- ✅ Database performance indexes
- ✅ Health check endpoint

## 🔄 Recent Updates (v2.1)

- ✅ Full app theme synchronization for light/dark mode
- ✅ Device-theme based initial mode (`system` preference)
- ✅ Improved light mode color palette and surface contrast
- ✅ Click note card to open full note in read-only modal
- ✅ Global `401` handling for expired tokens (clear session + redirect)

## 📚 Usage Guide

### Create an Account

1. Click "Sign Up"
2. Enter full name, email, and strong password (8+ chars, mixed case, digit, special char)
3. Click "Create Account"

### Create a Note

1. Click "Add Notes" button
2. Enter title and content
3. Optionally add tags
4. Click "Add" to save

### Search Notes

1. Use the search bar at the top
2. Type keywords to search titles, content, and tags
3. Results update in real-time with pagination

### Manage Notes

- **Pin/Unpin:** Click the pin icon to highlight important notes
- **Edit:** Click the edit icon to modify a note
- **Delete:** Click the delete icon to remove a note

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 📞 Support

For issues or questions, please open an issue on GitHub or contact the development team.
