export const PAYMENT_METHODS = [
  { id: 'Cash', name: 'Cash', icon: 'MdAttachMoney' },
  { id: 'UPI', name: 'UPI', icon: 'MdQrCode2' },
  { id: 'Credit Card', name: 'Credit Card', icon: 'MdCreditCard' },
  { id: 'Debit Card', name: 'Debit Card', icon: 'MdCreditCard' },
  { id: 'Bank Transfer', name: 'Bank Transfer', icon: 'MdAccountBalance' },
  { id: 'Other', name: 'Other', icon: 'MdMoreHoriz' }
];

export const getPaymentMethodMeta = (methodName) => {
  const found = PAYMENT_METHODS.find(m => m.name.toLowerCase() === (methodName || '').toLowerCase());
  return found || {
    id: methodName || 'Other',
    name: methodName || 'Other',
    icon: 'MdMoreHoriz'
  };
};
