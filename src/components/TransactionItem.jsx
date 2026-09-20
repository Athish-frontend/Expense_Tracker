import { MdEdit, MdDelete } from 'react-icons/md';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryMeta } from '../data/categories';
import { getPaymentMethodMeta } from '../data/paymentMethods';
import CategoryIcon from './CategoryIcon';

export const TransactionItem = ({
  transaction,
  onEdit,
  onDelete,
  viewMode = 'table' // 'table' or 'card'
}) => {
  const { type, amount, category, paymentMethod, description, date } = transaction;
  const isIncome = type === 'income';
  const catMeta = getCategoryMeta(category, type);
  const payMeta = getPaymentMethodMeta(paymentMethod);

  if (viewMode === 'table') {
    return (
      <tr>
        <td style={{ whiteSpace: 'nowrap', color: 'var(--text-secondary)' }}>
          {formatDate(date)}
        </td>
        <td className="td-desc">{description}</td>
        <td>
          <span className="badge badge-category">
            <CategoryIcon iconName={catMeta.icon} size={14} style={{ color: catMeta.color }} />
            {category}
          </span>
        </td>
        <td>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <CategoryIcon iconName={payMeta.icon} size={15} />
            {paymentMethod}
          </span>
        </td>
        <td>
          <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
            {isIncome ? 'Income' : 'Expense'}
          </span>
        </td>
        <td className={`td-amount ${isIncome ? 'income' : 'expense'}`}>
          {isIncome ? '+' : '-'} {formatCurrency(amount)}
        </td>
        <td>
          <div className="td-actions">
            <button
              type="button"
              className="btn-icon"
              onClick={() => onEdit(transaction)}
              title="Edit transaction"
              aria-label={`Edit ${description}`}
            >
              <MdEdit size={17} />
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={() => onDelete(transaction)}
              title="Delete transaction"
              aria-label={`Delete ${description}`}
              style={{ color: 'var(--color-expense)' }}
            >
              <MdDelete size={17} />
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // Mobile Card View
  return (
    <div className="mobile-tx-card">
      <div className="mobile-tx-header">
        <div className="mobile-tx-main">
          <div
            className="mobile-tx-icon"
            style={{
              backgroundColor: `${catMeta.color}18`,
              color: catMeta.color
            }}
          >
            <CategoryIcon iconName={catMeta.icon} size={20} />
          </div>
          <div>
            <div className="mobile-tx-title">{description}</div>
            <div className="mobile-tx-date">{formatDate(date)}</div>
          </div>
        </div>

        <div className="mobile-tx-amount-wrap">
          <div className={`mobile-tx-amount ${isIncome ? 'income' : 'expense'}`}>
            {isIncome ? '+' : '-'} {formatCurrency(amount)}
          </div>
        </div>
      </div>

      <div className="mobile-tx-footer">
        <div className="mobile-tx-badges">
          <span className="badge badge-category">
            {category}
          </span>
          <span className="badge badge-category">
            <CategoryIcon iconName={payMeta.icon} size={13} />
            {paymentMethod}
          </span>
          <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
            {isIncome ? 'Income' : 'Expense'}
          </span>
        </div>

        <div className="mobile-tx-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(transaction)}
            aria-label={`Edit ${description}`}
          >
            <MdEdit size={14} /> Edit
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(transaction)}
            aria-label={`Delete ${description}`}
          >
            <MdDelete size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionItem;
