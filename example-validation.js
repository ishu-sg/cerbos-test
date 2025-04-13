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

module.exports = { validateInput, validateEmail, sanitizeHtml }; 