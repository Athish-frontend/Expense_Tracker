export const EXPENSE_CATEGORIES = [
  { id: 'Food', name: 'Food', icon: 'MdRestaurant', color: '#f97316', description: 'Groceries, restaurants, snacks & takeout' },
  { id: 'Travel', name: 'Travel', icon: 'MdDirectionsBus', color: '#3b82f6', description: 'Commute, flights, fuel & public transit' },
  { id: 'Shopping', name: 'Shopping', icon: 'MdShoppingCart', color: '#ec4899', description: 'Clothing, electronics, gadgets & personal items' },
  { id: 'Bills', name: 'Bills', icon: 'MdReceiptLong', color: '#eab308', description: 'Electricity, water, gas, internet & phone' },
  { id: 'Entertainment', name: 'Entertainment', icon: 'MdMovie', color: '#8b5cf6', description: 'Movies, streaming, games & events' },
  { id: 'Healthcare', name: 'Healthcare', icon: 'MdLocalHospital', color: '#ef4444', description: 'Medicines, consultations, gym & wellness' },
  { id: 'Education', name: 'Education', icon: 'MdSchool', color: '#06b6d4', description: 'Courses, books, tuition & stationery' },
  { id: 'Rent', name: 'Rent', icon: 'MdHome', color: '#14b8a6', description: 'Apartment, house rent & maintenance' },
  { id: 'Other', name: 'Other', icon: 'MdMoreHoriz', color: '#64748b', description: 'Miscellaneous & custom tag expenses' }
];

export const INCOME_CATEGORIES = [
  { id: 'Salary', name: 'Salary', icon: 'MdWork', color: '#10b981', description: 'Monthly wage & employment income' },
  { id: 'Freelance', name: 'Freelance', icon: 'MdLaptop', color: '#0ea5e9', description: 'Contract work, gigs & client projects' },
  { id: 'Business', name: 'Business', icon: 'MdBusinessCenter', color: '#6366f1', description: 'Profits from business operations & sales' },
  { id: 'Investment', name: 'Investment', icon: 'MdTrendingUp', color: '#8b5cf6', description: 'Dividends, capital gains, stocks & interest' },
  { id: 'Gift', name: 'Gift', icon: 'MdCardGiftcard', color: '#f43f5e', description: 'Gifts, bonuses & rewards received' },
  { id: 'Other', name: 'Other', icon: 'MdMoreHoriz', color: '#64748b', description: 'Miscellaneous & custom tag income sources' }
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

const CUSTOM_COLORS = [
  '#0284c7', '#7c3aed', '#db2777', '#ea580c', '#0d9488',
  '#4f46e5', '#d97706', '#059669', '#6366f1', '#e11d48'
];

const getDeterministicColor = (str = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CUSTOM_COLORS.length;
  return CUSTOM_COLORS[index];
};

export const getCategoryMeta = (categoryName, type = 'expense') => {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const found = list.find(c => c.name.toLowerCase() === (categoryName || '').toLowerCase());
  if (found) return found;
  
  // Fallback to all categories
  const fallback = ALL_CATEGORIES.find(c => c.name.toLowerCase() === (categoryName || '').toLowerCase());
  if (fallback) return fallback;

  // Custom Category Tag
  const name = categoryName || 'Other';
  return {
    id: name,
    name: name,
    icon: 'MdCategory',
    color: getDeterministicColor(name),
    description: 'Custom tag category',
    isCustom: true
  };
};
