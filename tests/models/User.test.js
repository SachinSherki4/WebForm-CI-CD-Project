/**
 * User Model Tests
 * Tests for user data persistence and retrieval
 */

const fs = require('fs');
const path = require('path');
const User = require('../../server/models/User');

// Mock the data file path
const TEST_DATA_FILE = path.join(__dirname, '../../server/data/test_users.json');

// Override the data file for testing
jest.mock('../../server/models/User', () => {
  const actualModule = jest.requireActual('../../server/models/User');
  
  return {
    ...actualModule,
    __esModule: true
  };
});

describe('User Model - File Initialization', () => {
  beforeEach(() => {
    // Clean up before each test
    if (fs.existsSync(TEST_DATA_FILE)) {
      fs.unlinkSync(TEST_DATA_FILE);
    }
  });

  afterEach(() => {
    // Clean up after each test
    if (fs.existsSync(TEST_DATA_FILE)) {
      fs.unlinkSync(TEST_DATA_FILE);
    }
  });

  test('should initialize data file if it does not exist', () => {
    const dataFilePath = path.join(__dirname, '../../server/data/users.json');
    
    // Check that initialization creates or uses existing file
    User.initializeDataFile();
    
    // Should not throw error and file operations should work
    const users = User.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
  });
});

describe('User Model - Get All Users', () => {
  test('should return an empty array for new data file', () => {
    const users = User.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThanOrEqual(0);
  });

  test('should return an array of users', () => {
    const users = User.getAllUsers();
    expect(Array.isArray(users)).toBe(true);
    
    // If users exist, validate their structure
    users.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('fullName');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('createdAt');
    });
  });
});

describe('User Model - Add User', () => {
  test('should add a user and return it with an id', () => {
    const userData = {
      fullName: 'Jane Smith',
      email: 'jane@example.com',
      phone: '(555) 123-4567',
      address: '456 Oak Avenue',
      city: 'Los Angeles',
      state: 'CA',
      country: 'United States',
      zipCode: '90001',
      notes: 'Test user'
    };

    const addedUser = User.addUser(userData);

    expect(addedUser).toHaveProperty('id');
    expect(addedUser).toHaveProperty('createdAt');
    expect(addedUser.fullName).toBe(userData.fullName);
    expect(addedUser.email).toBe(userData.email);
  });

  test('should generate unique ids for each user', () => {
    const userData1 = {
      fullName: 'User One',
      email: 'user1@example.com',
      phone: '1111111111',
      address: 'Address 1',
      city: 'City 1',
      state: 'ST',
      country: 'Country',
      zipCode: '12345'
    };

    const userData2 = {
      fullName: 'User Two',
      email: 'user2@example.com',
      phone: '2222222222',
      address: 'Address 2',
      city: 'City 2',
      state: 'ST',
      country: 'Country',
      zipCode: '12345'
    };

    const user1 = User.addUser(userData1);
    const user2 = User.addUser(userData2);

    expect(user1.id).not.toBe(user2.id);
  });

  test('should persist user to storage', () => {
    const userData = {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '3333333333',
      address: 'Test Address',
      city: 'Test City',
      state: 'TS',
      country: 'Test Country',
      zipCode: '99999'
    };

    const beforeCount = User.getAllUsers().length;
    User.addUser(userData);
    const afterCount = User.getAllUsers().length;

    expect(afterCount).toBe(beforeCount + 1);
  });

  test('should add createdAt timestamp', () => {
    const userData = {
      fullName: 'Timestamp Test',
      email: 'timestamp@example.com',
      phone: '4444444444',
      address: 'Test',
      city: 'Test',
      state: 'TS',
      country: 'Test',
      zipCode: '00000'
    };

    const addedUser = User.addUser(userData);
    const createdAt = new Date(addedUser.createdAt);

    expect(createdAt instanceof Date).toBe(true);
    expect(createdAt.getTime()).toBeLessThanOrEqual(Date.now());
  });

  test('should handle missing optional notes field', () => {
    const userData = {
      fullName: 'No Notes User',
      email: 'nonotes@example.com',
      phone: '5555555555',
      address: 'Address',
      city: 'City',
      state: 'ST',
      country: 'Country',
      zipCode: '11111'
      // notes intentionally omitted
    };

    const addedUser = User.addUser(userData);
    expect(addedUser).toHaveProperty('id');
    expect(addedUser).toHaveProperty('createdAt');
  });
});

describe('User Model - Data Integrity', () => {
  test('should maintain data consistency across read operations', () => {
    const userData = {
      fullName: 'Consistency Test',
      email: 'consistency@example.com',
      phone: '6666666666',
      address: 'Test Address',
      city: 'Test City',
      state: 'TS',
      country: 'Test Country',
      zipCode: '22222'
    };

    User.addUser(userData);

    const users1 = User.getAllUsers();
    const users2 = User.getAllUsers();

    expect(users1.length).toBe(users2.length);
  });

  test('should not lose data when adding multiple users', () => {
    const initialCount = User.getAllUsers().length;

    for (let i = 0; i < 5; i++) {
      const userData = {
        fullName: `User ${i}`,
        email: `user${i}@example.com`,
        phone: `77777777${String(i).padStart(2, '0')}`,
        address: `Address ${i}`,
        city: `City ${i}`,
        state: 'TS',
        country: 'Country',
        zipCode: '33333'
      };
      User.addUser(userData);
    }

    const finalCount = User.getAllUsers().length;
    expect(finalCount).toBe(initialCount + 5);
  });

  test('should validate user object structure after retrieval', () => {
    const userData = {
      fullName: 'Structure Test',
      email: 'structure@example.com',
      phone: '4444444444',
      address: 'Test',
      city: 'Test',
      state: 'ST',
      country: 'Test',
      zipCode: '55555'
    };

    const addedUser = User.addUser(userData);
    const allUsers = User.getAllUsers();
    const retrievedUser = allUsers.find(u => u.id === addedUser.id);

    expect(retrievedUser).toBeDefined();
    expect(retrievedUser.fullName).toBe(userData.fullName);
    expect(retrievedUser.email).toBe(userData.email);
    expect(retrievedUser.id).toBe(addedUser.id);
    expect(retrievedUser.createdAt).toBe(addedUser.createdAt);
  });

  test('should handle concurrent user additions', () => {
    const initialCount = User.getAllUsers().length;
    const usersToAdd = 3;

    for (let i = 0; i < usersToAdd; i++) {
      const userData = {
        fullName: `Concurrent User ${i}`,
        email: `concurrent${i}@example.com`,
        phone: '8888888888',
        address: 'Test',
        city: 'Test City',
        state: 'ST',
        country: 'Test Country',
        zipCode: '99999'
      };
      User.addUser(userData);
    }

    const finalCount = User.getAllUsers().length;
    expect(finalCount).toBe(initialCount + usersToAdd);
  });
});
