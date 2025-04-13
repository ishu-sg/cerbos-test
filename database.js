// Database operations module
const mysql = require('mysql');
const config = require('./config');

// SECURITY ISSUE: Hardcoded credentials
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'myapp'
};

// SECURITY ISSUE: SQL Injection vulnerability
function getUserByUsername(username) {
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  
  // SQL Injection vulnerability
  const query = `SELECT * FROM users WHERE username = '${username}'`;
  
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      connection.end();
      if (error) reject(error);
      resolve(results[0]);
    });
  });
}

// SECURITY ISSUE: No parameter sanitization
function updateUserProfile(userId, profileData) {
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  
  let queryString = 'UPDATE users SET ';
  const updates = [];
  
  // No sanitization of input
  for (const [key, value] of Object.entries(profileData)) {
    updates.push(`${key} = '${value}'`);
  }
  
  queryString += updates.join(', ');
  queryString += ` WHERE id = ${userId}`;
  
  return new Promise((resolve, reject) => {
    connection.query(queryString, (error, results) => {
      connection.end();
      if (error) reject(error);
      resolve(results);
    });
  });
}

// CODE SMELL: Connection not properly closed in error cases
function getAllUsers() {
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM users', (error, results) => {
      if (error) {
        reject(error);
        return;
      }
      connection.end();
      resolve(results);
    });
  });
}

// SECURITY ISSUE: Unsafe data exposure
function getUserDetails(userId) {
  const connection = mysql.createConnection(dbConfig);
  connection.connect();
  
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM users WHERE id = ${userId}`, (error, results) => {
      connection.end();
      if (error) reject(error);
      // Leaking sensitive data
      resolve(results[0]);
    });
  });
}

module.exports = {
  getUserByUsername,
  updateUserProfile,
  getAllUsers,
  getUserDetails
}; 