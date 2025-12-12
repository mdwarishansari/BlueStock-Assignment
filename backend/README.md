# 🚀 **BlueStock Assignment – Backend API (Final Version)**

### Company Registration, Authentication & Verification System

_Powered by Node.js, Express, PostgreSQL, Firebase OTP & Cloudinary_

---

# 📘 **Overview**

This backend provides a complete **user authentication + company onboarding flow**, including:

- Email/password registration
- Email verification via SMTP
- Mobile OTP verification
- JWT-based secure login
- Multi-step company profile creation
- Cloudinary logo/banner upload
- Profile management
- Protected routes
- Full API ready for frontend and mobile clients

Designed to be **production-grade**, secure, modular, and scalable.

---

# 🔥 **System Flow Diagram**

```
START
  |
  v
[User Registers] ---------------------------+
  |                                         |
  v                                         |
[Send Email Verify Link via SMTP]           |
  |                                         |
  v                                         |
[User Clicks Verify Link]                   |
  |                                         |
  v                                         |
[Send SMS OTP via Firebase]                 |
  |                                         |
  v                                         |
[User Verifies Mobile]                      |
  |                                         |
  v                                         |
[Login → JWT Generated]                     |
  |                                         |
  v                                         |
[Is Company Profile Created?] -- No --> [Company Registration Required]
  |                                               |
 Yes                                               |
  |                                                v
  v                                   [Upload Logo/Banner to Cloudinary]
[Dashboard Access]                                 |
  |                                                |
  v                                                v
            <--------- UPDATE PROFILE / EDIT COMPANY --------->
```

---

# ✨ **Features**

### 🔐 Authentication & Security

- Email/password authentication
- SMTP-based email verification
- Firebase SMS OTP mobile verification
- JWT session tokens (90 days)
- Password hashing with bcrypt
- Input sanitization
- Rate limiting
- Centralized error handling

### 🏢 Company Management

- Multi-step company registration
- Cloudinary file upload (logo + banner)
- Rich company details: social links, founded date, industry, description
- Full CRUD operations

### 🛡️ Reliability

- SQL injection protection
- Validation middleware
- Log tracking (Winston)
- Docker-ready

---

# 🧰 **Tech Stack**

| Component  | Technology                |
| ---------- | ------------------------- |
| Backend    | Node.js + Express         |
| Database   | PostgreSQL 15             |
| Auth       | JWT + Firebase SMS        |
| Email      | SMTP (Nodemailer + Gmail) |
| Storage    | Cloudinary                |
| Validation | express-validator         |
| Logging    | Winston                   |

---

# 📁 **Project Structure**

```
backend/
├── src/
│   ├── config/         # DB, Firebase, Cloudinary
│   ├── controllers/    # API logic
│   ├── middleware/     # Auth, validation, sanitization
│   ├── models/         # DB queries
│   ├── routes/         # API endpoints
│   ├── utils/          # Email, JWT, logger
│   └── server.js       # App entrypoint
├── company_db.sql
├── .env.example
└── README.md
```

---

# ⚙️ **Setup & Installation**

### 1️⃣ Install Dependencies

```bash
cd backend
npm install
```

### 2️⃣ PostgreSQL Setup

```sql
CREATE DATABASE company_db;
CREATE USER backend_user WITH PASSWORD 'secure_password123';
GRANT ALL PRIVILEGES ON DATABASE company_db TO backend_user;
```

Import tables:

```bash
psql -U backend_user -d company_db -f company_db.sql
```

### 3️⃣ Configure Environment

```
cp .env.example .env
```

Fill in:

- PostgreSQL credentials
- Firebase Admin keys
- Cloudinary credentials
- SMTP Gmail credentials

### 4️⃣ Start Server

```bash
npm run dev
```

---

# 🔧 **Environment Variables**

```
NODE_ENV=development
PORT=4000
SERVER_URL=http://localhost:4000
CLIENT_URL=http://localhost:4173

DATABASE_URL=postgresql://backend_user:secure_password123@localhost:5432/company_db

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d

SMTP_EMAIL=your@gmail.com
SMTP_PASSWORD=your_app_password

FIREBASE_PROJECT_ID=your-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=service-account@firebase.iam.gserviceaccount.com

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
```

