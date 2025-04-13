// Example JavaScript code for CI scans
function validateInput(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Input must be a non-empty string');
  }
  
  // Prevent potential injection attacks
  const sanitized = input.replace(/[<>]/g, '');
  return sanitized;
}

module.exports = { validateInput }; 