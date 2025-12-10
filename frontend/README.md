# Company Registration & Verification Module – Frontend

A production-ready React frontend application for company registration, authentication, and profile management. Built with React 19, Redux Toolkit, Material-UI, and Firebase Auth integration.

---

# 📑 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
  - [Authentication & Security](#authentication--security)
  - [Company Management](#company-management)
  - [User Experience](#user-experience)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Application Routes](#application-routes)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Component Documentation](#component-documentation)
- [Form Validation](#form-validation)
- [File Upload Guidelines](#file-upload-guidelines)
- [Styling & Theming](#styling--theming)
- [Testing Guide](#testing-guide)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Browser Support](#browser-support)
- [Performance Optimization](#performance-optimization)
- [Security Considerations](#security-considerations)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)

---

# 📌 Project Overview

A comprehensive frontend solution for the BlueStock Fintech internship assignment, providing a complete company registration and verification workflow with multi-step forms, real-time validation, and seamless backend integration.

**Key Highlights:**

- Modern React architecture with hooks and functional components
- Type-safe form handling with React Hook Form and Yup validation
- Responsive Material-UI design system
- Redux Toolkit for predictable state management
- Firebase Authentication integration
- Cloudinary image upload support
- Comprehensive error handling and user feedback

---

# ✨ Features

## 🔐 Authentication & Security

- **Email/Password Registration**: Complete user onboarding flow
- **Firebase Authentication**: Secure authentication with Firebase
- **Mobile OTP Verification**: SMS-based phone number verification
- **Email Verification**: Link-based email verification
- **Password Reset**: Forgot password with email reset link
- **JWT Session Management**: 90-day token validity
- **Protected Routes**: Role-based access control
- **Persistent Sessions**: Auto-login on page refresh
- **Secure Logout**: Token cleanup and state reset

## 🏢 Company Management

- **Multi-Step Registration**: 4-step wizard interface
  - Step 1: Company Info (logo, banner, name, description)
  - Step 2: Founding Info (industry, date, website)
  - Step 3: Social Media Links (Facebook, Twitter, LinkedIn, etc.)
  - Step 4: Contact Details (address, phone, email)
- **Profile Dashboard**: Comprehensive company overview
- **Edit Capabilities**: Update company and user profiles
- **Image Management**: Upload and replace logos/banners
- **Progress Tracking**: Visual completion percentage
- **Real-time Updates**: Instant UI updates on changes

## 🎨 User Experience

- **Responsive Design**: Mobile-first approach
- **Material-UI Components**: Consistent design language
- **Toast Notifications**: User-friendly feedback
- **Loading States**: Clear loading indicators
- **Error Handling**: Graceful error messages
- **Form Validation**: Real-time input validation
- **Accessibility**: ARIA labels and keyboard navigation
- **Smooth Animations**: Enhanced user interactions

---

# 🛠 Technology Stack

| Category              | Technology          | Version  |
| --------------------- | ------------------- | -------- |
| **Core**              | React               | 18.2.0   |
| **Build Tool**        | Vite                | 7.2.4    |
| **State Management**  | Redux Toolkit       | 2.5.0    |
| **Routing**           | React Router DOM    | 6.28.0   |
| **UI Framework**      | Material-UI (MUI)   | 6.3.1    |
| **Form Handling**     | React Hook Form     | 7.54.2   |
| **Validation**        | Yup                 | 1.6.1    |
| **HTTP Client**       | Axios               | 1.7.9    |
| **Authentication**    | Firebase            | 11.1.0   |
| **Notifications**     | React Toastify      | 11.0.5   |
| **Phone Input**       | React Phone Input 2 | 2.15.1   |
| **Date Picker**       | React Datepicker    | 9.0.0    |
| **Image Management**  | Cloudinary Core     | 2.13.1   |
| **Cookie Management** | js-cookie           | 3.0.5    |
| **Alerts**            | SweetAlert2         | 11.15.14 |

---

# 📁 Project Structure

```
frontend/
├── public/
│   ├── assets/                 # Static assets
│   └── favicon.ico
├── src/
│   ├── api/                    # API layer
│   │   ├── axiosInstance.js    # Axios configuration with interceptors
│   │   ├── authApi.js          # Authentication endpoints
│   │   └── companyApi.js       # Company endpoints
│   ├── assets/                 # Images, fonts, etc.
│   │   ├── images/
│   │   └── fonts/
│   ├── components/             # Reusable components
│   │   ├── auth/               # Authentication components
│   │   │   └── OTPVerificationModal.jsx
│   │   ├── company/            # Company setup components
│   │   │   ├── CompanyInfoStep.jsx
│   │   │   ├── FoundingInfoStep.jsx
│   │   │   ├── SocialLinksStep.jsx
│   │   │   ├── ContactStep.jsx
│   │   │   └── SetupComplete.jsx
│   │   ├── dashboard/          # Dashboard components
│   │   │   ├── Overview.jsx
│   │   │   ├── ProfileEdit.jsx
│   │   │   ├── CompanyEdit.jsx
│   │   │   └── VerificationTab.jsx
│   │   ├── layout/             # Layout components
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   └── common/             # Shared components
│   ├── config/                 # Configuration files
│   │   ├── firebase.js         # Firebase initialization
│   │   └── cloudinary.js       # Cloudinary configuration
│   ├── hooks/                  # Custom React hooks
│   │   ├── useAuth.js          # Authentication hook
│   │   └── useCompany.js       # Company data hook
│   ├── pages/                  # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── CompanySetup.jsx
│   │   ├── Dashboard.jsx
│   │   └── NotFound.jsx
│   ├── store/                  # Redux store
│   │   ├── index.js            # Store configuration
│   │   └── slices/             # Redux slices
│   │       ├── authSlice.js
│   │       ├── companySlice.js
│   │       └── uiSlice.js
│   ├── styles/                 # Global styles
│   │   ├── theme.js            # MUI theme configuration
│   │   └── global.css          # Global CSS
│   ├── utils/                  # Utility functions
│   │   ├── validators.js       # Validation schemas
│   │   ├── helpers.js          # Helper functions
│   │   └── constants.js        # Constants and enums
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── .env.local                  # Environment variables
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

# ⚙️ Setup & Installation

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Backend API running on `http://localhost:4000`
- Firebase project with Auth enabled
- Cloudinary account for image uploads

## Installation Steps

### 1. Clone Repository

```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
nano .env.local
```

### 4. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:5173`

---

# 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# ============================================
# API CONFIGURATION
# ============================================
VITE_API_BASE_URL=http://localhost:4000/api
VITE_SERVER_URL=http://localhost:4000

# ============================================
# FIREBASE CONFIGURATION
# ============================================
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# ============================================
# CLOUDINARY CONFIGURATION
# ============================================
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# ============================================
# APP CONFIGURATION
# ============================================
VITE_APP_NAME=BlueStock Company Portal
VITE_APP_VERSION=1.0.0
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Authentication** → Email/Password and Phone
4. Get your config from Project Settings
5. Add values to `.env.local`

### Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard → Settings
3. Create an **unsigned upload preset**:
   - Settings → Upload → Upload presets → Add upload preset
   - Signing Mode: **Unsigned**
   - Folder: `company_uploads`
4. Copy Cloud Name and Preset to `.env.local`

---

# 🗺 Application Routes

## Public Routes

| Path               | Component          | Description            |
| ------------------ | ------------------ | ---------------------- |
| `/login`           | Login.jsx          | User login page        |
| `/register`        | Register.jsx       | User registration      |
| `/forgot-password` | ForgotPassword.jsx | Password reset request |
| `/`                | Redirect           | Redirects to `/login`  |

## Protected Routes

| Path                      | Component           | Description                     | Auth Required    |
| ------------------------- | ------------------- | ------------------------------- | ---------------- |
| `/company-setup`          | CompanySetup.jsx    | Multi-step company registration | ✅               |
| `/dashboard`              | Dashboard.jsx       | Main dashboard                  | ✅               |
| `/dashboard/profile-edit` | ProfileEdit.jsx     | Edit user profile               | ✅               |
| `/dashboard/company-edit` | CompanyEdit.jsx     | Edit company profile            | ✅               |
| `/dashboard/verification` | VerificationTab.jsx | Email/Mobile verification       | ✅ (conditional) |

## Route Guards

**PublicRoute**: Redirects authenticated users to dashboard
**ProtectedRoute**: Redirects unauthenticated users to login

```javascript
// Auto-redirect logic
- If logged in + no company → /company-setup
- If logged in + has company → /dashboard
- If not logged in → /login
```

---

# 🗄 State Management

## Redux Store Structure

```javascript
{
  auth: {
    user: Object | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: Object | null,
    registrationData: Object | null
  },
  company: {
    company: Object | null,
    loading: boolean,
    error: Object | null,
    setupProgress: number
  },
  ui: {
    sidebarOpen: boolean,
    theme: string,
    loading: boolean
  }
}
```

## Redux Slices

### authSlice.js

**State:**

- User data
- Authentication status
- JWT token
- Registration temporary data

**Actions:**

- `setUser` - Set authenticated user
- `logout` - Clear user session
- `clearError` - Clear error messages
- `setRegistrationData` - Store registration info

**Async Thunks:**

- `registerUser` - User registration
- `loginUser` - User login
- `verifyMobileOTP` - Verify mobile number
- `fetchUserProfile` - Get user profile
- `updateUserProfile` - Update user details

### companySlice.js

**State:**

- Company profile data
- Setup progress percentage
- Loading states

**Actions:**

- `setSetupProgress` - Update setup progress
- `clearCompanyError` - Clear errors

**Async Thunks:**

- `registerCompany` - Create company profile
- `fetchCompanyProfile` - Get company data
- `updateCompanyProfile` - Update company
- `uploadCompanyLogo` - Upload logo
- `uploadCompanyBanner` - Upload banner

### uiSlice.js

**State:**

- Sidebar visibility
- Theme preference
- Global loading

**Actions:**

- `toggleSidebar` - Toggle sidebar
- `setSidebarOpen` - Set sidebar state
- `setTheme` - Change theme
- `setLoading` - Global loading state

---

# 📡 API Integration

## Axios Configuration

**Base Configuration:**

```javascript
baseURL: http://localhost:4000/api
timeout: 30000
headers: { 'Content-Type': 'application/json' }
```

**Request Interceptor:**

- Automatically adds JWT token to headers
- Format: `Authorization: Bearer <token>`

**Response Interceptor:**

- Handles global error responses
- Auto-logout on 401 Unauthorized
- Toast notifications for errors

## API Modules

### authApi.js

```javascript
register(userData); // POST /auth/register
login(credentials); // POST /auth/login
verifyEmail(token); // GET /auth/verify-email
verifyMobile(data); // POST /auth/verify-mobile
resendOTP(userId); // POST /auth/resend-otp
forgotPassword(email); // POST /auth/forgot-password
resetPassword(data); // POST /auth/reset-password
getProfile(); // GET /auth/profile
updateProfile(data); // PUT /auth/profile
logout(); // POST /auth/logout
```

### companyApi.js

```javascript
registerCompany(formData); // POST /company/register
getCompanyProfile(); // GET /company/profile
updateCompanyProfile(formData); // PUT /company/profile
uploadLogo(file); // POST /company/upload-logo
uploadBanner(file); // POST /company/upload-banner
deleteLogo(); // DELETE /company/logo
deleteBanner(); // DELETE /company/banner
```

---

# 🧩 Component Documentation

## Authentication Components

### Login.jsx

**Purpose**: User authentication page

**Features:**

- Email/password login
- Password visibility toggle
- "Forgot Password" link
- "Login with OTP" option
- Auto-redirect after login

**Props**: None

**State Management**: Redux (authSlice)

---

### Register.jsx

**Purpose**: New user registration

**Features:**

- Full name, email, mobile, gender inputs
- Password strength validation
- Terms and conditions checkbox
- Phone input with country code
- OTP modal integration

**Validation Schema**: `registerSchema` (Yup)

**Form Handler**: React Hook Form

---

### OTPVerificationModal.jsx

**Purpose**: Mobile number verification via OTP

**Props:**

- `open` (boolean) - Modal visibility
- `onClose` (function) - Close handler
- `userId` (number) - User ID for verification
- `mobileNo` (string) - Phone number to verify
- `onVerified` (function) - Success callback

**Features:**

- 6-digit OTP input
- Resend OTP functionality
- Real-time validation
- Error handling

---

## Company Setup Components

### CompanyInfoStep.jsx

**Purpose**: Step 1 - Company basic information

**Features:**

- Logo upload (400x400px recommended)
- Banner upload (1520x400px recommended)
- Company name input
- Description textarea
- Image preview with remove option
- Drag & drop support

**Validation:**

- Company name required
- Max file size: 5MB
- Formats: JPEG, PNG, WebP

---

### FoundingInfoStep.jsx

**Purpose**: Step 2 - Founding details

**Features:**

- Organization type selector
- Industry dropdown
- Team size selector
- Founded date picker
- Website URL input
- Company vision textarea

**Validation:**

- Industry required
- Valid URL format for website

---

### SocialLinksStep.jsx

**Purpose**: Step 3 - Social media profiles

**Features:**

- Dynamic social link addition
- Platform selector (Facebook, Twitter, LinkedIn, Instagram, YouTube)
- URL validation per platform
- Add/remove links
- Platform-specific icons

**Validation:**

- Platform-specific URL patterns
- Optional fields

---

### ContactStep.jsx

**Purpose**: Step 4 - Contact information

**Features:**

- Address input
- Phone number with country code
- Email input
- City, State, Country fields
- Postal code
- Map location (optional)

**Validation:**

- All fields required except email
- Valid phone format
- Postal code format validation

---

### SetupComplete.jsx

**Purpose**: Success screen after company setup

**Features:**

- Completion celebration message
- "View Dashboard" button
- "View Profile" button
- 100% progress indicator

---

## Dashboard Components

### Overview.jsx

**Purpose**: Dashboard home page

**Features:**

- User profile summary
- Company profile card
- Verification status badges
- Company description
- Quick stats

**Data Sources:**

- Redux: `auth.user`
- Redux: `company.company`

---

### ProfileEdit.jsx

**Purpose**: Edit user personal information

**Features:**

- Full name update
- Mobile number change
- Gender selection
- Real-time validation
- Save button with loading state

**Validation:**

- Name required
- Valid phone format
- Mobile uniqueness check

---

### CompanyEdit.jsx

**Purpose**: Edit company profile

**Features:**

- Logo/banner replacement
- Company details update
- Image preview
- All company fields editable
- Form auto-population

**Validation:**

- Company name required
- Address fields required
- Valid URL format

---

### VerificationTab.jsx

**Purpose**: Email and mobile verification

**Features:**

- Email verification status
- Mobile verification status
- Resend verification options
- OTP input for mobile
- Success/error badges

**Visibility**: Only shown if user is not fully verified

**Conditional Rendering**:

```javascript
if (!user?.is_email_verified || !user?.is_mobile_verified) {
  // Show verification tab in sidebar
}
```

---

## Layout Components

### DashboardLayout.jsx

**Purpose**: Main dashboard wrapper

**Features:**

- Responsive layout
- Sidebar integration
- Navbar integration
- Mobile-responsive drawer

**Structure:**

```
┌─────────────────────────┐
│       Navbar            │
├───────┬─────────────────┤
│       │                 │
│ Side  │  Main Content   │
│ bar   │                 │
│       │                 │
└───────┴─────────────────┘
```

---

### Navbar.jsx

**Purpose**: Top navigation bar

**Features:**

- Company name display
- Notification bell (badge)
- User avatar
- Profile dropdown menu
- Logout option

**Menu Items:**

- Profile
- Settings
- Logout

---

### Sidebar.jsx

**Purpose**: Left navigation menu

**Features:**

- Logo/branding
- Navigation menu items
- Active route highlighting
- Conditional verification tab
- Logout button
- Responsive drawer (mobile)

**Menu Structure:**

```
EMPLOYERS DASHBOARD
├── Overview
├── Profile Settings
├── Company Settings
├── Verification (conditional)
└── Log-out
```

**Conditional Logic:**

```javascript
const showVerificationTab =
  !user?.is_email_verified || !user?.is_mobile_verified;
```

---

# ✅ Form Validation

## Validation Schemas (Yup)

### Registration Schema

```javascript
{
  full_name: string, min(2), required;
  email: email, required;
  mobile_no: string, min(10), required;
  gender: enum[("m", "f", "o")], required;
  password: string, min(8), pattern(PASSWORD_REGEX), required;
  confirmPassword: oneOf(password), required;
  agree: boolean, oneOf([true]), required;
}
```

### Login Schema

```javascript
{
  email: email, required;
  password: string, required;
}
```

### Company Basic Schema

```javascript
{
  company_name: string, min(2), required;
  description: string, optional;
}
```

### Company Founding Schema

```javascript
{
  industry: string, required;
  founded_date: date, nullable;
  website: url, nullable;
}
```

### Company Contact Schema

```javascript
{
  address: string, required;
  city: string, required;
  state: string, required;
  country: string, required;
  postal_code: string, required;
}
```

## Validation Rules

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%\*?&)

**Regex:**

```regex
^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$
```

### Email Validation

```regex
^[^\s@]+@[^\s@]+\.[^\s@]+$
```

### Phone Validation

```regex
^\+?[1-9]\d{1,14}$
```

### URL Validation

```regex
^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$
```

---

# 📤 File Upload Guidelines

## Logo Upload

**Specifications:**

- **Recommended Size**: 400x400 pixels
- **Minimum Size**: 100x100 pixels
- **Max File Size**: 5MB
- **Formats**: JPEG, JPG, PNG, WebP
- **Aspect Ratio**: 1:1 (square)

**Validation:**

```javascript
validateImageFile(file, (maxSizeMB = 5));
```

## Banner Upload

**Specifications:**

- **Recommended Size**: 1520x400 pixels
- **Minimum Size**: 1200x300 pixels
- **Max File Size**: 5MB
- **Formats**: JPEG, JPG, PNG, WebP
- **Aspect Ratio**: 16:4 (wide)

## Upload Process

1. **Client-side validation**

   - File type check
   - File size check
   - Image dimension check (optional)

2. **Preview generation**

   - Create Object URL
   - Display preview image
   - Show file info

3. **Server upload**

   - Convert to FormData
   - Append file and metadata
   - POST to API endpoint

4. **Cloudinary processing**
   - Backend uploads to Cloudinary
   - Returns secure URL
   - URL saved to database

## Error Handling

```javascript
// File too large
if (file.size > 5 * 1024 * 1024) {
  toast.error("File size exceeds 5MB limit");
}

// Invalid format
if (!validTypes.includes(file.type)) {
  toast.error("Only JPEG, PNG, and WebP allowed");
}
```

---

# 🎨 Styling & Theming

## Material-UI Theme

**Primary Color**: Indigo (#4F46E5)
**Secondary Color**: Cyan (#06B6D4)
**Error Color**: Red (#EF4444)
**Success Color**: Green (#10B981)

### Theme Configuration

```javascript
palette: {
  primary: { main: '#4F46E5' },
  secondary: { main: '#06B6D4' },
  error: { main: '#EF4444' },
  warning: { main: '#F59E0B' },
  success: { main: '#10B981' },
  background: {
    default: '#F9FAFB',
    paper: '#FFFFFF'
  }
}
```

### Typography

**Font Family**: Inter, system fonts

**Variants:**

- h1-h6: Headings
- body1-body2: Body text
- button: Button text
- caption: Small text

### Shadows

Material-UI elevation system (0-24)

**Custom shadows:**

```javascript
shadows[1]: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
shadows[2]: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
shadows[3]: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
```

### Component Overrides

**Button:**

- `textTransform: 'none'`
- `fontWeight: 600`
- `borderRadius: 8`

**TextField:**

- `borderRadius: 8`

**Card:**

- `borderRadius: 12`
- `boxShadow: custom`

## Responsive Breakpoints

```javascript
xs: 0px      // Mobile
sm: 600px    // Tablet
md: 900px    // Small laptop
lg: 1200px   // Desktop
xl: 1536px   // Large desktop
```

## Global CSS

**Custom Scrollbar:**

```css
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background: #888;
}
```

**Phone Input Styling:**

```css
.react-tel-input .form-control {
  height: 56px;
  border-radius: 8px;
  font-family: "Inter";
}
```

**Date Picker Styling:**

```css
.react-datepicker-wrapper {
  width: 100%;
}
```

---

# 🧪 Testing Guide

## Manual Testing Checklist

### 1. Registration Flow

```
✅ Fill all required fields
✅ Password validation works
✅ Email format validation
✅ Phone number validation
✅ Gender selection
✅ Terms checkbox required
✅ Form submission
✅ OTP modal appears
✅ OTP validation (6 digits)
✅ Resend OTP works
✅ Email verification sent
✅ Redirect to login after success
```

### 2. Login Flow

```
✅ Valid credentials login
✅ Invalid credentials error
✅ Password visibility toggle
✅ "Forgot Password" link works
✅ Auto-redirect based on company status
✅ Token stored in cookies
✅ User data in localStorage
```

### 3. Company Setup Flow

```
✅ Logo upload works
✅ Banner upload works
✅ Image preview displays
✅ Image remove works
✅ Step 1: Company info submission
✅ Step 2: Founding info submission
✅ Step 3: Social links (add/remove)
✅ Step 4: Contact details
✅ Progress bar updates
✅ Success screen displays
✅ Redirect to dashboard
```

### 4. Dashboard Flow

```
✅ Overview page loads
✅ User data displays correctly
✅ Company data displays correctly
✅ Sidebar navigation works
✅ Profile edit form
✅ Company edit form
✅ Verification tab (if needed)
✅ Logout works
```

### 5. Verification Flow

```
✅ Email verification status
✅ Mobile verification status
✅ Resend email verification
✅ Resend mobile OTP
✅ OTP verification
✅ Tab hidden when verified
```

### 6. Forgot Password Flow

```
✅ Email input validation
✅ Reset link sent message
✅ Email received (check inbox)
✅ Reset password form
✅ New password validation
✅ Login with new password
```

## API Testing (using Browser DevTools)

### Check Network Requests

```javascript
// Open DevTools → Network tab
// Filter: XHR

// Expected requests:
POST / api / auth / register;
POST / api / auth / login;
GET / api / auth / profile;
POST / api / company / register;
GET / api / company / profile;
PUT / api / company / profile;
```

### Check Response Data

**Login Response Should Include:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "hasCompany": true // ✅ This determines redirect
    }
  }
}
```

---

# 🚀 Deployment

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Environment Variables for Production

```env
VITE_API_BASE_URL=https://api.yourcompany.com/api
VITE_SERVER_URL=https://api.yourcompany.com
VITE_FIREBASE_API_KEY=your_production_key
VITE_CLOUDINARY_CLOUD_NAME=your_production_cloud
```

## Deployment Options

### 1. Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

**vercel.json:**

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### 2. Netlify

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. AWS S3 + CloudFront

```bash
aws s3 sync dist/ s3://your-bucket-name
```

### 4. Docker

**Dockerfile:**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build and run:

```bash
docker build -t company-portal .
docker run -p 3000:3000 company-portal
```

---

# 🐛 Troubleshooting

## Common Issues & Solutions

### 1. Login Redirects to Company Setup When User Already Has Company

**Problem**: After login, users with existing companies are sent to `/company-setup` instead of `/dashboard`.

**Solution**:

- Backend must return `hasCompany: true` in login response
- Update `authController.login()` to check for existing company profile
- Frontend `Login.jsx` checks `user.hasCompany` for redirect logic

**Fix Applied**: ✅ See backend controller update above

---

### 2. CORS Errors

**Problem**:

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution**:

```javascript
// Backend server.js - Update CORS config
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

**Frontend**: Ensure `.env.local` has correct `VITE_API_BASE_URL`

---

### 3. Images Not Uploading

**Problem**: File uploads fail or timeout

**Solutions**:

**a) Check Cloudinary credentials:**

```bash
# Verify in .env.local
VITE_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

**b) File size too large:**

```javascript
// Max size is 5MB
if (file.size > 5 * 1024 * 1024) {
  // File too large
}
```

**c) Invalid file format:**

```javascript
// Only JPEG, PNG, WebP allowed
const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
```

---

### 4. OTP Verification Fails

**Problem**: SMS OTP not received or verification fails

**Solutions**:

**a) Firebase SMS not configured:**

- Enable Phone Authentication in Firebase Console
- Add test phone numbers for development

**b) Development mode workaround:**

```javascript
// Backend allows mock OTP in development
if (process.env.NODE_ENV === "development") {
  // Any 6-digit OTP works
}
```

**c) Check Firebase quota:**

- Free tier: 10k verifications/month
- Check Firebase Console → Authentication → Usage

---

### 5. Session Expires Immediately

**Problem**: User logged out after page refresh

**Solutions**:

**a) Check token storage:**

```javascript
// Verify token is saved
console.log(Cookies.get("token"));
console.log(localStorage.getItem("user"));
```

**b) Backend JWT secret:**

```bash
# .env must have JWT_SECRET
JWT_SECRET=your_very_long_random_secret_key_here
```

**c) Token in axios headers:**

```javascript
// Check interceptor adds token
console.log(config.headers.Authorization);
// Should be: "Bearer <your_token>"
```

---

### 6. Form Validation Errors

**Problem**: Form submission fails with validation errors

**Solutions**:

**a) Check required fields:**

```javascript
// All red asterisk (*) fields must be filled
// Check console for validation messages
```

**b) Password requirements:**

- Minimum 8 characters
- Must include: uppercase, lowercase, number, special char

**c) Phone number format:**

```
Correct: +919876543210
Incorrect: 9876543210 (missing country code)
```

---

### 7. Redux State Not Updating

**Problem**: UI doesn't reflect state changes

**Solutions**:

**a) Check Redux DevTools:**

```bash
# Install Redux DevTools Extension
# Monitor actions and state changes
```

**b) Dispatch actions properly:**

```javascript
// Always await async thunks
await dispatch(loginUser(credentials));
```

**c) Use selectors:**

```javascript
// Use useSelector to access state
const { user } = useSelector((state) => state.auth);
```

---

### 8. Routing Issues

**Problem**: Routes don't work or 404 errors

**Solutions**:

**a) Check React Router setup:**

```javascript
// Ensure BrowserRouter wraps App
<BrowserRouter>
  <App />
</BrowserRouter>
```

**b) Vite server config:**

```javascript
// vite.config.js
server: {
  historyApiFallback: true;
}
```

**c) Protected route checks:**

```javascript
// Verify token exists before accessing protected routes
const token = Cookies.get("token");
if (!token) navigate("/login");
```

---

### 9. Environment Variables Not Loading

**Problem**: `undefined` when accessing `import.meta.env.VITE_*`

**Solutions**:

**a) File naming:**

```bash
# Must be .env.local (NOT .env)
.env.local  ✅
.env        ❌
```

**b) Variable prefix:**

```bash
# Must start with VITE_
VITE_API_BASE_URL  ✅
API_BASE_URL       ❌
```

**c) Restart dev server:**

```bash
# After changing .env.local
npm run dev
```

---

### 10. Build Errors

**Problem**: `npm run build` fails

**Solutions**:

**a) Check dependencies:**

```bash
npm install
npm audit fix
```

**b) TypeScript errors:**

```bash
# Disable type checking temporarily
npm run build -- --skipLibCheck
```

**c) Clear cache:**

```bash
rm -rf node_modules dist
npm install
npm run build
```

---

## Debug Mode

Enable detailed logging:

```javascript
// src/api/axiosInstance.js
axiosInstance.interceptors.request.use((config) => {
  console.log("📤 Request:", config.method.toUpperCase(), config.url);
  console.log("📦 Data:", config.data);
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("❌ Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

---

# 🎯 Best Practices

## Code Quality

### 1. Component Structure

```javascript
// ✅ Good: Functional component with hooks
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const MyComponent = () => {
  const [localState, setLocalState] = useState(null);
  const globalState = useSelector((state) => state.auth);

  useEffect(() => {
    // Side effects here
  }, []);

  return <div>...</div>;
};

export default MyComponent;
```

### 2. State Management

```javascript
// ✅ Good: Use Redux for global state
const { user } = useSelector((state) => state.auth);

// ✅ Good: Use useState for local component state
const [isOpen, setIsOpen] = useState(false);

// ❌ Bad: Props drilling for global data
<Child user={user} company={company} loading={loading} />;
```

### 3. API Calls

```javascript
// ✅ Good: Use Redux thunks
const handleSubmit = async (data) => {
  await dispatch(updateProfile(data));
};

// ❌ Bad: Direct API calls in components
const handleSubmit = async (data) => {
  await axios.put("/api/auth/profile", data);
};
```

### 4. Error Handling

```javascript
// ✅ Good: Try-catch with user feedback
try {
  await dispatch(uploadLogo(file));
  toast.success("Logo uploaded!");
} catch (error) {
  toast.error("Upload failed");
  console.error(error);
}

// ❌ Bad: No error handling
await dispatch(uploadLogo(file));
```

### 5. Form Validation

```javascript
// ✅ Good: Schema-based validation
const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});

// ✅ Good: React Hook Form integration
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: yupResolver(schema),
});
```

---

## Performance Optimization

### 1. Code Splitting

```javascript
// ✅ Lazy load pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CompanySetup = lazy(() => import("./pages/CompanySetup"));
```

### 2. Memoization

```javascript
// ✅ Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ Memoize callbacks
const handleClick = useCallback(() => {
  doSomething();
}, []);
```

### 3. Image Optimization

```javascript
// ✅ Use Cloudinary transformations
const optimizedUrl = getCloudinaryUrl(publicId, {
  w: 400,
  h: 400,
  c: "fill",
  f: "auto",
  q: "auto",
});
```

### 4. Bundle Size

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

---

## Security Best Practices

### 1. Never Expose Secrets

```javascript
// ❌ Bad: Secrets in client code
const apiKey = "sk_live_1234567890";

// ✅ Good: Use environment variables
const apiKey = import.meta.env.VITE_API_KEY;

// ✅ Better: Keep secrets on backend only
```

### 2. XSS Prevention

```javascript
// ✅ Good: React auto-escapes
<div>{user.name}</div>

// ❌ Bad: Direct HTML injection
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### 3. CSRF Protection

```javascript
// ✅ JWT in header (not cookie)
Authorization: Bearer <token>

// ✅ Backend validates token on every request
```

### 4. Input Sanitization

```javascript
// ✅ Frontend validation with Yup
// ✅ Backend validation with express-validator
// ✅ Never trust client input
```

---

# 🌐 Browser Support

## Supported Browsers

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ⚠️ IE 11 (not supported)

## Polyfills

If you need to support older browsers:

```bash
npm install core-js regenerator-runtime
```

```javascript
// main.jsx
import "core-js/stable";
import "regenerator-runtime/runtime";
```

---

# 📊 Performance Metrics

## Target Metrics

- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## Monitoring

Use Lighthouse or Web Vitals:

```bash
npm install web-vitals
```

```javascript
// main.jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

# 🔒 Security Considerations

## Implemented Security Measures

1. **JWT Authentication**: 90-day token validity
2. **HttpOnly Cookies**: Secure token storage (optional)
3. **CORS Protection**: Restricted origins
4. **XSS Prevention**: React auto-escaping
5. **CSRF Protection**: JWT in headers
6. **Input Validation**: Client + server side
7. **Rate Limiting**: Backend API throttling
8. **Password Hashing**: bcrypt with 10 rounds
9. **Secure Headers**: Helmet.js on backend
10. **HTTPS**: Required for production

## Security Checklist

- [ ] All API calls use HTTPS
- [ ] Environment variables not committed
- [ ] Passwords meet complexity requirements
- [ ] Session tokens expire appropriately
- [ ] File uploads validated (type, size)
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies regularly updated
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Authentication required for sensitive routes

---

# 🤝 Contributing Guidelines

## Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add user profile edit functionality"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

## Commit Message Convention

```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting changes
refactor: code restructuring
test: add tests
chore: maintenance tasks
```

## Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Write meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

---

# 📄 License

This project is confidential and proprietary to **Bluestock Fintech**.

**Restrictions:**

- ❌ No public sharing (LinkedIn, GitHub, etc.)
- ❌ No unauthorized distribution
- ✅ For assignment evaluation only
- ✅ Covered under NDA

---

# 📞 Support & Contact

For technical issues or questions:

**WhatsApp**: +91 9209550273
**Email**: (provided during assignment)

**Important**: Only contact for critical issues. Avoid unnecessary messages to maintain professionalism.

---

# 🎓 Learning Resources

## React & Redux

- [React Official Docs](https://react.dev/)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [React Router Docs](https://reactrouter.com/)

## Material-UI

- [MUI Documentation](https://mui.com/)
- [MUI Templates](https://mui.com/material-ui/getting-started/templates/)

## Form Handling

- [React Hook Form](https://react-hook-form.com/)
- [Yup Validation](https://github.com/jquense/yup)

## Firebase

- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firebase Console](https://console.firebase.google.com/)

---

# 🏆 Assignment Completion Checklist

## Core Features

- [x] User Registration with validation
- [x] Email/Password Authentication
- [x] Mobile OTP Verification
- [x] Email Verification
- [x] Login with JWT
- [x] Forgot Password Flow
- [x] Multi-step Company Registration
- [x] Logo/Banner Upload
- [x] Dashboard with Sidebar
- [x] Profile Editing
- [x] Company Editing
- [x] Conditional Verification Tab
- [x] Logout Functionality

## Technical Requirements

- [x] React 19 + Vite
- [x] Redux Toolkit State Management
- [x] Material-UI Design System
- [x] React Hook Form + Yup Validation
- [x] Axios API Integration
- [x] Firebase Authentication
- [x] Cloudinary Image Uploads
- [x] Responsive Design
- [x] Toast Notifications
- [x] Protected Routes
- [x] Error Handling

## Code Quality

- [x] Clean component structure
- [x] Proper state management
- [x] Form validation
- [x] Error handling
- [x] Loading states
- [x] Comments and documentation
- [x] Consistent code style

## Testing

- [x] Manual testing completed
- [x] All user flows tested
- [x] Edge cases handled
- [x] Error scenarios tested

---

# 📝 Final Notes

This frontend application is production-ready with:

- ✅ Complete authentication flow
- ✅ Multi-step registration wizard
- ✅ Comprehensive dashboard
- ✅ Image upload capabilities
- ✅ Real-time validation
- ✅ Responsive design
- ✅ Error handling
- ✅ Security best practices

**Demo Date**: August 13, 2025
**Platform**: Microsoft Teams / Google Meet
**Language**: English / Hindi / Marathi

---

**Built with ❤️ for Bluestock Fintech Internship Assignment**
