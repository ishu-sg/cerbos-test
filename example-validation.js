// Example JavaScript code for CI scans
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }
  
  // Prevent potential injection attacks
  const sanitized = input.replace(/[<>]/g, '');
  return sanitized;
}

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    throw new Error('Email must be a string');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }
  
  return email.toLowerCase();
}

function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // Simple HTML sanitization
  return html
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// User authentication system with potential security issues
function authenticateUser(username, password) {
  // SECURITY ISSUE: Hardcoded credentials
  const adminUser = "admin";
  const adminPass = "password123";
  
  // SECURITY ISSUE: No password hashing
  if (username === adminUser && password === adminPass) {
    return { success: true, token: "static-token-123456" };
  }
  
  // SECURITY ISSUE: SQL injection vulnerability
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  // Mock database function
  return executeQuery(query);
}

// Mock database function with potential issues
function executeQuery(query) {
  // Simulating database response
  console.log("Executing query: " + query);
  
  // ISSUE: Information leakage in error messages
  if (query.includes("DROP") || query.includes("DELETE")) {
    throw new Error("Query failed: " + query);
  }
  
  // ISSUE: No input validation
  return { success: true, data: { userId: 123, role: "user" } };
}

// Function with performance issues
function inefficientSort(array) {
  // ISSUE: O(n²) complexity with bubble sort
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - 1; j++) {
      if (array[j] > array[j + 1]) {
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
      }
    }
  }
  return array;
}

// Function with memory leak potential
function createMemoryLeak() {
  const leakyArray = [];
  
  // ISSUE: This would continuously grow in a real application
  setInterval(() => {
    const data = new Array(10000).fill('leak data');
    leakyArray.push(data);
  }, 1000);
  
  return "Memory leak started";
}

// Insecure file operations
function readUserFile(filename) {
  // SECURITY ISSUE: Path traversal vulnerability
  const fs = require('fs');
  return fs.readFileSync(`./user_files/${filename}`, 'utf8');
}

// Insecure eval usage
function dynamicCodeExecution(userInput) {
  // SECURITY ISSUE: Remote code execution vulnerability
  return eval(userInput);
}

// Insecure cookie handling
function setUserCookie(res, userData) {
  // SECURITY ISSUE: Sensitive data in cookies, no secure flag
  res.cookie('user_data', JSON.stringify(userData), { 
    httpOnly: false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  });
}

// Regex with potential DoS vulnerability
function validateComplexInput(input) {
  // SECURITY ISSUE: Regex Denial of Service (ReDoS)
  const complexRegex = /^(a+)+$/;
  return complexRegex.test(input);
}

// Insecure random number generation
function generateToken() {
  // SECURITY ISSUE: Predictable random values
  return Math.random().toString(36).substring(2, 15);
}

// Missing input validation
function processUserCommand(command) {
  // SECURITY ISSUE: Command injection vulnerability
  const { exec } = require('child_process');
  exec(command, (error, stdout, stderr) => {
    console.log(stdout);
  });
}

// Prototype pollution vulnerability
function mergeObjects(target, source) {
  // SECURITY ISSUE: Prototype pollution
  for (const key in source) {
    if (typeof source[key] === 'object' && source[key] !== null) {
      if (!target[key]) target[key] = {};
      mergeObjects(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// Insecure deserialization
function deserializeUserData(data) {
  // SECURITY ISSUE: Insecure deserialization
  return JSON.parse(data);
}

module.exports = { 
  validateInput, 
  validateEmail, 
  sanitizeHtml,
  authenticateUser,
  executeQuery,
  inefficientSort,
  createMemoryLeak,
  readUserFile,
  dynamicCodeExecution,
  setUserCookie,
  validateComplexInput,
  generateToken,
  processUserCommand,
  mergeObjects,
  deserializeUserData
}; 