export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const cleaned = ('' + phone).replace(/\D/g, '');
  return cleaned.length === 10;
};

export const validatePinCode = (pin) => {
  const cleaned = ('' + pin).replace(/\D/g, '');
  return cleaned.length === 6;
};
