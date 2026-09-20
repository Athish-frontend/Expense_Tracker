import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdTrendingDown,
  MdTrendingUp,
  MdErrorOutline,
  MdSave,
  MdLabel
} from 'react-icons/md';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES } from '../data/categories';
import { PAYMENT_METHODS } from '../data/paymentMethods';
import { formatDateForInput } from '../utils/formatters';

export const TransactionForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  isEditing = false
}) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    customCategory: '',
    paymentMethod: 'UPI',
    description: '',
    date: formatDateForInput()
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Initialize with initialData if editing
  useEffect(() => {
    if (initialData) {
      const isPredefined = ALL_CATEGORIES.some(
        c => c.name.toLowerCase() === (initialData.category || '').toLowerCase() && c.name !== 'Other'
      );

      const categoryVal = isPredefined ? initialData.category : 'Other';
      const customCategoryVal = isPredefined ? '' : (initialData.category === 'Other' ? '' : initialData.category);

      setFormData({
        type: initialData.type || 'expense',
        amount: initialData.amount !== undefined ? String(initialData.amount) : '',
        category: categoryVal,
        customCategory: customCategoryVal || '',
        paymentMethod: initialData.paymentMethod || 'UPI',
        description: initialData.description || '',
        date: formatDateForInput(initialData.date)
      });
    }
  }, [initialData]);

  // Set default category when type changes or on first mount if empty
  const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    if (!isEditing || !formData.category) {
      const isValidCat = categories.some(c => c.name === formData.category);
      if (!isValidCat && categories.length > 0) {
        setFormData(prev => ({ ...prev, category: categories[0].name }));
      }
    }
  }, [formData.type, categories, isEditing, formData.category]);

  const validate = (data = formData) => {
    const newErrors = {};

    // Amount validation
    if (!data.amount || String(data.amount).trim() === '') {
      newErrors.amount = 'Amount is required.';
    } else {
      const num = Number(data.amount);
      if (isNaN(num)) {
        newErrors.amount = 'Amount must be a valid number.';
      } else if (num <= 0) {
        newErrors.amount = 'Amount must be greater than ₹0.';
      }
    }

    // Category validation
    if (!data.category || data.category.trim() === '') {
      newErrors.category = 'Please select a category.';
    } else if (data.category === 'Other') {
      if (!data.customCategory || data.customCategory.trim() === '') {
        newErrors.customCategory = 'Please specify a category name / tag.';
      } else if (data.customCategory.trim().length < 2) {
        newErrors.customCategory = 'Category tag must be at least 2 characters.';
      }
    }

    // Payment Method validation
    if (!data.paymentMethod || data.paymentMethod.trim() === '') {
      newErrors.paymentMethod = 'Please select a payment method.';
    }

    // Description validation
    if (!data.description || data.description.trim() === '') {
      newErrors.description = 'Description is required.';
    } else if (data.description.trim().length < 2) {
      newErrors.description = 'Description must be at least 2 characters.';
    }

    // Date validation
    if (!data.date || data.date.trim() === '') {
      newErrors.date = 'Date is required.';
    }

    return newErrors;
  };

  const handleTypeChange = (newType) => {
    const newCategories = newType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setFormData(prev => ({
      ...prev,
      type: newType,
      category: newCategories[0]?.name || '',
      customCategory: ''
    }));

    if (touched.category) {
      setErrors(prev => ({ ...prev, category: undefined, customCategory: undefined }));
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (touched[field]) {
      const fieldErrors = validate({ ...formData, [field]: value });
      setErrors(prev => ({
        ...prev,
        [field]: fieldErrors[field]
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const fieldErrors = validate(formData);
    setErrors(prev => ({
      ...prev,
      [field]: fieldErrors[field]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      amount: true,
      category: true,
      customCategory: true,
      paymentMethod: true,
      description: true,
      date: true
    });

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      // Determine final category tag: If 'Other', save user's custom tag
      const finalCategory = formData.category === 'Other'
        ? (formData.customCategory.trim() || 'Other')
        : formData.category;

      const payload = {
        ...(initialData?.id ? { id: initialData.id } : {}),
        type: formData.type,
        amount: parseFloat(formData.amount),
        category: finalCategory,
        paymentMethod: formData.paymentMethod,
        description: formData.description.trim(),
        date: formData.date
      };

      onSubmit(payload);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(-1);
    }
  };

  const isOtherCategory = formData.category === 'Other';

  return (
    <div className="form-card">
      <div className="form-header">
        <h2 className="form-title">
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>
        <p className="form-subtitle">
          {isEditing
            ? 'Update transaction details and save changes'
            : 'Fill in the information below to record a new transaction'}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Type Switcher Tabs */}
        <div className="type-switcher" role="radiogroup" aria-label="Transaction Type">
          <button
            type="button"
            className={`type-tab ${formData.type === 'expense' ? 'active-expense' : ''}`}
            onClick={() => handleTypeChange('expense')}
            role="radio"
            aria-checked={formData.type === 'expense'}
          >
            <MdTrendingDown size={18} /> Expense
          </button>
          <button
            type="button"
            className={`type-tab ${formData.type === 'income' ? 'active-income' : ''}`}
            onClick={() => handleTypeChange('income')}
            role="radio"
            aria-checked={formData.type === 'income'}
          >
            <MdTrendingUp size={18} /> Income
          </button>
        </div>

        <div className="form-grid">
          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="tx-amount" className="form-label">
              Amount <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <span className="input-prefix">₹</span>
              <input
                id="tx-amount"
                type="number"
                step="any"
                min="0.01"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                onBlur={() => handleBlur('amount')}
                required
                aria-invalid={!!errors.amount}
                aria-describedby={errors.amount ? 'tx-amount-error' : undefined}
              />
            </div>
            {errors.amount && (
              <div id="tx-amount-error" className="form-error">
                <MdErrorOutline size={14} /> {errors.amount}
              </div>
            )}
          </div>

          {/* Date Field */}
          <div className="form-group">
            <label htmlFor="tx-date" className="form-label">
              Date <span className="required-star">*</span>
            </label>
            <input
              id="tx-date"
              type="date"
              className={`form-input ${errors.date ? 'error' : ''}`}
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              onBlur={() => handleBlur('date')}
              required
              aria-invalid={!!errors.date}
              aria-describedby={errors.date ? 'tx-date-error' : undefined}
            />
            {errors.date && (
              <div id="tx-date-error" className="form-error">
                <MdErrorOutline size={14} /> {errors.date}
              </div>
            )}
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="tx-category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <select
              id="tx-category"
              className={`form-select ${errors.category ? 'error' : ''}`}
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              required
              aria-invalid={!!errors.category}
              aria-describedby={errors.category ? 'tx-category-error' : undefined}
            >
              <option value="" disabled>Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <div id="tx-category-error" className="form-error">
                <MdErrorOutline size={14} /> {errors.category}
              </div>
            )}
          </div>

          {/* Payment Method Field */}
          <div className="form-group">
            <label htmlFor="tx-payment" className="form-label">
              Payment Method <span className="required-star">*</span>
            </label>
            <select
              id="tx-payment"
              className={`form-select ${errors.paymentMethod ? 'error' : ''}`}
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              onBlur={() => handleBlur('paymentMethod')}
              required
              aria-invalid={!!errors.paymentMethod}
              aria-describedby={errors.paymentMethod ? 'tx-payment-error' : undefined}
            >
              {PAYMENT_METHODS.map((method) => (
                <option key={method.id} value={method.name}>
                  {method.name}
                </option>
              ))}
            </select>
            {errors.paymentMethod && (
              <div id="tx-payment-error" className="form-error">
                <MdErrorOutline size={14} /> {errors.paymentMethod}
              </div>
            )}
          </div>

          {/* Custom Category Tag Input (Visible when "Other" is selected) */}
          {isOtherCategory && (
            <div className="form-group full-width" style={{ animation: 'fadeIn 0.2s ease-in-out' }}>
              <label htmlFor="tx-custom-category" className="form-label">
                <MdLabel size={15} /> Specify Category Tag <span className="required-star">*</span>
              </label>
              <input
                id="tx-custom-category"
                type="text"
                className={`form-input ${errors.customCategory ? 'error' : ''}`}
                placeholder={
                  formData.type === 'expense'
                    ? 'e.g., Pet Care, Subscriptions, Gym, Gaming...'
                    : 'e.g., Side Hustle, Consulting, Cashback, Rental...'
                }
                value={formData.customCategory}
                onChange={(e) => handleChange('customCategory', e.target.value)}
                onBlur={() => handleBlur('customCategory')}
                required
                autoFocus
                aria-invalid={!!errors.customCategory}
                aria-describedby={errors.customCategory ? 'tx-custom-category-error' : undefined}
              />
              {errors.customCategory && (
                <div id="tx-custom-category-error" className="form-error">
                  <MdErrorOutline size={14} /> {errors.customCategory}
                </div>
              )}
            </div>
          )}

          {/* Description Field */}
          <div className="form-group full-width">
            <label htmlFor="tx-desc" className="form-label">
              Description <span className="required-star">*</span>
            </label>
            <input
              id="tx-desc"
              type="text"
              className={`form-input ${errors.description ? 'error' : ''}`}
              placeholder={
                formData.type === 'expense'
                  ? 'e.g., Grocery shopping, Uber ride, Dinner'
                  : 'e.g., Monthly salary, Freelance client work'
              }
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              required
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'tx-desc-error' : undefined}
            />
            {errors.description && (
              <div id="tx-desc-error" className="form-error">
                <MdErrorOutline size={14} /> {errors.description}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <MdSave size={18} /> {isEditing ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
