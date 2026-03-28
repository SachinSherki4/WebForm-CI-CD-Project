/**
 * Validation Model Tests
 * Tests for validation functions and rules
 */

const {
  validateUserData,
  isValidEmail,
  isValidPhone,
  isValidZipCode
} = require('../../server/models/validation');

describe('Validation - Email Validation', () => {
  test('should accept valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('john.doe@company.co.uk')).toBe(true);
    expect(isValidEmail('test+tag@domain.org')).toBe(true);
  });

  test('should reject invalid email addresses', () => {
    expect(isValidEmail('invalid.email')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('user @example.com')).toBe(false);
  });
});

describe('Validation - Phone Number Validation', () => {
  test('should accept valid phone numbers', () => {
    expect(isValidPhone('1234567890')).toBe(true);
    expect(isValidPhone('(123) 456-7890')).toBe(true);
    expect(isValidPhone('+1-234-567-8900')).toBe(true);
    expect(isValidPhone('123-456-7890')).toBe(true);
    expect(isValidPhone('123 456 7890')).toBe(true);
  });

  test('should reject invalid phone numbers', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('12345')).toBe(false);
    expect(isValidPhone('abc defghij')).toBe(false);
    expect(isValidPhone('')).toBe(false);
  });
});

describe('Validation - Zip Code Validation', () => {
  test('should accept valid zip codes', () => {
    expect(isValidZipCode('10001')).toBe(true);
    expect(isValidZipCode('NY 10001')).toBe(true);
    expect(isValidZipCode('10001-1234')).toBe(true);
    expect(isValidZipCode('M5V 3A8')).toBe(true);
    expect(isValidZipCode('SW1A 1AA')).toBe(true);
  });

  test('should reject invalid zip codes', () => {
    expect(isValidZipCode('12')).toBe(false);
    expect(isValidZipCode('')).toBe(false);
    expect(isValidZipCode('  ')).toBe(false);
  });
});

describe('Validation - Complete User Data Validation', () => {
  const validUserData = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '(123) 456-7890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    country: 'United States',
    zipCode: '10001',
    notes: 'Test notes'
  };

  test('should validate correct user data', () => {
    const result = validateUserData(validUserData);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('should reject missing required fields', () => {
    const invalidData = { ...validUserData, fullName: '' };
    const result = validateUserData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Full Name is required');
  });

  test('should reject invalid email', () => {
    const invalidData = { ...validUserData, email: 'invalid-email' };
    const result = validateUserData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Email format is invalid');
  });

  test('should reject invalid phone', () => {
    const invalidData = { ...validUserData, phone: '123' };
    const result = validateUserData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Phone Number must be at least 10 digits');
  });

  test('should reject invalid zip code', () => {
    const invalidData = { ...validUserData, zipCode: '12' };
    const result = validateUserData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Zip Code format is invalid');
  });

  test('should return multiple errors for multiple invalid fields', () => {
    const invalidData = {
      fullName: '',
      email: 'invalid',
      phone: '123',
      address: '',
      city: 'New York',
      state: 'NY',
      country: 'United States',
      zipCode: '10001'
    };
    const result = validateUserData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(3);
  });

  test('should handle whitespace in required fields', () => {
    const invalidData = { ...validUserData, fullName: '   ' };
    const result = validateUserData(invalidData);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Full Name is required');
  });

  test('should validate all required fields', () => {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'country', 'zipCode'];
    
    requiredFields.forEach((field) => {
      const invalidData = { ...validUserData, [field]: '' };
      const result = validateUserData(invalidData);
      expect(result.isValid).toBe(false);
    });
  });

  test('should accept optional notes field', () => {
    const dataWithoutNotes = { ...validUserData };
    delete dataWithoutNotes.notes;
    const result = validateUserData(dataWithoutNotes);
    expect(result.isValid).toBe(true);
  });
});