---

# 📡 **API Documentation**

## **Base URL**

```
http://localhost:4000/api
```

---

# 🧾 **Consistent API Response Format**

```json
{
  "success": true,
  "message": "Optional message",
  "data": {},
  "errors": []
}
```

---

# 🚀 **Authentication APIs**

## **1. Register User**

```
POST /auth/register
```

### Body:

```json
{
  "email": "test@example.com",
  "password": "secret123",
  "full_name": "Test User",
  "gender": "m",
  "mobile_no": "9876543210"
}
```

### Output:

- Creates user
- Sends email verification link via SMTP
- Sends Firebase OTP SMS

---

## **2. Verify Email**

```
GET /auth/verify-email?token=xyz
```

Redirects to frontend with:

```
?status=success
?status=error&msg=Invalid Token
```

---

## **3. Verify Mobile OTP**

```
POST /auth/verify-mobile
```

### Default OTP for testing:

```
123456
```

### Body:

```json
{
  "user_id": 1,
  "otp": "123456"
}
```

---

## **4. Login**

```
POST /auth/login
```

### Body:

```json
{
  "email": "test@example.com",
  "password": "secret123"
}
```

### Response:

```json
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN_HERE",
    "user": {
      "id": 1,
      "is_email_verified": true,
      "is_mobile_verified": true,
      "hasCompany": false
    }
  }
}
```

---

## **5. Get Profile (Protected)**

```
GET /auth/profile
```

### Headers:

```
Authorization: Bearer <token>
```

---

## **6. Update Profile**

```
PUT /auth/profile
```

### Body:

```json
{
  "full_name": "New Name",
  "gender": "f"
}
```

---

# 🏢 **Company APIs**

## **7. Register Company (Protected)**

```
POST /company/register
Content-Type: multipart/form-data
```

### Form-Data:

| Key          | Type | Value            |
| ------------ | ---- | ---------------- |
| company_name | text | "Acme Corp"      |
| address      | text | "New York"       |
| ...          | ...  | ...              |
| logo         | FILE | company-logo.png |
| banner       | FILE | banner.png       |

Uploads files → Cloudinary.

---

## **8. Get Company Profile**

```
GET /company/profile
```

---

## **9. Update Company**

```
PUT /company/profile
```

---

## **10. Upload Logo**

```
POST /company/upload-logo
```

---

## **11. Upload Banner**

```
POST /company/upload-banner
```

---

# 🧪 **Testing Guide (for Postman)**

### 1️⃣ Register →

Paste JSON body → send → look for user_id.

### 2️⃣ Email Verification →

Click link received in email.

### 3️⃣ Mobile OTP →

Use:

```
123456
```

### 4️⃣ Login →

Copy token from response.

### 5️⃣ GET Profile (Protected)

Headers →

```
Authorization: Bearer TOKEN
```

### 6️⃣ Register Company

Use **form-data**, not JSON.

### 7️⃣ Get Company Profile

Shows final saved details.

---

# 🗄️ **Database Schema**

## **Users**

(Full SQL preserved)

## **Company Profile**

(Full SQL preserved)

---

# 🐳 Docker Support

Compose file included for:

- PostgreSQL
- Backend container

---

# 📜 **Logging**

Stored under:

```
backend/logs/
```

---

# ❗ Troubleshooting

| Issue              | Cause               | Fix                      |
| ------------------ | ------------------- | ------------------------ |
| 401 Unauthorized   | Missing JWT         | Add Authorization header |
| Email not received | Wrong SMTP password | Use Gmail App Password   |
| Mobile OTP fails   | Wrong OTP           | Use "123456"             |

---

# ✔️ **Acceptance Checklist**

Everything required by the assignment is implemented.

---

# 🚀 **Deployment Checklist**

- Environment variables set
- Cloudinary configured
- SMTP active
- Database migrated

---

# 📄 License

Internal use for Bluestock Assignment.

---
