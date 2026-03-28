const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/users.json');

/**
 * Initialize users.json if it doesn't exist
 */
function initializeDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

/**
 * Get all users
 */
function getAllUsers() {
  try {
    initializeDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

/**
 * Add a new user
 */
function addUser(userData) {
  try {
    initializeDataFile();
    const users = getAllUsers();
    
    // Create user object with unique ID and timestamp
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    
    return newUser;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
}

module.exports = {
  getAllUsers,
  addUser,
  initializeDataFile
};
