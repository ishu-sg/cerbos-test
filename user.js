// User management module
const db = require('./database');
const auth = require('./auth');
const utils = require('./utils');

// CODE SMELL: Large function, too many responsibilities
async function registerUser(userData) {
  // Validate user data
  if (!userData.username || !userData.password || !userData.email) {
    throw new Error('Missing required fields');
  }
  
  // SECURITY ISSUE: No email validation
  
  // Check if username exists
  const existingUser = await db.getUserByUsername(userData.username);
  if (existingUser) {
    throw new Error('Username already exists');
  }
  
  // SECURITY ISSUE: Weak password validation
  if (!auth.validatePassword(userData.password)) {
    throw new Error('Password too weak');
  }
  
  // Hash password
  const hashedPassword = auth.hashPassword(userData.password);
  
  // Prepare user object
  const newUser = {
    username: userData.username,
    password: hashedPassword,
    email: userData.email,
    role: 'user',
    createdAt: new Date(),
    // SECURITY ISSUE: No filtering of user-provided data
    ...userData
  };
  
  // Save to database
  // CODE SMELL: Missing proper abstraction
  const connection = db.getConnection();
  
  return new Promise((resolve, reject) => {
    connection.query('INSERT INTO users SET ?', newUser, (error, results) => {
      connection.end();
      if (error) reject(error);
      resolve({ id: results.insertId, ...newUser });
    });
  });
}

// DUPLICATION: Similar to function in auth.js
function checkPermission(user, resource) {
  if (user.role === 'admin') {
    return true;
  }
  
  if (user.role === 'manager' && resource.owner !== 'system') {
    return true;
  }
  
  if (user.id === resource.ownerId) {
    return true;
  }
  
  return false;
}

// SECURITY ISSUE: Password reset without verification
async function resetPassword(username, newPassword) {
  // MISSING: Email verification or token check
  
  // Update password directly
  const hashedPassword = auth.hashPassword(newPassword);
  
  const connection = db.getConnection();
  
  return new Promise((resolve, reject) => {
    const query = `UPDATE users SET password = '${hashedPassword}' WHERE username = '${username}'`;
    connection.query(query, (error, results) => {
      connection.end();
      if (error) reject(error);
      resolve({ success: true });
    });
  });
}

module.exports = {
  registerUser,
  checkPermission,
  resetPassword
}; 