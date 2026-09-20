import {
  isToday,
  isThisWeek,
  isThisMonth,
  parseISO,
  isValid,
  isWithinInterval,
  startOfDay,
  endOfDay,
  format,
  subMonths
} from 'date-fns';

/**
 * Calculates total income from a transactions array.
 * @param {Array} transactions 
 * @returns {number}
 */
export const calculateTotalIncome = (transactions = []) => {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
};

/**
 * Calculates total expenses from a transactions array.
 * @param {Array} transactions 
 * @returns {number}
 */
export const calculateTotalExpenses = (transactions = []) => {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
};

/**
 * Calculates net balance (Total Income - Total Expenses).
 * @param {Array} transactions 
 * @returns {number}
 */
export const calculateBalance = (transactions = []) => {
  return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

/**
 * Calculates breakdown of spending/earnings grouped by category.
 * @param {Array} transactions 
 * @param {'expense'|'income'} type 
 * @returns {Array<{category: string, amount: number, percentage: number, count: number}>}
 */
export const calculateCategoryTotals = (transactions = [], type = 'expense') => {
  const filtered = transactions.filter(t => t.type === type);
  const totalAmount = filtered.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const map = {};
  filtered.forEach(t => {
    const cat = t.category || 'Other';
    if (!map[cat]) {
      map[cat] = { category: cat, amount: 0, count: 0 };
    }
    map[cat].amount += Number(t.amount) || 0;
    map[cat].count += 1;
  });

  return Object.values(map)
    .map(item => ({
      ...item,
      percentage: totalAmount > 0 ? Math.round((item.amount / totalAmount) * 100) : 0
    }))
    .sort((a, b) => b.amount - a.amount);
};

/**
 * Calculates monthly trend for the last 6 months (for Recharts bar/line chart).
 * @param {Array} transactions 
 * @returns {Array<{month: string, income: number, expense: number, balance: number}>}
 */
export const calculateMonthlyTrend = (transactions = []) => {
  const result = [];
  const now = new Date();

  // Last 6 months in chronological order
  for (let i = 5; i >= 0; i--) {
    const d = subMonths(now, i);
    const monthKey = format(d, 'yyyy-MM');
    const monthLabel = format(d, 'MMM yyyy');

    let monthIncome = 0;
    let monthExpense = 0;

    transactions.forEach(t => {
      if (!t.date) return;
      const tMonthKey = t.date.substring(0, 7);
      if (tMonthKey === monthKey) {
        if (t.type === 'income') {
          monthIncome += Number(t.amount) || 0;
        } else if (t.type === 'expense') {
          monthExpense += Number(t.amount) || 0;
        }
      }
    });

    result.push({
      month: monthLabel,
      monthKey,
      income: monthIncome,
      expense: monthExpense,
      balance: monthIncome - monthExpense
    });
  }

  return result;
};

/**
 * Filter transactions based on search query, type, category, date filter, and min/max amount.
 * @param {Array} transactions 
 * @param {Object} filters 
 * @returns {Array} Filtered transactions
 */
export const filterTransactions = (transactions = [], filters = {}) => {
  const {
    search = '',
    type = 'all',
    category = 'all',
    paymentMethod = 'all',
    dateRange = 'all', // 'all', 'today', 'week', 'month', 'custom'
    startDate = '',
    endDate = '',
    minAmount = '',
    maxAmount = ''
  } = filters;

  const searchQuery = search.trim().toLowerCase();

  return transactions.filter(tx => {
    // 1. Search filter (Description, Category, Payment Method)
    if (searchQuery) {
      const matchDesc = (tx.description || '').toLowerCase().includes(searchQuery);
      const matchCat = (tx.category || '').toLowerCase().includes(searchQuery);
      const matchPay = (tx.paymentMethod || '').toLowerCase().includes(searchQuery);
      if (!matchDesc && !matchCat && !matchPay) {
        return false;
      }
    }

    // 2. Type filter
    if (type !== 'all' && tx.type !== type) {
      return false;
    }

    // 3. Category filter
    if (category !== 'all' && tx.category?.toLowerCase() !== category.toLowerCase()) {
      return false;
    }

    // 4. Payment Method filter
    if (paymentMethod !== 'all' && tx.paymentMethod?.toLowerCase() !== paymentMethod.toLowerCase()) {
      return false;
    }

    // 5. Amount filter
    const amt = Number(tx.amount) || 0;
    if (minAmount !== '' && minAmount !== null && amt < Number(minAmount)) {
      return false;
    }
    if (maxAmount !== '' && maxAmount !== null && amt > Number(maxAmount)) {
      return false;
    }

    // 6. Date filter
    if (dateRange !== 'all') {
      if (!tx.date) return false;
      try {
        const txDate = parseISO(tx.date);
        if (!isValid(txDate)) return false;

        if (dateRange === 'today') {
          if (!isToday(txDate)) return false;
        } else if (dateRange === 'week') {
          if (!isThisWeek(txDate, { weekStartsOn: 1 })) return false;
        } else if (dateRange === 'month') {
          if (!isThisMonth(txDate)) return false;
        } else if (dateRange === 'custom') {
          if (startDate && endDate) {
            const start = startOfDay(parseISO(startDate));
            const end = endOfDay(parseISO(endDate));
            if (isValid(start) && isValid(end)) {
              if (!isWithinInterval(txDate, { start, end })) return false;
            }
          } else if (startDate) {
            const start = startOfDay(parseISO(startDate));
            if (isValid(start) && txDate < start) return false;
          } else if (endDate) {
            const end = endOfDay(parseISO(endDate));
            if (isValid(end) && txDate > end) return false;
          }
        }
      } catch (err) {
        console.error('Date parsing error during filtering:', err);
        return false;
      }
    }

    return true;
  });
};

/**
 * Sorts transactions by specified criteria.
 * @param {Array} transactions 
 * @param {string} sortBy - 'newest', 'oldest', 'highest', 'lowest'
 * @returns {Array} Sorted transactions
 */
export const sortTransactions = (transactions = [], sortBy = 'newest') => {
  const copy = [...transactions];
  switch (sortBy) {
    case 'oldest':
      return copy.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'highest':
      return copy.sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0));
    case 'lowest':
      return copy.sort((a, b) => (Number(a.amount) || 0) - (Number(b.amount) || 0));
    case 'newest':
    default:
      return copy.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
};
