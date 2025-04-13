// Logging module
const fs = require('fs');
const path = require('path');

// SECURITY ISSUE: Sensitive data in logs
function logActivity(user, action, data) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    user,
    action,
    data, // May contain sensitive information
    ip: user.ip
  };
  
  // PERFORMANCE ISSUE: Synchronous file write
  fs.appendFileSync(
    path.join(__dirname, 'logs', 'activity.log'),
    JSON.stringify(logEntry) + '\n'
  );
}

// SECURITY ISSUE: Log injection
function logError(errorMsg, metadata) {
  const timestamp = new Date().toISOString();
  // Log injection vulnerability - errorMsg not sanitized
  const logLine = `${timestamp} ERROR: ${errorMsg} ${JSON.stringify(metadata)}`;
  
  fs.appendFileSync(
    path.join(__dirname, 'logs', 'error.log'),
    logLine + '\n'
  );
}

// CODE SMELL: Duplicated file path logic
function logWarning(warningMsg, metadata) {
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} WARNING: ${warningMsg} ${JSON.stringify(metadata)}`;
  
  fs.appendFileSync(
    path.join(__dirname, 'logs', 'error.log'),
    logLine + '\n'
  );
}

// PERFORMANCE ISSUE: Creates a new buffer for each log
function logDebug(debugMsg, metadata) {
  if (process.env.DEBUG !== 'true') return;
  
  const timestamp = new Date().toISOString();
  const logLine = Buffer.from(`${timestamp} DEBUG: ${debugMsg} ${JSON.stringify(metadata)}\n`);
  
  fs.appendFileSync(
    path.join(__dirname, 'logs', 'debug.log'),
    logLine
  );
}

// BUG: Doesn't create log directory if it doesn't exist
function clearLogs() {
  const logsDir = path.join(__dirname, 'logs');
  
  fs.readdirSync(logsDir).forEach(file => {
    fs.unlinkSync(path.join(logsDir, file));
  });
}

module.exports = {
  logActivity,
  logError,
  logWarning,
  logDebug,
  clearLogs
}; 