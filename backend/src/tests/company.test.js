const request = require("supertest");
const app = require("../server");
const { initTestPool, cleanTestDatabase, closeTestPool } = require("./setup");
const userModel = require("../models/userModel");

let testPool;
let authToken;
let userId;

// Test data
const testUser = {
  email: "companytest@example.com",
  password: "TestPassword123!",
  full_name: "Company Test User",
  gender: "m",
  mobile_no: "+919876543211",
  signup_type: "e",
};

const testCompany = {
  company_name: "Test Company Pvt Ltd",
  address: "123 Test Street",
  city: "Test City",
  state: "Test State",
  country: "Test Country",
  postal_code: "123456",
  industry: "Technology",
  website: "https://testcompany.com",
  description: "This is a test company",
};

describe("Company API Tests", () => {
  beforeAll(async () => {
    // Initialize test database pool
    testPool = initTestPool();

    // Set test environment
    process.env.NODE_ENV = "test";
  });

  beforeEach(async () => {
    // Clean database before each test
    await cleanTestDatabase();

    // Register and login to get token
    await request(app).post("/api/auth/register").send(testUser);

    // Get user ID and verify email
    const user = await userModel.findByEmail(testUser.email);
    userId = user.id;
    await userModel.updateVerificationStatus(userId, {
      is_email_verified: true,
      is_mobile_verified: true,
    });

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    // Close database pool
    await closeTestPool();
  });

  describe("POST /api/company/register", () => {
    it("should create company profile successfully", async () => {
      const response = await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testCompany)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.company.company_name).toBe(
        testCompany.company_name
      );
      expect(response.body.data.company.owner_id).toBe(userId);
    });

    it("should return error for duplicate company name", async () => {
      // First company registration
      await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testCompany);

      // Create another user for second company
      const secondUser = {
        ...testUser,
        email: "second@example.com",
        mobile_no: "+919876543212",
      };

      await request(app).post("/api/auth/register").send(secondUser);

      const secondUserRecord = await userModel.findByEmail(secondUser.email);
      await userModel.updateVerificationStatus(secondUserRecord.id, {
        is_email_verified: true,
      });

      const secondLogin = await request(app).post("/api/auth/login").send({
        email: secondUser.email,
        password: secondUser.password,
      });

      const secondToken = secondLogin.body.data.token;

      // Try to register company with same name
      const response = await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${secondToken}`)
        .send(testCompany)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already exists");
    });

    it("should return error without authentication", async () => {
      const response = await request(app)
        .post("/api/company/register")
        .send(testCompany)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/company/profile", () => {
    beforeEach(async () => {
      // Create a company first
      await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testCompany);
    });

    it("should get company profile successfully", async () => {
      const response = await request(app)
        .get("/api/company/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.company.company_name).toBe(
        testCompany.company_name
      );
      expect(response.body.data.company.owner_id).toBe(userId);
    });

    it("should return 404 if company profile not found", async () => {
      // Create a new user without company
      const newUser = {
        ...testUser,
        email: "nocompany@example.com",
        mobile_no: "+919876543213",
      };

      await request(app).post("/api/auth/register").send(newUser);

      const newUserRecord = await userModel.findByEmail(newUser.email);
      await userModel.updateVerificationStatus(newUserRecord.id, {
        is_email_verified: true,
      });

      const newLogin = await request(app).post("/api/auth/login").send({
        email: newUser.email,
        password: newUser.password,
      });

      const newToken = newLogin.body.data.token;

      const response = await request(app)
        .get("/api/company/profile")
        .set("Authorization", `Bearer ${newToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/company/profile", () => {
    beforeEach(async () => {
      // Create a company first
      await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testCompany);
    });

    it("should update company profile successfully", async () => {
      const updates = {
        company_name: "Updated Company Name",
        description: "Updated description",
        city: "Updated City",
      };

      const response = await request(app)
        .put("/api/company/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send(updates)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.company.company_name).toBe(
        updates.company_name
      );
      expect(response.body.data.company.description).toBe(updates.description);
      expect(response.body.data.company.city).toBe(updates.city);
    });

    it("should not allow updating to existing company name", async () => {
      // Create a second company with different name
      const secondUser = {
        ...testUser,
        email: "secondcompany@example.com",
        mobile_no: "+919876543214",
      };

      await request(app).post("/api/auth/register").send(secondUser);

      const secondUserRecord = await userModel.findByEmail(secondUser.email);
      await userModel.updateVerificationStatus(secondUserRecord.id, {
        is_email_verified: true,
      });

      const secondLogin = await request(app).post("/api/auth/login").send({
        email: secondUser.email,
        password: secondUser.password,
      });

      const secondToken = secondLogin.body.data.token;

      const secondCompany = {
        ...testCompany,
        company_name: "Second Company",
        email: "second@example.com",
      };

      await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${secondToken}`)
        .send(secondCompany);

      // Try to update first company to second company's name
      const response = await request(app)
        .put("/api/company/profile")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ company_name: "Second Company" })
        .expect(409);

      expect(response.body.success).toBe(false);
    });
  });

  describe("File upload endpoints", () => {
    it("should upload logo successfully", async () => {
      // Create company first
      await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testCompany);

      // Mock file upload
      const response = await request(app)
        .post("/api/company/upload-logo")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("logo", Buffer.from("fake image content"), "logo.png")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("logo_url");
    });

    it("should upload banner successfully", async () => {
      // Create company first
      await request(app)
        .post("/api/company/register")
        .set("Authorization", `Bearer ${authToken}`)
        .send(testCompany);

      // Mock file upload
      const response = await request(app)
        .post("/api/company/upload-banner")
        .set("Authorization", `Bearer ${authToken}`)
        .attach("banner", Buffer.from("fake banner content"), "banner.png")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("banner_url");
    });
  });
});
