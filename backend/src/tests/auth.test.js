const request = require("supertest");
const app = require("../server");
const { initTestPool, cleanTestDatabase, closeTestPool } = require("./setup");
const userModel = require("../models/userModel");

let testPool;

// Test user data
const testUser = {
  email: "test@example.com",
  password: "TestPassword123!",
  full_name: "Test User",
  gender: "m",
  mobile_no: "+919876543210",
  signup_type: "e",
};

describe("Authentication API Tests", () => {
  beforeAll(async () => {
    // Initialize test database pool
    testPool = initTestPool();

    // Set test environment
    process.env.NODE_ENV = "test";
  });

  beforeEach(async () => {
    // Clean database before each test
    await cleanTestDatabase();
  });

  afterAll(async () => {
    // Close database pool
    await closeTestPool();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("registered successfully");
      expect(response.body.data).toHaveProperty("user_id");
      expect(response.body.data.email).toBe(testUser.email);
    });

    it("should return error for duplicate email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send(testUser);

      // Second registration with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already registered");
    });

    it("should return error for invalid email format", async () => {
      const invalidUser = { ...testUser, email: "invalid-email" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Validation failed");
    });

    it("should return error for weak password", async () => {
      const weakPasswordUser = { ...testUser, password: "weak" };

      const response = await request(app)
        .post("/api/auth/register")
        .send(weakPasswordUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Register a user first
      await request(app).post("/api/auth/register").send(testUser);

      // Mock email verification for testing
      const user = await userModel.findByEmail(testUser.email);
      await userModel.updateVerificationStatus(user.id, {
        is_email_verified: true,
      });
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it("should return error for invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid email or password");
    });

    it("should return error for non-existent email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: testUser.password,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/auth/verify-mobile", () => {
    let userId;

    beforeEach(async () => {
      // Register a user first
      const registerResponse = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      userId = registerResponse.body.data.user_id;
    });

    it("should verify mobile OTP successfully", async () => {
      // Mock OTP verification (in real app, you'd mock Firebase)
      const response = await request(app)
        .post("/api/auth/verify-mobile")
        .send({
          user_id: userId,
          otp: "123456",
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.is_mobile_verified).toBe(true);
    });

    it("should return error for invalid user ID", async () => {
      const response = await request(app)
        .post("/api/auth/verify-mobile")
        .send({
          user_id: 999999,
          otp: "123456",
        })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/auth/profile", () => {
    let authToken;

    beforeEach(async () => {
      // Register and login to get token
      await request(app).post("/api/auth/register").send(testUser);

      // Mock email verification
      const user = await userModel.findByEmail(testUser.email);
      await userModel.updateVerificationStatus(user.id, {
        is_email_verified: true,
      });

      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });

      authToken = loginResponse.body.data.token;
    });

    it("should get user profile with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.full_name).toBe(testUser.full_name);
    });

    it("should return error without token", async () => {
      const response = await request(app).get("/api/auth/profile").expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("token");
    });

    it("should return error with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
