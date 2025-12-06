const jwt = require('jsonwebtoken');
const { logger } = require('./logger');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '90d';

const jwtUtils = {
  // Generate JWT token
  generateToken: (payload) => {
    try {
      return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
        algorithm: 'HS256'
      });
    } catch (error) {
      logger.error('JWT generation error:', error.message);
      throw new Error('Failed to generate token');
    }
  },

  // Verify JWT token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('JWT verification error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      
      throw new Error('Token verification failed');
    }
  },

  // Decode token without verification
  decodeToken: (token) => {
    try {
      return jwt.decode(token);
    } catch (error) {
      logger.error('JWT decode error:', error.message);
      return null;
    }
  },

  // Extract token from Authorization header
  extractToken: (authHeader) => {
    if (!authHeader) {
      return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }

    return null;
  }
};

module.exports = jwtUtils;