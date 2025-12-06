const { Pool } = require("pg");
const { logger } = require("../utils/logger");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "company_db",
  user: process.env.DB_USER || "backend_user",
  password: process.env.DB_PASSWORD || "",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
const connectDB = async () => {
  try {
    const client = await pool.connect();
    logger.info("✅ PostgreSQL connected successfully");

    const result = await client.query("SELECT NOW()");
    logger.info(`📊 Database time: ${result.rows[0].now}`);

    client.release();
    return pool;
  } catch (error) {
    logger.error("❌ PostgreSQL connection error:", error.message);
    logger.error(error);
    process.exit(1);
  }
};

const query = (text, params) => pool.query(text, params);

module.exports = { connectDB, query, pool };
