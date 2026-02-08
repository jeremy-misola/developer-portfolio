// Admin utilities and middleware

import crypto from 'crypto';

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'your-secret-key-here';

// Generate a secure session token
export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Hash password for comparison
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password + SESSION_SECRET).digest('hex');
}

// Validate admin credentials
export function validateAdminCredentials(username, password) {
  const hashedPassword = hashPassword(password);
  const expectedHash = hashPassword(ADMIN_PASSWORD);
  
  return username === ADMIN_USERNAME && hashedPassword === expectedHash;
}

// In-memory session store (for development/demo purposes)
const activeSessions = new Set();

// Check if session is valid
export function isValidSession(sessionToken) {
  // Check if session exists in our active sessions store
  return typeof sessionToken === 'string' && sessionToken.length === 64 && activeSessions.has(sessionToken);
}

// Add session to active sessions
export function addActiveSession(sessionToken) {
  activeSessions.add(sessionToken);
}

// Remove session from active sessions
export function removeActiveSession(sessionToken) {
  activeSessions.delete(sessionToken);
}

// Clear all sessions (for logout)
export function clearAllSessions() {
  activeSessions.clear();
}

// Middleware to protect admin routes
export function requireAuth(req, res, next) {
  const sessionToken = req.cookies?.admin_session;
  
  if (!sessionToken || !isValidSession(sessionToken)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

// Data file paths
export const DATA_PATHS = {
  testimonials: './data/testimonials.json',
  projects: './data/projects.json',
  experience: './data/experience.json'
};

// Read data from JSON file
export async function readData(filePath) {
  try {
    const fs = await import('fs/promises');
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Write data to JSON file
export async function writeData(filePath, data) {
  try {
    const fs = await import('fs/promises');
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
}