const { Pool } = require("pg");
const { logger } = require("../utils/logger");

// Test database configuration
const testConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.TEST_DB_NAME || "company_db_test",
  user: process.env.DB_USER || "backend_user",
  password: process.env.DB_PASSWORD || "secure_password123",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

let testPool;

// Create test database if it doesn't exist
const createTestDatabase = async () => {
  try {
    const adminPool = new Pool({
      host: testConfig.host,
      port: testConfig.port,
      database: "postgres",
      user: testConfig.user,
      password: testConfig.password,
    });

    // Check if test database exists
    const dbCheck = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [testConfig.database]
    );

    if (dbCheck.rows.length === 0) {
      // Create test database
      await adminPool.query(`CREATE DATABASE ${testConfig.database}`);
      logger.info(`Test database ${testConfig.database} created`);
    }

    await adminPool.end();
  } catch (error) {
    logger.error("Error creating test database:", error.message);
    throw error;
  }
};

// Initialize test pool
const initTestPool = () => {
  if (!testPool) {
    testPool = new Pool(testConfig);
  }
  return testPool;
};

// Clean test database (truncate all tables)
const cleanTestDatabase = async () => {
  try {
    const pool = initTestPool();
    const client = await pool.connect();

    // Disable triggers temporarily
    await client.query("SET session_replication_role = replica;");

    // Get all tables
    const tables = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);

    // Truncate all tables
    for (const table of tables.rows) {
      await client.query(`TRUNCATE TABLE ${table.tablename} CASCADE;`);
    }

    // Re-enable triggers
    await client.query("SET session_replication_role = DEFAULT;");

    client.release();
  } catch (error) {
    logger.error("Error cleaning test database:", error.message);
    throw error;
  }
};

// Close test pool
const closeTestPool = async () => {
  if (testPool) {
    await testPool.end();
    testPool = null;
  }
};

module.exports = {
  createTestDatabase,
  initTestPool,
  cleanTestDatabase,
  closeTestPool,
  testConfig,
};
