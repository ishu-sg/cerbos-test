// API routes and handlers
const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./auth');
const db = require('./database');
const utils = require('./utils');

const app = express();
app.use(bodyParser.json());

// SECURITY ISSUE: No rate limiting
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  
  const result = await auth.login(username, password);
  
  if (result.success) {
    // SECURITY ISSUE: Token exposed in response
    res.json({ token: result.token });
  } else {
    res.status(401).json({ error: result.message });
  }
});

// SECURITY ISSUE: No authentication middleware
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    // SECURITY ISSUE: Sensitive data exposure
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// SECURITY ISSUE: Insufficient authorization checks
app.put('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  const profileData = req.body;
  
  // Missing proper authorization check
  
  try {
    await db.updateUserProfile(userId, profileData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// SECURITY ISSUE: File download vulnerability
app.get('/api/files/:filename', (req, res) => {
  try {
    // Path traversal vulnerability
    const fileContent = utils.getFileContent(req.params.filename);
    res.send(fileContent);
  } catch (error) {
    res.status(404).json({ error: 'File not found' });
  }
});

// BUG: Error handling issue
app.post('/api/data/parse', (req, res) => {
  const { data } = req.body;
  
  // Missing try/catch for JSON parsing
  const parsedData = utils.parseJSONData(data);
  
  res.json({ result: parsedData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 