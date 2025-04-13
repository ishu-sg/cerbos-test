// Authentication module
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('./database');

// SECURITY ISSUE: Weak secret key
const JWT_SECRET = 'my-secret-key';

// SECURITY ISSUE: Weak password hashing
function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

// SECURITY ISSUE: No password complexity check
function validatePassword(password) {
  return password.length >= 6;
}

// SECURITY ISSUE: Insecure token generation
function generateAuthToken(user) {
  // No expiration time set
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
}

// BUG: No verification of password
async function login(username, password) {
  try {
    const user = await db.getUserByUsername(username);
    
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    
    // MISSING: No password check!
    
    const token = generateAuthToken(user);
    return { success: true, token };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Internal server error' };
  }
}

// SECURITY ISSUE: JWT not verified properly
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// CODE SMELL: Redundant code
function checkUserPermission(user, resource) {
  if (user.role === 'admin') {
    return true;
  }
  
  if (user.role === 'manager' && resource.type !== 'system') {
    return true;
  }
  
  if (user.role === 'user' && resource.type === 'public') {
    return true;
  }
  
  return false;
}

module.exports = {
  hashPassword,
  validatePassword,
  generateAuthToken,
  login,
  verifyToken,
  checkUserPermission
}; 