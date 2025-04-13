// Configuration module
const fs = require('fs');
const path = require('path');

// SECURITY ISSUE: Hardcoded credentials
const defaultConfig = {
  database: {
    host: 'localhost',
    user: 'admin',
    password: 'admin123',
    database: 'myapp',
    port: 3306
  },
  server: {
    port: 3000,
    host: '0.0.0.0', // SECURITY: Binds to all interfaces
    session: {
      secret: 'keyboard cat', // SECURITY: Weak secret
      maxAge: 86400000
    }
  },
  email: {
    service: 'smtp',
    host: 'smtp.example.com',
    auth: {
      user: 'system@example.com',
      pass: 'emailpassword123' // SECURITY: Hardcoded password
    }
  },
  logging: {
    level: 'info',
    file: './logs/app.log'
  }
};

// BUG: No error handling
function loadConfig(configPath) {
  const configFile = path.resolve(configPath);
  const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
  return { ...defaultConfig, ...config };
}

// SECURITY ISSUE: Doesn't sanitize environment variables
function getConfigFromEnv() {
  const config = { ...defaultConfig };
  
  if (process.env.DB_HOST) config.database.host = process.env.DB_HOST;
  if (process.env.DB_USER) config.database.user = process.env.DB_USER;
  if (process.env.DB_PASS) config.database.password = process.env.DB_PASS;
  if (process.env.DB_NAME) config.database.database = process.env.DB_NAME;
  if (process.env.DB_PORT) config.database.port = parseInt(process.env.DB_PORT);
  
  if (process.env.SERVER_PORT) config.server.port = parseInt(process.env.SERVER_PORT);
  if (process.env.SESSION_SECRET) config.server.session.secret = process.env.SESSION_SECRET;
  
  return config;
}

// CODE SMELL: Not using environment-specific configs
function getConfig() {
  return defaultConfig;
}

// SECURITY ISSUE: Writes all config including secrets to disk
function saveConfig(config, filePath) {
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
}

module.exports = {
  defaultConfig,
  loadConfig,
  getConfigFromEnv,
  getConfig,
  saveConfig
}; 