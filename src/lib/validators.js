export function isValidEmail(value) {
  if (typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

export function validateContact({ name = '', email = '', message = '' } = {}) {
  const errors = {};
  if (!name.trim()) errors.name = 'Please tell me your name.';
  if (!isValidEmail(email)) errors.email = 'Please enter a valid email address.';
  if (message.trim().length < 10) errors.message = 'A little more detail please (10+ characters).';
  return errors;
}
