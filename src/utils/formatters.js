import { format, parseISO, isValid } from 'date-fns';

/**
 * Formats a number into Indian Rupee currency format (e.g., ₹50,000, ₹1,00,000)
 * @param {number} amount 
 * @param {boolean} includeSymbol 
 * @returns {string} Formatted string
 */
export const formatCurrency = (amount, includeSymbol = true) => {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: Number.isInteger(num) ? 0 : 2
  }).format(num);

  return includeSymbol ? `₹${formatted}` : formatted;
};

/**
 * Formats a date string (YYYY-MM-DD) into readable format like "20 Sep 2026"
 * @param {string|Date} dateInput 
 * @param {string} formatStr 
 * @returns {string} Formatted date string
 */
export const formatDate = (dateInput, formatStr = 'dd MMM yyyy') => {
  if (!dateInput) return '';
  try {
    let dateObj;
    if (typeof dateInput === 'string') {
      // Handles both "2026-09-20" and ISO timestamp strings
      dateObj = parseISO(dateInput);
    } else {
      dateObj = dateInput;
    }

    if (!isValid(dateObj)) {
      return String(dateInput);
    }
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date format error:', error);
    return String(dateInput);
  }
};

/**
 * Formats date into standard YYYY-MM-DD input format
 * @param {Date|string} dateInput 
 * @returns {string}
 */
export const formatDateForInput = (dateInput = new Date()) => {
  try {
    let dateObj = typeof dateInput === 'string' ? parseISO(dateInput) : dateInput;
    if (!isValid(dateObj)) {
      dateObj = new Date();
    }
    return format(dateObj, 'yyyy-MM-dd');
  } catch {
    return new Date().toISOString().split('T')[0];
  }
};
