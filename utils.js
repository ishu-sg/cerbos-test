// Utility functions for the application
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// SECURITY ISSUE: Weak encryption
function encryptData(data, key) {
  const cipher = crypto.createCipher('aes-256-cbc', key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// SECURITY ISSUE: Weak decryption
function decryptData(encryptedData, key) {
  const decipher = crypto.createDecipher('aes-256-cbc', key);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// PERFORMANCE ISSUE: Inefficient file reading
function readLargeFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

// SECURITY ISSUE: Path traversal
function getFileContent(fileName) {
  const filePath = path.join('./data', fileName);
  return fs.readFileSync(filePath, 'utf8');
}

// BUG: Missing error handling
function parseJSONData(data) {
  return JSON.parse(data);
}

// CODE SMELL: Magic numbers
function calculateDiscount(price) {
  if (price > 1000) {
    return price * 0.15;
  } else if (price > 500) {
    return price * 0.1;
  } else {
    return price * 0.05;
  }
}

// DUPLICATE LOGIC: Similar function exists elsewhere
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

module.exports = {
  encryptData,
  decryptData,
  readLargeFile,
  getFileContent,
  parseJSONData,
  calculateDiscount,
  formatDate
}; 