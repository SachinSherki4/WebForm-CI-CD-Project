/**
 * User Form Application - Frontend
 * Handles form validation, submission, and submissions display
 */

const API_BASE_URL = '/api/users';

// DOM Elements
const userForm = document.getElementById('userForm');
const submitBtn = document.getElementById('submitBtn');
const viewBtn = document.getElementById('viewBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const submissionsModal = document.getElementById('submissionsModal');
const closeModal = document.getElementById('closeModal');
const submissionsList = document.getElementById('submissionsList');

// Form fields
const formFields = {
  fullName: document.getElementById('fullName'),
  email: document.getElementById('email'),
  phone: document.getElementById('phone'),
  address: document.getElementById('address'),
  city: document.getElementById('city'),
  state: document.getElementById('state'),
  country: document.getElementById('country'),
  zipCode: document.getElementById('zipCode'),
  notes: document.getElementById('notes')
};

/**
 * Validation Rules
 */
const validationRules = {
  fullName: {
    required: true,
    validator: (value) => value.trim().length > 0,
    errorMessage: 'Full Name is required'
  },
  email: {
    required: true,
    validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    errorMessage: 'Please enter a valid email address'
  },
  phone: {
    required: true,
    validator: (value) => /^[\d\s\-\+\(\)]{10,}$/.test(value),
    errorMessage: 'Phone must contain at least 10 digits'
  },
  address: {
    required: true,
    validator: (value) => value.trim().length > 0,
    errorMessage: 'Street Address is required'
  },
  city: {
    required: true,
    validator: (value) => value.trim().length > 0,
    errorMessage: 'City is required'
  },
  state: {
    required: true,
    validator: (value) => value.trim().length > 0,
    errorMessage: 'State/Province is required'
  },
  country: {
    required: true,
    validator: (value) => value.trim().length > 0,
    errorMessage: 'Country is required'
  },
  zipCode: {
    required: true,
    validator: (value) => /^[a-zA-Z0-9\s\-]{3,}$/.test(value),
    errorMessage: 'Please enter a valid zip code'
  },
  notes: {
    required: false,
    validator: () => true,
    errorMessage: ''
  }
};

/**
 * Validate a single field
 */
function validateField(fieldName) {
  const field = formFields[fieldName];
  const rule = validationRules[fieldName];
  const value = field.value;
  const formGroup = field.closest('.form-group');

  if (!rule) return true;

  const isValid = rule.validator(value);

  if (!isValid) {
    formGroup.classList.add('error');
    const errorElement = document.getElementById(`error-${fieldName}`);
    if (errorElement) {
      errorElement.textContent = rule.errorMessage;
    }
    return false;
  } else {
    formGroup.classList.remove('error');
    const errorElement = document.getElementById(`error-${fieldName}`);
    if (errorElement) {
      errorElement.textContent = '';
    }
    return true;
  }
}

/**
 * Validate entire form
 */
function validateForm() {
  const fieldNames = Object.keys(formFields);
  let isFormValid = true;

  fieldNames.forEach((fieldName) => {
    if (!validateField(fieldName)) {
      isFormValid = false;
    }
  });

  return isFormValid;
}

/**
 * Clear form
 */
function clearForm() {
  userForm.reset();
  
  // Clear all error states
  Object.keys(formFields).forEach((fieldName) => {
    const formGroup = formFields[fieldName].closest('.form-group');
    formGroup.classList.remove('error');
    const errorElement = document.getElementById(`error-${fieldName}`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  });
}

/**
 * Show success message
 */
function showSuccessMessage() {
  successMessage.style.display = 'flex';
  errorMessage.style.display = 'none';
  
  setTimeout(() => {
    successMessage.style.display = 'none';
  }, 5000);
}

/**
 * Show error message
 */
function showErrorMessage(errors = []) {
  errorMessage.style.display = 'flex';
  successMessage.style.display = 'none';
  
  if (errors.length > 0) {
    const errorList = errors.join(', ');
    errorMessage.innerHTML = `<strong>Error!</strong> ${errorList}`;
  }
}

/**
 * Hide messages
 */
function hideMessages() {
  successMessage.style.display = 'none';
  errorMessage.style.display = 'none';
}

/**
 * Submit form
 */
async function submitForm(e) {
  e.preventDefault();
  hideMessages();

  // Validate form
  if (!validateForm()) {
    showErrorMessage();
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  document.querySelector('.btn-text').style.display = 'none';
  document.querySelector('.btn-loading').style.display = 'flex';

  try {
    const formData = {
      fullName: formFields.fullName.value.trim(),
      email: formFields.email.value.trim().toLowerCase(),
      phone: formFields.phone.value.trim(),
      address: formFields.address.value.trim(),
      city: formFields.city.value.trim(),
      state: formFields.state.value.trim(),
      country: formFields.country.value.trim(),
      zipCode: formFields.zipCode.value.trim(),
      notes: formFields.notes.value.trim()
    };

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      showSuccessMessage();
      clearForm();
    } else {
      const errors = result.errors || [result.message || 'Failed to submit form'];
      showErrorMessage(errors);
    }
  } catch (error) {
    console.error('Error submitting form:', error);
    showErrorMessage(['An error occurred. Please try again.']);
  } finally {
    // Hide loading state
    submitBtn.disabled = false;
    document.querySelector('.btn-text').style.display = 'inline';
    document.querySelector('.btn-loading').style.display = 'none';
  }
}

/**
 * Fetch all submissions
 */
async function fetchSubmissions() {
  try {
    const response = await fetch(API_BASE_URL);
    const result = await response.json();

    if (response.ok && result.success && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}

/**
 * Format date
 */
function formatDate(dateString) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Render submissions list
 */
function renderSubmissions(submissions) {
  if (submissions.length === 0) {
    submissionsList.innerHTML = '<div class="no-submissions"><p>No submissions yet. Be the first to submit!</p></div>';
    return;
  }

  submissionsList.innerHTML = submissions
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(
      (submission) => `
    <div class="submission-card">
      <div class="submission-card-header">
        <div class="submission-card-name">${escapeHtml(submission.fullName)}</div>
        <div class="submission-card-date">${formatDate(submission.createdAt)}</div>
      </div>
      <div class="submission-card-content">
        <div class="submission-field">
          <span class="submission-field-label">Email:</span><br>
          <span class="submission-field-value">${escapeHtml(submission.email)}</span>
        </div>
        <div class="submission-field">
          <span class="submission-field-label">Phone:</span><br>
          <span class="submission-field-value">${escapeHtml(submission.phone)}</span>
        </div>
        <div class="submission-field">
          <span class="submission-field-label">Address:</span><br>
          <span class="submission-field-value">${escapeHtml(submission.address)}</span>
        </div>
        <div class="submission-field">
          <span class="submission-field-label">City:</span><br>
          <span class="submission-field-value">${escapeHtml(submission.city)}</span>
        </div>
        <div class="submission-field">
          <span class="submission-field-label">State:</span><br>
          <span class="submission-field-value">${escapeHtml(submission.state)}</span>
        </div>
        <div class="submission-field">
          <span class="submission-field-label">Country:</span><br>
          <span class="submission-field-value">${escapeHtml(submission.country)}</span>
        </div>
        <div class="submission-field">
          <span class="submission-field-label">Zip Code:</span><br>
          <span class="submission-field-value">${escapeHtml(submission.zipCode)}</span>
        </div>
        ${submission.notes ? `<div class="submission-field" style="grid-column: 1 / -1;">
          <span class="submission-field-label">Notes:</span><br>
          <span class="submission-field-value">${escapeHtml(submission.notes)}</span>
        </div>` : ''}
      </div>
    </div>
  `
    )
    .join('');
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Show submissions modal
 */
async function showSubmissionsModal() {
  submissionsModal.style.display = 'flex';
  const submissions = await fetchSubmissions();
  renderSubmissions(submissions);
}

/**
 * Hide submissions modal
 */
function hideSubmissionsModal() {
  submissionsModal.style.display = 'none';
}

/**
 * Real-time validation on input
 */
Object.keys(formFields).forEach((fieldName) => {
  const field = formFields[fieldName];

  field.addEventListener('blur', () => {
    validateField(fieldName);
  });

  field.addEventListener('input', () => {
    const formGroup = field.closest('.form-group');
    if (formGroup.classList.contains('error')) {
      validateField(fieldName);
    }
  });
});

/**
 * Form submission
 */
userForm.addEventListener('submit', submitForm);

/**
 * View submissions button
 */
viewBtn.addEventListener('click', showSubmissionsModal);

/**
 * Close modal button
 */
closeModal.addEventListener('click', hideSubmissionsModal);

/**
 * Close modal on outside click
 */
submissionsModal.addEventListener('click', (e) => {
  if (e.target === submissionsModal) {
    hideSubmissionsModal();
  }
});

/**
 * Close modal on Escape key
 */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && submissionsModal.style.display !== 'none') {
    hideSubmissionsModal();
  }
});

/**
 * Initialize app on load
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Application loaded successfully');
  console.log('📝 Ready to collect user information');
});
