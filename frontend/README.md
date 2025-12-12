# 🚀 **BlueStock Assignment – Frontend (Final Version)**

### Company Registration, Authentication & Verification System

_React 18 + Redux Toolkit + Firebase + Cloudinary_

---

# 📘 **Overview**

This frontend delivers the complete **BlueStock Company Registration & Verification Flow**, built with:

- **React Router 6**
- **Redux Toolkit**
- **Material UI**
- **Axios with JWT Auth**
- **Firebase Phone Auth**
- **Cloudinary image uploads**

It supports the full registration lifecycle:

1. User registers
2. Email verification (via backend SMTP)
3. Mobile OTP verification (Firebase)
4. Login → JWT stored in cookies
5. Mandatory company setup
6. Dashboard with profile + company editing

---

# ⚡ **System Flow Diagram**

```
User Opens App
    |
    v
Is Logged In?
    |--- No --> Login/Register
    |
    v
Is Company Created?
    |--- No --> Company Setup Wizard
    |
    v
Dashboard (Profile + Company Data)
```

---

# ✨ **Key Features**

### 🔐 Authentication

- Register with email + mobile
- Email verification page (`/verify-email`)
- Firebase OTP-based mobile verification
- JWT login with persistent session restore
- Forgot/reset password
- Protected routes for dashboard + setup

### 🏢 Company Management

- 4-step multi-step company registration
- Logo & banner upload (Cloudinary)
- Full company profile editing
- Auto redirect based on `hasCompany` flag

### 🎨 UI/UX

- Material UI design
- Toast notifications
- Image previews
- Responsive dashboard & sidebar
- Form validation with Yup

---

# 📁 **Project Structure (Simplified)**

```
src/
├── api/
├── components/
├── pages/
├── store/
├── config/
├── utils/
├── App.jsx
└── main.jsx
```

---

# 🔧 **Environment Variables**

`.env.local`:

```
VITE_API_BASE_URL=http://localhost:4000/api
VITE_FIREBASE_API_KEY=xxx
VITE_CLOUDINARY_CLOUD_NAME=xxx
VITE_CLOUDINARY_UPLOAD_PRESET=xxx
```

---

# 🧭 **Routing System Overview**

### ✔ Public Routes

| Path               | Purpose                    |
| ------------------ | -------------------------- |
| `/login`           | Login                      |
| `/register`        | User signup                |
| `/forgot-password` | Reset password             |
| `/verify-email`    | Email verification landing |
| `/email-verified`  | Alias of verify-email      |

---

### ✔ Protected Routes

(_Requires JWT + session restored_)

| Path             | Purpose                       |
| ---------------- | ----------------------------- |
| `/company-setup` | Multi-step company onboarding |
| `/dashboard/*`   | Main app dashboard            |

---

### ✔ Default & 404

| Path | Purpose             |
| ---- | ------------------- |
| `/`  | Redirect → `/login` |
| `*`  | `NotFound`          |

---

# 🧱 **Core App Logic (Your App.jsx)**

Below is your code **explained with clarity**, and cleaned conceptually (not rewritten):

---

## 🔐 **1. Session Restore Logic**

Runs once on mount:

```jsx
const token = Cookies.get("token");
const storedUser = localStorage.getItem("user");

if (token && storedUser) {
  dispatch(setUser({ user: JSON.parse(storedUser), token }));
}
```

✔ Returns user session instantly
✔ Prevents flashing login screen

---

## 🔒 **2. ProtectedRoute Logic**

```jsx
return isAuthenticated ? children : <Navigate to="/login" replace />;
```

✔ Blocks unauthorized users
✔ Redirects to login

---

## 🌐 **3. PublicRoute Logic**

```jsx
if (isAuthenticated) {
  if (!user?.hasCompany) return <Navigate to="/company-setup" replace />;
  return <Navigate to="/dashboard" replace />;
}
```

✔ Stops logged-in users from returning to login
✔ Guides incomplete users to company setup

---

## 📨 **4. Email Verification Pages**

Your new route:

```jsx
<Route path="/verify-email" element={<EmailVerified />} />
<Route path="/email-verified" element={<EmailVerified />} />
```

✔ Matches backend redirect format
✔ Allows status messages on screen

---

# 🧩 **Key Components**

### Authentication

- Login
- Register
- ForgotPassword
- EmailVerified

### Company Setup

- CompanyInfoStep
- FoundingInfoStep
- SocialLinksStep
- ContactStep
- SetupComplete

### Dashboard

- Overview
- ProfileEdit
- CompanyEdit
- VerificationTab

### Shared

- Navbar
- Sidebar
- DashboardLayout

---

# 📡 **API Integration Overview**

### `authApi.js`

```
register
login
verifyEmail
verifyMobile
resendOTP
getProfile
updateProfile
logout
```

### `companyApi.js`

```
registerCompany
getCompanyProfile
updateCompanyProfile
uploadLogo
uploadBanner
```

Axios automatically attaches JWT:

```
Authorization: Bearer <token>
```

---

# 📤 **Image Upload Workflow**

1. User selects file
2. Validate (size, type)
3. Preview image
4. Convert to FormData
5. POST → backend
6. Backend → Cloudinary
7. Cloudinary → secure URL
8. URL stored in DB

---

# 🧪 **Testing Checklist**

### Authentication

✔ Register → OTP → Email verify → Login
✔ Invalid email/mobile handling
✔ Forgot password

### Company Setup

✔ File uploads work
✔ Social links validate
✔ Multi-step navigation
✔ Preview shows correctly

### Dashboard

✔ Profile editing
✔ Company editing
✔ Verification conditions
✔ Logout clears session

---

# ⚠ Troubleshooting

| Issue                   | Fix                                          |
| ----------------------- | -------------------------------------------- |
| Redirect loops          | Check `hasCompany` logic                     |
| Email verify page blank | Ensure backend redirect uses `/verify-email` |
| OTP fails               | Use test OTP: **123456**                     |
| Images not uploading    | Wrong Cloudinary preset                      |

---

# 🏆 **Final Notes**

Everything required is implemented:

### ✔ Authentication

### ✔ Email verify

### ✔ OTP verify

### ✔ JWT sessions

### ✔ Company registration wizard

### ✔ Cloudinary uploads

### ✔ Dashboard

### ✔ Profile/company editing

### ✔ Routing guards

### ✔ Session restore
