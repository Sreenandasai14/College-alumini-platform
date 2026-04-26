# AlumniHub - Frontend

A modern, fully-featured College Alumni Networking and Mentorship Platform built with React (Vite) and Tailwind CSS.

## 📋 Features

### Authentication
- User registration with role selection (Student/Alumni)
- Secure login with JWT token management
- Session persistence with localStorage
- Logout functionality

### Student Features
- **Dashboard**: Quick stats on alumni browsed, jobs applied, mentorship connections
- **Browse Alumni**: Search and filter alumni by name, company, industry, and expertise
- **Job Opportunities**: View and apply for internships and job postings
- **Find Mentor**: Browse available mentors and send mentorship requests
- **Profile**: View and edit personal profile information

### Alumni Features
- **Dashboard**: View stats on jobs posted, mentorship requests, profile views
- **Post Jobs**: Create and manage job/internship opportunities
- **Mentorship Hub**: Manage incoming mentorship requests (accept/reject)
- **Browse Network**: Connect with other alumni
- **Profile**: Maintain detailed professional profile

### Networking Hub
- Advanced search and filtering capabilities
- Industry and expertise-based search
- Professional cards displaying key information

## 🛠️ Tech Stack

- **React 19.2.5** - UI Library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **JavaScript (ES6+)** - Programming language

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FULL_STACK_PROJECT/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your API endpoint:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## 🚀 Running the Application

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── AlumniCard.jsx
│   │   ├── JobCard.jsx
│   │   ├── MentorshipRequest.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── pages/                # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── AlumniDashboard.jsx
│   │   ├── BrowseAlumni.jsx
│   │   ├── Jobs.jsx
│   │   ├── Mentorship.jsx
│   │   └── Profile.jsx
│   ├── services/             # API service files
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── jobService.js
│   │   └── mentorshipService.js
│   ├── context/              # React Context
│   │   └── AuthContext.jsx
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles with Tailwind
├── public/                   # Static assets
├── .env                      # Environment variables
├── .env.example              # Environment template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── package.json              # Dependencies and scripts
```

## 🔐 Authentication

### Login Page
- Email and password input fields
- Error handling with user feedback
- Redirect to appropriate dashboard based on user role

### Register Page
- First and last name fields
- Email and password with confirmation
- Role selection (Student/Alumni)
- Form validation

### Auth Context
- Global authentication state management
- User data persistence
- Login/logout/register functions
- Token management

## 🎨 UI Components

### Navbar
- Responsive navigation bar
- User profile dropdown
- Logout button
- Role-based navigation links

### Sidebar
- Role-based navigation menu
- Active route highlighting
- Collapsible on mobile (can be enhanced)
- Quick access to main features

### AlumniCard
- Display alumni information
- Show expertise and company
- Request mentorship button
- View profile link

### JobCard
- Job listing with details
- Skills display
- Apply button
- Job type and salary information

### MentorshipRequest
- Display request information
- Status badges (Pending/Accepted/Rejected)
- Accept/Reject actions for mentors
- Timestamp display

## 🔄 API Integration

The application connects to backend APIs through service files:

### Auth Service
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Service
- `GET /api/users/alumni` - Get all alumni
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users/alumni/search` - Search alumni

### Job Service
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (alumni only)
- `POST /api/jobs/:id/apply` - Apply for job

### Mentorship Service
- `GET /api/mentorship` - Get mentorship requests
- `POST /api/mentorship` - Send mentorship request
- `PUT /api/mentorship/:id/accept` - Accept request
- `PUT /api/mentorship/:id/reject` - Reject request

## 🎯 Routing

| Route | Component | Auth Required | Role |
|-------|-----------|---|------|
| `/` | Login | No | - |
| `/register` | Register | No | - |
| `/student-dashboard` | StudentDashboard | Yes | Student |
| `/alumni-dashboard` | AlumniDashboard | Yes | Alumni |
| `/browse-alumni` | BrowseAlumni | Yes | Both |
| `/jobs` | Jobs | Yes | Both |
| `/mentorship` | Mentorship | Yes | Both |
| `/profile` | Profile | Yes | Both |

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Responsive design classes
- Custom color scheme with blue and purple accents
- Pre-configured with gradient utilities

### Color Scheme
- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Neutral: Gray scale
- Success: Green
- Warning: Yellow
- Error: Red

## 🔧 Development Tips

### Adding New Pages
1. Create a new file in `src/pages/`
2. Import Navbar and Sidebar components
3. Use the AuthContext for user data
4. Add route in App.jsx

### Adding New Components
1. Create a new file in `src/components/`
2. Export the component as default
3. Import and use in pages

### API Calls
1. Use service files in `src/services/`
2. Axios instance includes auth token automatically
3. Catch and handle errors appropriately

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Responsive grid layouts
- Mobile-optimized navigation
- Touch-friendly buttons and inputs

## 🐛 Troubleshooting

### Port already in use
Change the port in vite.config.js:
```javascript
export default defineConfig({
  server: {
    port: 3000
  }
})
```

### API connection issues
- Verify backend is running on the correct port
- Check `.env` file API_URL configuration
- Check browser console for error messages

### Styling not applied
- Ensure Tailwind CSS is properly configured
- Check that `index.css` has Tailwind directives
- Clear browser cache and rebuild

## 📚 Learn More

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

## 📝 License

This project is part of the Full Stack Project and is for educational purposes.

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements.

---

**Status**: ✅ Complete and Ready for Development

**Last Updated**: April 2026
