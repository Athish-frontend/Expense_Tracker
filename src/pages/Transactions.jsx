import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MdAdd } from 'react-icons/md';
import { useTransactions } from '../hooks/useTransactions';
import { filterTransactions, sortTransactions } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import FilterBar from '../components/FilterBar';
import TransactionList from '../components/TransactionList';
import ConfirmDialog from '../components/ConfirmDialog';
import TransactionForm from '../components/TransactionForm';

const initialFilterState = {
  search: '',
  type: 'all',
  category: 'all',
  paymentMethod: 'all',
  dateRange: 'all',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
  sortBy: 'newest'
};

export const Transactions = () => {
  const { transactions, deleteTransaction, updateTransaction } = useTransactions();
  const [filters, setFilters] = useState(initialFilterState);

  // Modal states for Delete & Edit
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  // Check if any filter is active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.search.trim() !== '' ||
      filters.type !== 'all' ||
      filters.category !== 'all' ||
      filters.paymentMethod !== 'all' ||
      filters.dateRange !== 'all' ||
      filters.startDate !== '' ||
      filters.endDate !== '' ||
      filters.minAmount !== '' ||
      filters.maxAmount !== '' ||
      filters.sortBy !== 'newest'
    );
  }, [filters]);

  // Derived filtered & sorted transactions
  const displayedTransactions = useMemo(() => {
    const filtered = filterTransactions(transactions, filters);
    return sortTransactions(filtered, filters.sortBy);
  }, [transactions, filters]);

  // Totals for the currently filtered view
  const filteredIncome = useMemo(() => {
    return displayedTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [displayedTransactions]);

  const filteredExpense = useMemo(() => {
    return displayedTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [displayedTransactions]);

  const handleResetFilters = () => {
    setFilters(initialFilterState);
  };

  const handleEditClick = (transaction) => {
    setTransactionToEdit(transaction);
  };

  const handleEditSubmit = (updatedData) => {
    updateTransaction(updatedData);
    setTransactionToEdit(null);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
  };

  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
    }
  };

  // Extract all unique category names present in transactions
  const customCategories = useMemo(() => {
    const set = new Set();
    transactions.forEach(t => {
      if (t.category) {
        set.add(t.category);
      }
    });
    return Array.from(set);
  }, [transactions]);

  return (
    <div className="transactions-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transaction History</h1>
          <p className="page-subtitle">View, search, filter, edit, and organize all your financial transactions</p>
        </div>

        <Link to="/add" className="btn btn-primary">
          <MdAdd size={18} /> Add Transaction
        </Link>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        customCategories={customCategories}
      />

      {/* Results Header & Summary Stats */}
      <div className="results-bar">
        <div className="results-count">
          Showing <span>{displayedTransactions.length}</span> of <span>{transactions.length}</span> transactions
        </div>

        {displayedTransactions.length > 0 && (
          <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
            <span>
              Income: <strong style={{ color: 'var(--color-income)' }}>{formatCurrency(filteredIncome)}</strong>
            </span>
            <span>
              Expense: <strong style={{ color: 'var(--color-expense)' }}>{formatCurrency(filteredExpense)}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Transaction List / Table */}
      <TransactionList
        transactions={displayedTransactions}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        isFiltered={hasActiveFilters && transactions.length > 0}
        onClearFilters={handleResetFilters}
      />

      {/* Edit Transaction Modal */}
      {transactionToEdit && (
        <div className="modal-overlay" onClick={() => setTransactionToEdit(null)} role="dialog" aria-modal="true">
          <div
            style={{ width: '100%', maxWidth: '640px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <TransactionForm
              initialData={transactionToEdit}
              onSubmit={handleEditSubmit}
              onCancel={() => setTransactionToEdit(null)}
              isEditing={true}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!transactionToDelete}
        title="Delete Transaction"
        message={
          transactionToDelete ? (
            <>
              Are you sure you want to delete the transaction <strong>&ldquo;{transactionToDelete.description}&rdquo;</strong> of <strong>{formatCurrency(transactionToDelete.amount)}</strong>? This action cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this transaction?'
          )
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTransactionToDelete(null)}
      />
    </div>
  );
};

export default Transactions;
