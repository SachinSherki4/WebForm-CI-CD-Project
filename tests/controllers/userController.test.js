/**
 * User Controller Tests
 * Tests for API endpoints and business logics
 */

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('../../server/controllers/userController');
const userRoutes = require('../../server/routes/userRoutes');

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/api/users', userRoutes);
  return app;
};

describe('User Controller - GET /api/users', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  test('should return success response with data', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('count');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test('should return array of users with proper structure', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    response.body.data.forEach((user) => {
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('fullName');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('createdAt');
    });
  });

  test('should return correct user count', async () => {
    const response = await request(app).get('/api/users');

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(response.body.data.length);
  });
});

describe('User Controller - POST /api/users', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  const validUserData = {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '(123) 456-7890',
    address: '123 Test Street',
    city: 'Test City',
    state: 'TS',
    country: 'Test Country',
    zipCode: '12345',
    notes: 'Test notes'
  };

  test('should create user with valid data', async () => {
    const response = await request(app).post('/api/users').send(validUserData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'User added successfully');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('createdAt');
  });

  test('should return user data with all fields', async () => {
    const response = await request(app).post('/api/users').send(validUserData);

    expect(response.status).toBe(201);
    const user = response.body.data;
    expect(user.fullName).toBe(validUserData.fullName);
    expect(user.email).toBe(validUserData.email.toLowerCase());
    expect(user.phone).toBe(validUserData.phone);
    expect(user.address).toBe(validUserData.address);
    expect(user.city).toBe(validUserData.city);
    expect(user.state).toBe(validUserData.state);
    expect(user.country).toBe(validUserData.country);
    expect(user.zipCode).toBe(validUserData.zipCode);
  });

  test('should reject request with missing required fields', async () => {
    const invalidData = { ...validUserData };
    delete invalidData.fullName;

    const response = await request(app).post('/api/users').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
    expect(Array.isArray(response.body.errors)).toBe(true);
  });

  test('should reject request with invalid email', async () => {
    const invalidData = { ...validUserData, email: 'invalid-email' };

    const response = await request(app).post('/api/users').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain('Email format is invalid');
  });

  test('should reject request with invalid phone', async () => {
    const invalidData = { ...validUserData, phone: '123' };

    const response = await request(app).post('/api/users').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors[0]).toContain('Phone');
  });

  test('should reject request with invalid zip code', async () => {
    const invalidData = { ...validUserData, zipCode: '12' };

    const response = await request(app).post('/api/users').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors[0]).toContain('Zip Code');
  });

  test('should trim whitespace from fields', async () => {
    const dataWithWhitespace = {
      ...validUserData,
      fullName: '  John Doe  ',
      email: '  john@example.com  ',
      city: '  New York  '
    };

    const response = await request(app).post('/api/users').send(dataWithWhitespace);

    expect(response.status).toBe(201);
    expect(response.body.data.fullName).toBe('John Doe');
    expect(response.body.data.email).toBe('john@example.com');
    expect(response.body.data.city).toBe('New York');
  });

  test('should convert email to lowercase', async () => {
    const dataWithUppercaseEmail = {
      ...validUserData,
      email: 'TEST@EXAMPLE.COM'
    };

    const response = await request(app).post('/api/users').send(dataWithUppercaseEmail);

    expect(response.status).toBe(201);
    expect(response.body.data.email).toBe('test@example.com');
  });

  test('should accept optional notes field', async () => {
    const dataWithoutNotes = { ...validUserData };
    delete dataWithoutNotes.notes;

    const response = await request(app).post('/api/users').send(dataWithoutNotes);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });

  test('should return validation error for empty required field', async () => {
    const invalidData = { ...validUserData, fullName: '' };

    const response = await request(app).post('/api/users').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.errors).toContain('Full Name is required');
  });

  test('should return validation error for all invalid fields', async () => {
    const invalidData = {
      fullName: '',
      email: 'invalid',
      phone: '123',
      address: '',
      city: 'City',
      state: 'ST',
      country: 'Country',
      zipCode: '12'
    };

    const response = await request(app).post('/api/users').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBeGreaterThan(3);
  });

  test('should handle empty request body', async () => {
    const response = await request(app).post('/api/users').send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  test('should reject multiple invalid fields with specific error messages', async () => {
    const invalidData = {
      ...validUserData,
      email: 'bad-email',
      phone: '12345',
      zipCode: '99'
    };

    const response = await request(app).post('/api/users').send(invalidData);

    expect(response.status).toBe(400);
    expect(response.body.errors.length).toBeGreaterThanOrEqual(3);
  });
});

describe('User Controller - API Response Format', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  test('GET request should have consistent response format', async () => {
    const response = await request(app).get('/api/users');

    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
  });

  test('POST success response should have consistent format', async () => {
    const validData = {
      fullName: 'Format Test',
      email: 'format@example.com',
      phone: '8888888888',
      address: 'Test',
      city: 'Test',
      state: 'TS',
      country: 'Test',
      zipCode: '12345'
    };

    const response = await request(app).post('/api/users').send(validData);

    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('data');
  });

  test('POST error response should have consistent format', async () => {
    const response = await request(app).post('/api/users').send({});

    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('errors');
  });
});

describe('User Controller - Edge Cases', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  test('should handle special characters in text fields', async () => {
    const specialCharData = {
      fullName: "O'Brien-Smith",
      email: 'test+special@example.com',
      phone: '+1 (123) 456-7890',
      address: '123 Main St. Apt #4',
      city: 'Saint Louis',
      state: 'MO',
      country: 'United States',
      zipCode: '63101-1234'
    };

    const response = await request(app).post('/api/users').send(specialCharData);

    expect(response.status).toBe(201);
    expect(response.body.data.fullName).toBe("O'Brien-Smith");
  });

  test('should handle long text in notes field', async () => {
    const longNotes = 'A'.repeat(1000);
    const dataWithLongNotes = {
      fullName: 'Long Notes User',
      email: 'longnotes@example.com',
      phone: '9999999999',
      address: 'Address',
      city: 'City',
      state: 'ST',
      country: 'Country',
      zipCode: '00000',
      notes: longNotes
    };

    const response = await request(app).post('/api/users').send(dataWithLongNotes);

    expect(response.status).toBe(201);
    expect(response.body.data.notes.length).toBe(1000);
  });
});
