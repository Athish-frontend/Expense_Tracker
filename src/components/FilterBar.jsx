import { useMemo } from 'react';
import { MdRestartAlt } from 'react-icons/md';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES } from '../data/categories';
import { PAYMENT_METHODS } from '../data/paymentMethods';
import SearchBar from './SearchBar';

export const FilterBar = ({
  filters,
  onFilterChange,
  onResetFilters,
  hasActiveFilters,
  customCategories = []
}) => {
  const handleFieldChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  // Determine category options based on type and incorporate custom tags
  const categoryOptions = useMemo(() => {
    let baseList = ALL_CATEGORIES;
    if (filters.type === 'expense') {
      baseList = EXPENSE_CATEGORIES;
    } else if (filters.type === 'income') {
      baseList = INCOME_CATEGORIES;
    }

    const baseNames = baseList.map(c => c.name);
    // Filter custom categories matching the current filter type if type isn't 'all'
    const extraCustom = customCategories.filter(name => !baseNames.includes(name));

    return [
      ...baseList.filter(c => c.name !== 'Other'),
      ...extraCustom.map(name => ({ id: name, name })),
      baseList.find(c => c.name === 'Other') || { id: 'Other', name: 'Other' }
    ];
  }, [filters.type, customCategories]);

  return (
    <div className="filter-card">
      {/* Top Row: Search and Sort */}
      <div className="filter-row-top">
        <SearchBar
          value={filters.search}
          onChange={(val) => handleFieldChange('search', val)}
          placeholder="Search transactions..."
        />

        <div className="filter-group" style={{ minWidth: '160px' }}>
          <label htmlFor="sort-select" className="filter-label">Sort By</label>
          <select
            id="sort-select"
            className="filter-select"
            value={filters.sortBy}
            onChange={(e) => handleFieldChange('sortBy', e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Detailed Filters */}
      <div className="filter-row-bottom">
        {/* Type Filter */}
        <div className="filter-group">
          <label htmlFor="type-filter" className="filter-label">Type</label>
          <select
            id="type-filter"
            className="filter-select"
            value={filters.type}
            onChange={(e) => {
              const newType = e.target.value;
              onFilterChange({
                ...filters,
                type: newType,
                // Reset category if not matching new type
                category: 'all'
              });
            }}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category-filter" className="filter-label">Category</label>
          <select
            id="category-filter"
            className="filter-select"
            value={filters.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method Filter */}
        <div className="filter-group">
          <label htmlFor="payment-filter" className="filter-label">Payment Method</label>
          <select
            id="payment-filter"
            className="filter-select"
            value={filters.paymentMethod}
            onChange={(e) => handleFieldChange('paymentMethod', e.target.value)}
          >
            <option value="all">All Methods</option>
            {PAYMENT_METHODS.map((pm) => (
              <option key={pm.id} value={pm.name}>
                {pm.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Preset Filter */}
        <div className="filter-group">
          <label htmlFor="date-range-filter" className="filter-label">Date</label>
          <select
            id="date-range-filter"
            className="filter-select"
            value={filters.dateRange}
            onChange={(e) => handleFieldChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>

        {/* Custom Date Pickers when 'custom' is selected */}
        {filters.dateRange === 'custom' && (
          <>
            <div className="filter-group">
              <label htmlFor="start-date-input" className="filter-label">From</label>
              <input
                id="start-date-input"
                type="date"
                className="filter-input"
                value={filters.startDate}
                onChange={(e) => handleFieldChange('startDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label htmlFor="end-date-input" className="filter-label">To</label>
              <input
                id="end-date-input"
                type="date"
                className="filter-input"
                value={filters.endDate}
                onChange={(e) => handleFieldChange('endDate', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Amount Range Filter */}
        <div className="filter-group">
          <label htmlFor="min-amount-input" className="filter-label">Amount (₹)</label>
          <div className="filter-amount-range">
            <input
              id="min-amount-input"
              type="number"
              placeholder="Min"
              min="0"
              className="filter-input"
              value={filters.minAmount}
              onChange={(e) => handleFieldChange('minAmount', e.target.value)}
            />
            <span style={{ color: 'var(--text-muted)' }}>-</span>
            <input
              id="max-amount-input"
              type="number"
              placeholder="Max"
              min="0"
              className="filter-input"
              value={filters.maxAmount}
              onChange={(e) => handleFieldChange('maxAmount', e.target.value)}
            />
          </div>
        </div>

        {/* Clear Filters Action */}
        <div className="filter-actions">
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onResetFilters}
              title="Reset all search queries and active filters"
            >
              <MdRestartAlt size={16} /> Clear Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
