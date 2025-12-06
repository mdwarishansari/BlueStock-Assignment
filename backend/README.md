# **Company Registration & Verification Module - Backend API**

## **📌 Project Overview**

A production-ready, scalable backend API for company registration and verification system. This module supports user authentication (email/password + SMS OTP), company profile management, and secure image uploads with JWT-based session management.

**🔗 Frontend Integration**: This backend is designed to work seamlessly with the React frontend as per the Figma design specifications.

---

## **✨ Features**

### **🔐 Authentication & Security**

- Email/Password Registration (Firebase Auth)
- Mobile OTP Verification (Firebase SMS)
- Email Verification (Firebase links)
- Secure JWT Authentication (90-day validity)
- Password Hashing (bcrypt)
- Input Validation & Sanitization
- Rate Limiting
- CORS Protection
- Secure HTTP Headers (helmet)

### **🏢 Company Management**

- Multi-step Company Registration
- CRUD operations for company profiles
- Cloudinary Image Uploads (logo + banner)
- Social links stored as JSON
- Industry classification system

### **🛡️ Security & Reliability**

- SQL Injection prevention (parameterized queries)
- XSS protection
- File upload validation
- Centralized error handling
- Structured logging (Winston)
- DB connection pooling

### **🧪 Testing & Quality**

- Unit tests
- Integration tests
- Mock Firebase & Cloudinary services
- Postman collection

---

## **🛠 Technology Stack**

| Component    | Technology           |
| ------------ | -------------------- |
| Runtime      | Node.js 20.x         |
| Framework    | Express.js           |
| Database     | PostgreSQL 15        |
| Auth         | Firebase Admin       |
| Sessions     | JWT                  |
| File Storage | Cloudinary           |
| Validation   | express-validator    |
| Security     | helmet, cors, bcrypt |
| Logging      | Winston              |
| Testing      | Jest + Supertest     |

---

## **📁 Project Structure**

```

backend/
├── logs/
├── migrations/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── utils/
│   └── server.js
├── .env.example
├── README.md
├── company_db.sql
├── package.json
└── package-lock.json

```

---

## **⚙️ Setup & Installation**

### **Prerequisites**

- Node.js 20+
- PostgreSQL 15
- Firebase project
- Cloudinary account
- Git

### **1. Clone Project**

```bash
mkdir backend
cd backend
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Database Setup**

```bash
sudo -u postgres psql

CREATE DATABASE company_db;
CREATE USER backend_user WITH PASSWORD 'secure_password123';
GRANT ALL PRIVILEGES ON DATABASE company_db TO backend_user;

\q
psql -U backend_user -d company_db -f company_db.sql
```

### **4. Configure Environment**

```bash
cp .env.example .env
nano .env
```

### **5. Start Server**

```bash
npm run dev
# or
npm start
```

---

## **🔧 Environment Variables**

```env
NODE_ENV=development
PORT=4000
SERVER_URL=http://localhost:4000
CLIENT_URL=http://localhost:3000

DATABASE_URL=postgresql://backend_user:secure_password123@localhost:5432/company_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=company_db
DB_USER=backend_user
DB_PASSWORD=secure_password123

JWT_SECRET=your_secret
JWT_EXPIRES_IN=90d

FIREBASE_PROJECT_ID=your-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com

CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=5000000
MAX_FIELD_SIZE=20000000
```

---

## **📡 API Documentation**

### **Base URL:**

```
http://localhost:4000/api
```

### **Response Format**

```json
{
  "success": true,
  "message": "",
  "data": {},
  "errors": []
}
```

---

## **📋 API Endpoints**

### **1. Health Check**

```
GET /health
```

### **2. Register**

```
POST /api/auth/register
```

Request:

```json
{
  "email": "test@example.com",
  "password": "Password123!",
  "full_name": "John Doe",
  "gender": "m",
  "mobile_no": "+919876543210",
  "signup_type": "e"
}
```

### **3. Login**

```
POST /api/auth/login
```

### **4. Verify Mobile OTP**

```
POST /api/auth/verify-mobile
```

### **5. Verify Email**

```
GET /api/auth/verify-email?token=<token>
```

### **6. Get Profile**

```
GET /api/auth/profile
Authorization: Bearer <jwt>
```

### **7. Update Profile**

```
PUT /api/auth/profile
Authorization: Bearer <jwt>
```

### **8. Create Company Profile**

```
POST /api/company/register
Content-Type: multipart/form-data
Authorization: Bearer <jwt>
```

### **9. Get Company Profile**

```
GET /api/company/profile
Authorization: Bearer <jwt>
```

### **10. Update Company Profile**

```
PUT /api/company/profile
Authorization: Bearer <jwt>
```

### **11. Upload Logo**

```
POST /api/company/upload-logo
```

### **12. Upload Banner**

```
POST /api/company/upload-banner
```

### **13. Delete Logo**

```
DELETE /api/company/logo
```

### **14. Delete Banner**

```
DELETE /api/company/banner
```

### **15. Resend OTP**

```
POST /api/auth/resend-otp
```

### **16. Logout**

```
POST /api/auth/logout
```

---

## **🧪 Testing**

### **Postman**

Import included collection.

### **cURL Example**

```bash
curl http://localhost:4000/health
```

### **Run Jest Tests**

```bash
npm test
```

---

## **🔍 Database Schema**

### **Users Table**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    signup_type CHAR(1) DEFAULT 'e',
    gender CHAR(1) CHECK (gender IN ('m', 'f', 'o')),
    mobile_no VARCHAR(20) UNIQUE NOT NULL,
    is_mobile_verified BOOLEAN DEFAULT false,
    is_email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **Company Profile Table**

```sql
CREATE TABLE company_profile (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) NOT NULL,
    company_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    website TEXT,
    logo_url TEXT,
    banner_url TEXT,
    industry TEXT NOT NULL,
    founded_date DATE,
    description TEXT,
    social_links JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## **🐳 Docker Setup**

```yaml
version: "3.8"
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: company_db
      POSTGRES_USER: backend_user
      POSTGRES_PASSWORD: secure_password123
    ports:
      - "5432:5432"

  backend:
    build: .
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://backend_user:secure_password123@postgres:5432/company_db
```

Run:

```bash
docker-compose up -d
```

---

## **📊 Logging**

```
logs/error.log
logs/combined.log
```

---

## **🚨 Troubleshooting**

- Port conflict → kill process
- DB errors → restart PostgreSQL
- Firebase errors → check private key formatting
- 413 errors → file too large

---

## **📈 Status Codes**

200, 201, 400, 401, 403, 404, 409, 413, 422, 429, 500

---

## **🎯 Acceptance Checklist**

- All endpoints working
- JWT auth working
- Firebase auth integrated
- Company CRUD complete
- Image uploads functional
- Validation + security complete

---

## **📄 License**

Confidential — Bluestock Fintech (per NDA).

---

## **🚀 Next Steps**

- Build frontend (React)
- Integrate APIs
- Prepare demo

```

---
```
