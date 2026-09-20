import TransactionItem from './TransactionItem';
import EmptyState from './EmptyState';
import { MdSearchOff } from 'react-icons/md';

export const TransactionList = ({
  transactions = [],
  onEdit,
  onDelete,
  isFiltered = false,
  onClearFilters
}) => {
  if (transactions.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          icon={MdSearchOff}
          title="No transactions found"
          message="Try adjusting your search terms or relaxing your filter parameters."
          actionText="Clear Filters"
          actionLink=""
          onAction={onClearFilters}
        />
      );
    }

    return (
      <EmptyState
        title="No transactions yet"
        message="Start tracking your finances by adding your first income or expense."
        actionText="Add Transaction"
        actionLink="/add"
      />
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Type</th>
                <th>Amount</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  transaction={transaction}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  viewMode="table"
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="mobile-tx-list">
        {transactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
            viewMode="card"
          />
        ))}
      </div>
    </>
  );
};

export default TransactionList;
