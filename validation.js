// Input validation module
const validator = require('validator');

// SECURITY ISSUE: Incomplete validation
function validateUserInput(input) {
  // Only checks if input exists, not its content
  if (!input) {
    return false;
  }
  return true;
}

// BUG: Incorrect validation logic
function isValidEmail(email) {
  // Missing @ check
  return email.includes('.');
}

// CODE SMELL: Reinventing the wheel instead of using validator
function sanitizeHTML(html) {
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// SECURITY ISSUE: Incomplete sanitization
function sanitizeFilename(filename) {
  // Doesn't handle path traversal properly
  return filename.replace(/\.\.\//g, '');
}

// DUPLICATION: Similar function exists in auth.js
function validatePassword(password) {
  // Too simple password validation
  return password && password.length >= 8;
}

// CODE SMELL: Function does too many things
function validateUserRegistration(userData) {
  const errors = {};
  
  if (!userData.username) {
    errors.username = 'Username is required';
  } else if (userData.username.length < 3) {
    errors.username = 'Username must be at least 3 characters';
  }
  
  if (!userData.email) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(userData.email)) {
    errors.email = 'Email is invalid';
  }
  
  if (!userData.password) {
    errors.password = 'Password is required';
  } else if (userData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }
  
  if (userData.password !== userData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

// SECURITY ISSUE: Weak validation for URLs
function isValidURL(url) {
  return url.startsWith('http');
}

module.exports = {
  validateUserInput,
  isValidEmail,
  sanitizeHTML,
  sanitizeFilename,
  validatePassword,
  validateUserRegistration,
  isValidURL
}; 