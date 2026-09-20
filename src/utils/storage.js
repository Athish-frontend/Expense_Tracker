const STORAGE_KEY = 'expenseTrackerTransactions';

/**
 * Retrieves all stored transactions from localStorage.
 * Handles corrupt data safely and returns an empty array on failure.
 * @returns {Array} List of transactions
 */
export const getTransactions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn('Invalid transactions format in localStorage. Resetting to empty array.');
      return [];
    }
    // Validate that entries have minimum required fields
    return parsed.filter(item => item && typeof item === 'object' && item.id && item.amount !== undefined);
  } catch (error) {
    console.error('Failed to read transactions from localStorage:', error);
    return [];
  }
};

/**
 * Saves transactions array to localStorage.
 * @param {Array} transactions 
 * @returns {boolean} Success status
 */
export const saveTransactions = (transactions) => {
  try {
    if (!Array.isArray(transactions)) {
      console.error('saveTransactions received non-array data');
      return false;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error('Failed to save transactions to localStorage:', error);
    return false;
  }
};

/**
 * Clears all transactions from localStorage.
 * @returns {boolean} Success status
 */
export const clearTransactions = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear transactions from localStorage:', error);
    return false;
  }
};

/**
 * Seeds sample initial transactions for quick start / demo testing if user requests.
 */
export const getSampleTransactions = () => [
  {
    id: 'tx_demo_1',
    type: 'income',
    amount: 50000,
    category: 'Salary',
    paymentMethod: 'Bank Transfer',
    description: 'Monthly Tech Lead Salary',
    date: '2026-09-01'
  },
  {
    id: 'tx_demo_2',
    type: 'expense',
    amount: 15000,
    category: 'Rent',
    paymentMethod: 'Bank Transfer',
    description: 'Apartment Monthly Rent',
    date: '2026-09-02'
  },
  {
    id: 'tx_demo_3',
    type: 'expense',
    amount: 3200,
    category: 'Bills',
    paymentMethod: 'UPI',
    description: 'Electricity & Fiber Internet',
    date: '2026-09-05'
  },
  {
    id: 'tx_demo_4',
    type: 'income',
    amount: 12000,
    category: 'Freelance',
    paymentMethod: 'UPI',
    description: 'UI Design System Contract',
    date: '2026-09-10'
  },
  {
    id: 'tx_demo_5',
    type: 'expense',
    amount: 4500,
    category: 'Food',
    paymentMethod: 'Credit Card',
    description: 'Supermarket Groceries & Pantry',
    date: '2026-09-14'
  },
  {
    id: 'tx_demo_6',
    type: 'expense',
    amount: 1800,
    category: 'Travel',
    paymentMethod: 'UPI',
    description: 'Fuel & Highway Tolls',
    date: '2026-09-18'
  },
  {
    id: 'tx_demo_7',
    type: 'expense',
    amount: 999,
    category: 'Entertainment',
    paymentMethod: 'Debit Card',
    description: 'Movie IMAX Tickets & Popcorn',
    date: '2026-09-20'
  }
];
