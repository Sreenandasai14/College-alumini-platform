# AlumniHub Frontend - Complete Documentation

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Components Documentation](#components-documentation)
4. [Pages Documentation](#pages-documentation)
5. [Services Documentation](#services-documentation)
6. [Context & State Management](#context--state-management)
7. [Routing](#routing)
8. [API Endpoints](#api-endpoints)
9. [Styling & Theme](#styling--theme)
10. [Development Guide](#development-guide)

## Project Overview

**AlumniHub** is a complete, production-ready Alumni Networking and Mentorship Platform with the following characteristics:

- **Framework**: React 19.2.5 with Vite
- **Styling**: Tailwind CSS with custom theme
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Package Manager**: npm

### Core Features
- User authentication with role-based access
- Alumni networking and browsing
- Job opportunities posting and applications
- Mentorship request system
- User profiles with edit capabilities
- Responsive UI for all devices

## Architecture

### Folder Structure Overview

```
frontend/
├── src/
│   ├── components/           # Reusable UI components (5 total)
│   ├── pages/               # Page-level components (8 total)
│   ├── services/            # API communication layer (4 services)
│   ├── context/             # React Context for state management
│   ├── App.jsx              # Root component with routing
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global Tailwind styles
├── public/                  # Static assets
├── .env                     # Environment variables
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── package.json            # Dependencies and scripts
```

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    App Component                         │
│                 (AuthProvider wrapper)                   │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
    ┌───▼──┐   ┌──▼──┐   ┌──▼──┐
    │Router│   │Auth │   │Pages│
    │      │   │Ctx  │   │     │
    └───┬──┘   └──┬──┘   └──┬──┘
        │         │         │
    ┌───▼─────────▼────┐    │
    │  Navigation      │    │
    │ (Navbar/Sidebar) │    │
    └──────────────────┘    │
                            │
        ┌───────────────────┘
        │
    ┌───▼──────────────────────────────┐
    │  Page Components with Services   │
    │  - Dashboard                     │
    │  - BrowseAlumni                  │
    │  - Jobs                          │
    │  - Mentorship                    │
    │  - Profile                       │
    └───┬──────────────────────────────┘
        │
    ┌───▼──────────────────────────────┐
    │  API Services                    │
    │  - authService.js                │
    │  - userService.js                │
    │  - jobService.js                 │
    │  - mentorshipService.js          │
    └───┬──────────────────────────────┘
        │
    ┌───▼──────────────────────────────┐
    │  Backend API                     │
    │  (http://localhost:5000/api)     │
    └────────────────────────────────────┘
```

## Components Documentation

### 1. Navbar Component
**File**: `src/components/Navbar.jsx`

**Purpose**: Top navigation bar with user profile and authentication

**Props**: None (uses Context)

**Features**:
- Logo/brand name display
- User profile dropdown
- Login/Register links for anonymous users
- Logout functionality
- Responsive design

**Context Usage**:
- `useAuth()` - For user data and logout function

**Code Example**:
```jsx
import Navbar from "../components/Navbar";

function MyPage() {
  return (
    <>
      <Navbar />
      {/* Page content */}
    </>
  );
}
```

### 2. Sidebar Component
**File**: `src/components/Sidebar.jsx`

**Purpose**: Role-based navigation menu

**Props**: None (uses Context)

**Features**:
- Different menu items for Student vs Alumni
- Active route highlighting
- Navigation icons and labels
- Responsive sidebar

**Role-Based Navigation**:
- **Students**: Dashboard, Browse Alumni, Jobs, Mentorship, Profile
- **Alumni**: Dashboard, Post Job, Mentorship Requests, Browse Alumni, Profile

**Context Usage**:
- `useAuth()` - For user role
- `useLocation()` - For active route

### 3. AlumniCard Component
**File**: `src/components/AlumniCard.jsx`

**Props**:
```jsx
{
  alumni: {
    id: number,
    firstName: string,
    lastName: string,
    title: string,
    company: string,
    industry: string,
    expertise: string,
    bio: string
  },
  onMentorClick: function (optional)
}
```

**Features**:
- Display alumni profile information
- Avatar with initials
- Quick action buttons
- View Profile link
- Request Mentorship button

### 4. JobCard Component
**File**: `src/components/JobCard.jsx`

**Props**:
```jsx
{
  job: {
    id: number,
    title: string,
    company: string,
    location: string,
    type: string,
    experience: string,
    salary: string,
    description: string,
    skills: string[]
  },
  onApplyClick: function (optional),
  showApplyButton: boolean (default: true)
}
```

**Features**:
- Job title and company display
- Job type badge
- Required skills tags
- Apply button
- Conditional rendering based on user role

### 5. MentorshipRequest Component
**File**: `src/components/MentorshipRequest.jsx`

**Props**:
```jsx
{
  request: {
    id: number,
    studentName: string,
    mentorName: string,
    message: string,
    status: "pending" | "accepted" | "rejected",
    createdAt: string,
    role: string
  },
  onAccept: function (optional),
  onReject: function (optional),
  showActions: boolean (default: true)
}
```

**Features**:
- Request information display
- Status badge with color coding
- Accept/Reject buttons (for mentors)
- Request message preview
- Timestamp display

## Pages Documentation

### 1. Login Page
**File**: `src/pages/Login.jsx`
**Route**: `/`

**Features**:
- Email and password input
- Error message display
- Loading state
- Form validation
- Redirect to register link

**Authentication Flow**:
1. User enters credentials
2. Form validation
3. Call `login()` from AuthContext
4. On success, redirect based on user role

### 2. Register Page
**File**: `src/pages/Register.jsx`
**Route**: `/register`

**Features**:
- First/Last name fields
- Email input
- Role selection (Student/Alumni)
- Password and confirmation
- Form validation
- Error handling

**Registration Flow**:
1. User enters information
2. Role selection (Student/Alumni)
3. Password confirmation validation
4. Call `register()` from AuthContext
5. Redirect to login on success

### 3. Student Dashboard
**File**: `src/pages/StudentDashboard.jsx`
**Route**: `/student-dashboard`
**Auth Required**: Yes (Student role only)

**Features**:
- Welcome message with user name
- Statistics cards (Alumni browsed, Jobs applied, etc.)
- Quick action buttons
- Recent activity feed

**Statistics Displayed**:
- Alumni Browsed: 24
- Active Mentorship: 1
- Jobs Applied: 5
- Pending Requests: 3

### 4. Alumni Dashboard
**File**: `src/pages/AlumniDashboard.jsx`
**Route**: `/alumni-dashboard`
**Auth Required**: Yes (Alumni role only)

**Features**:
- Welcome message
- Engagement statistics
- Alumni-specific actions
- Pending mentorship requests list

**Statistics Displayed**:
- Jobs Posted: 8
- Profile Views: 47
- Mentorship Requests: 12
- Active Connections: 15

### 5. Browse Alumni
**File**: `src/pages/BrowseAlumni.jsx`
**Route**: `/browse-alumni`
**Auth Required**: Yes

**Features**:
- Search by name/company
- Filter by industry
- Display alumni cards in grid
- Request mentorship button
- Advanced search options

**Filters**:
- Search query (name/company)
- Industry selection (Technology, Finance, Healthcare, Marketing)

### 6. Jobs Page
**File**: `src/pages/Jobs.jsx`
**Route**: `/jobs`
**Auth Required**: Yes

**Features**:
- Job listings in card format
- Search by title/company
- Filter by job type
- Apply for jobs (Students)
- Post jobs (Alumni only)
- Job posting form

**Alumni-Only Features**:
- Toggle job posting form
- Create new job opportunity
- Save job post

### 7. Mentorship Page
**File**: `src/pages/Mentorship.jsx`
**Route**: `/mentorship`
**Auth Required**: Yes

**Features**:
- Two tabs: Find Mentor / My Requests
- Browse mentors by expertise
- Send mentorship request with message
- Modal for request composition
- View received requests (Alumni)
- View sent requests (Students)

**Tab 1 - Find Mentor**:
- List of available mentors
- Expertise and availability info
- Request mentorship button
- Modal form for message

**Tab 2 - My Requests**:
- Different content for Alumni vs Students
- Status badges
- Accept/Reject actions (Alumni)

### 8. Profile Page
**File**: `src/pages/Profile.jsx`
**Route**: `/profile`
**Auth Required**: Yes

**Features**:
- Display profile information
- Edit mode toggle
- Form for updating profile
- Beautiful profile card display
- Profile sections

**Editable Fields**:
- First Name, Last Name
- Email
- Title, Company
- Industry, Location
- Expertise, Bio

## Services Documentation

### 1. Auth Service
**File**: `src/services/authService.js`

**Methods**:

#### `login(email, password)`
```javascript
login: async (email, password) => {
  // POST /api/auth/login
  // Returns: { token, user }
}
```

#### `register(userData)`
```javascript
register: async (userData) => {
  // POST /api/auth/register
  // userData: { firstName, lastName, email, password, role }
  // Returns: registration response
}
```

#### `logout()`
```javascript
logout: () => {
  // Removes token and user from localStorage
}
```

#### `getToken()`
```javascript
getToken: () => localStorage.getItem("token")
```

#### `getUser()`
```javascript
getUser: () => JSON.parse(localStorage.getItem("user"))
```

#### `isAuthenticated()`
```javascript
isAuthenticated: () => !!localStorage.getItem("token")
```

### 2. User Service
**File**: `src/services/userService.js`

**Methods**:

#### `getAllAlumni(filters)`
```javascript
getAllAlumni: async (filters = {}) => {
  // GET /api/users/alumni?filters
  // Returns: array of alumni
}
```

#### `getUserProfile(userId)`
```javascript
getUserProfile: async (userId) => {
  // GET /api/users/:userId
  // Returns: user profile object
}
```

#### `updateProfile(userId, profileData)`
```javascript
updateProfile: async (userId, profileData) => {
  // PUT /api/users/:userId
  // profileData: { firstName, lastName, title, company, ... }
  // Returns: updated user object
}
```

#### `searchAlumni(query)`
```javascript
searchAlumni: async (query) => {
  // GET /api/users/alumni/search?q=query
  // Returns: array of matching alumni
}
```

### 3. Job Service
**File**: `src/services/jobService.js`

**Methods**:

#### `getAllJobs(filters)`
```javascript
getAllJobs: async (filters = {}) => {
  // GET /api/jobs?filters
  // Returns: array of jobs
}
```

#### `getJobById(jobId)`
```javascript
getJobById: async (jobId) => {
  // GET /api/jobs/:jobId
  // Returns: job object
}
```

#### `createJob(jobData)`
```javascript
createJob: async (jobData) => {
  // POST /api/jobs
  // jobData: { title, company, location, type, description, ... }
  // Returns: created job object
}
```

#### `applyForJob(jobId)`
```javascript
applyForJob: async (jobId) => {
  // POST /api/jobs/:jobId/apply
  // Returns: application confirmation
}
```

#### `getMyJobs()`
```javascript
getMyJobs: async () => {
  // GET /api/jobs/my-jobs
  // Returns: alumni's posted jobs
}
```

### 4. Mentorship Service
**File**: `src/services/mentorshipService.js`

**Methods**:

#### `getAllMentorshipRequests()`
```javascript
getAllMentorshipRequests: async () => {
  // GET /api/mentorship
  // Returns: array of mentorship requests
}
```

#### `sendMentorshipRequest(mentorId, message)`
```javascript
sendMentorshipRequest: async (mentorId, message) => {
  // POST /api/mentorship
  // Returns: created request object
}
```

#### `acceptMentorshipRequest(requestId)`
```javascript
acceptMentorshipRequest: async (requestId) => {
  // PUT /api/mentorship/:requestId/accept
  // Returns: updated request
}
```

#### `rejectMentorshipRequest(requestId)`
```javascript
rejectMentorshipRequest: async (requestId) => {
  // PUT /api/mentorship/:requestId/reject
  // Returns: updated request
}
```

#### `getMyMentorshipRequests()`
```javascript
getMyMentorshipRequests: async () => {
  // GET /api/mentorship/my-requests
  // Returns: user's mentorship requests
}
```

## Context & State Management

### AuthContext
**File**: `src/context/AuthContext.jsx`

**Context Provider**: `<AuthProvider>`

**Hook**: `useAuth()`

**State & Functions**:
```javascript
const {
  user,              // Current user object or null
  setUser,           // Function to update user
  login,             // Async login function
  logout,            // Logout function
  register,          // Async register function
  loading            // Loading state
} = useAuth();
```

**User Object Structure**:
```javascript
{
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  role: "student" | "alumni",
  title?: string,
  company?: string,
  industry?: string,
  expertise?: string,
  bio?: string,
  location?: string
}
```

**Example Usage**:
```jsx
import { useAuth } from "../context/AuthContext";

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  
  return (
    <div>
      Welcome, {user.firstName}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Routing

### Route Table

| Route | Component | Auth | Role |
|-------|-----------|------|------|
| `/` | Login | ❌ | N/A |
| `/register` | Register | ❌ | N/A |
| `/student-dashboard` | StudentDashboard | ✅ | Student |
| `/alumni-dashboard` | AlumniDashboard | ✅ | Alumni |
| `/browse-alumni` | BrowseAlumni | ✅ | Both |
| `/jobs` | Jobs | ✅ | Both |
| `/mentorship` | Mentorship | ✅ | Both |
| `/profile` | Profile | ✅ | Both |

### Protected Routes
To add route protection:
```jsx
// In App.jsx or a ProtectedRoute component
<Route 
  path="/student-dashboard" 
  element={
    user?.role === "student" ? 
      <StudentDashboard /> : 
      <Navigate to="/" />
  } 
/>
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Users
- `GET /api/users/alumni` - Get all alumni
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users/alumni/search?q=query` - Search alumni

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create job (alumni)
- `POST /api/jobs/:id/apply` - Apply for job
- `GET /api/jobs/my-jobs` - Get my jobs (alumni)

### Mentorship
- `GET /api/mentorship` - Get all requests
- `POST /api/mentorship` - Send mentorship request
- `PUT /api/mentorship/:id/accept` - Accept request
- `PUT /api/mentorship/:id/reject` - Reject request
- `GET /api/mentorship/my-requests` - Get my requests

## Styling & Theme

### Tailwind Configuration
**File**: `tailwind.config.js`

**Custom Colors**:
```javascript
primary: "#3b82f6",      // Blue
secondary: "#8b5cf6"     // Purple
```

**Color Palette**:
- Primary Blue: #3b82f6
- Secondary Purple: #8b5cf6
- Neutrals: Gray scale (gray-50 to gray-900)
- Success: Green
- Warning: Yellow
- Error: Red

### CSS Structure
**Global Styles**: `src/index.css`
- Tailwind directives (base, components, utilities)
- Global box-sizing
- HTML/body/root height settings

### Component Styling
All components use Tailwind utility classes:
```jsx
<div className="p-6 bg-white rounded-lg shadow border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600 mt-2">Description</p>
  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
    Action
  </button>
</div>
```

## Development Guide

### Adding a New Page

1. Create file in `src/pages/NewPage.jsx`
2. Import necessary components:
```jsx
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
```

3. Create page component:
```jsx
const NewPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!loading && !user) navigate("/");
  }, [user, loading, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Page content */}
        </main>
      </div>
    </div>
  );
};

export default NewPage;
```

4. Add route in `App.jsx`:
```jsx
<Route path="/new-page" element={<NewPage />} />
```

### Adding a New Component

1. Create file in `src/components/NewComponent.jsx`
2. Define props interface in comments
3. Create component:
```jsx
const NewComponent = ({ prop1, prop2, onAction }) => {
  return <div>{/* component JSX */}</div>;
};

export default NewComponent;
```

### Adding a New Service

1. Create file in `src/services/newService.js`
2. Import axios and authService for token
3. Create axios instance with interceptor
4. Define and export service methods
5. Import in pages/components as needed

### Best Practices

- **Component Names**: PascalCase (e.g., `UserProfile`)
- **File Names**: Match component name (e.g., `UserProfile.jsx`)
- **Service Names**: camelCase (e.g., `userService`)
- **Function Names**: camelCase (e.g., `getUserProfile()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Comments**: Add JSDoc comments for complex functions
- **Error Handling**: Always use try-catch in async operations
- **Loading States**: Show loading indicators during async operations

### Common Patterns

**Form Handling**:
```jsx
const [formData, setFormData] = useState({ field: "" });
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

**API Calls**:
```jsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleSubmit = async () => {
  setLoading(true);
  setError("");
  try {
    const response = await userService.updateProfile(data);
    // Handle success
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

**Conditional Rendering**:
```jsx
{loading && <div>Loading...</div>}
{error && <div className="text-red-600">{error}</div>}
{!loading && data && <div>Content</div>}
```

---

**Complete Frontend Documentation**  
**Version**: 1.0.0  
**Last Updated**: April 2026  
**Status**: Production Ready ✅
