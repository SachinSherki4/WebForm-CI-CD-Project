/**
 * Validation functions for user data
 */

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  // Accept 10+ digit numbers (with or without formatting)
  const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
  return phoneRegex.test(phone.trim());
}

function isValidZipCode(zipCode) {
  // Accept alphanumeric zip codes
  const zipRegex = /^[a-zA-Z0-9\s\-]{3,}$/;
  return zipRegex.test(zipCode.trim());
}

function validateUserData(data) {
  const errors = [];

  // Required field validations
  if (!data.fullName || !data.fullName.trim()) {
    errors.push('Full Name is required');
  }

  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  } else if (!isValidEmail(data.email)) {
    errors.push('Email format is invalid');
  }

  if (!data.phone || !data.phone.trim()) {
    errors.push('Phone Number is required');
  } else if (!isValidPhone(data.phone)) {
    errors.push('Phone Number must be at least 10 digits');
  }

  if (!data.address || !data.address.trim()) {
    errors.push('Address is required');
  }

  if (!data.city || !data.city.trim()) {
    errors.push('City is required');
  }

  if (!data.state || !data.state.trim()) {
    errors.push('State is required');
  }

  if (!data.country || !data.country.trim()) {
    errors.push('Country is required');
  }

  if (!data.zipCode || !data.zipCode.trim()) {
    errors.push('Zip Code is required');
  } else if (!isValidZipCode(data.zipCode)) {
    errors.push('Zip Code format is invalid');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  validateUserData,
  isValidEmail,
  isValidPhone,
  isValidZipCode
};
