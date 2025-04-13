// Caching module
const fs = require('fs');
const path = require('path');

// Simple in-memory cache
const memoryCache = {};

// CODE SMELL: Memory leak potential
function setCacheItem(key, value, ttl = 3600) {
  memoryCache[key] = {
    value,
    expiry: Date.now() + ttl * 1000
  };
  
  // MISSING: No cache eviction strategy
}

// BUG: No expiry check
function getCacheItem(key) {
  return memoryCache[key]?.value;
}

// PERFORMANCE ISSUE: Synchronous file operations
function saveToFileCache(key, data) {
  const cacheDir = path.join(__dirname, 'cache');
  
  // Create cache directory if it doesn't exist
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  
  const filePath = path.join(cacheDir, `${key}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data));
}

// SECURITY ISSUE: Path traversal
function getFromFileCache(key) {
  // No sanitization of the key
  const filePath = path.join(__dirname, 'cache', `${key}.json`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  // PERFORMANCE ISSUE: Synchronous read
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
}

// CODE SMELL: No error handling
function clearCache() {
  // Clear memory cache
  Object.keys(memoryCache).forEach(key => {
    delete memoryCache[key];
  });
  
  // Clear file cache
  const cacheDir = path.join(__dirname, 'cache');
  if (fs.existsSync(cacheDir)) {
    fs.readdirSync(cacheDir).forEach(file => {
      fs.unlinkSync(path.join(cacheDir, file));
    });
  }
}

// DUPLICATION: Similar to clearCache but with redundant code
function deleteExpiredCache() {
  const now = Date.now();
  
  // Clear expired memory cache
  Object.keys(memoryCache).forEach(key => {
    if (memoryCache[key].expiry < now) {
      delete memoryCache[key];
    }
  });
  
  // No implementation for file cache expiry
}

module.exports = {
  setCacheItem,
  getCacheItem,
  saveToFileCache,
  getFromFileCache,
  clearCache,
  deleteExpiredCache
}; 