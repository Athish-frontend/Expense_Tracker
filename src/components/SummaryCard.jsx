import { formatCurrency } from '../utils/formatters';

export const SummaryCard = ({
  title,
  amount,
  type = 'balance',
  subtext,
  icon: Icon
}) => {
  const isNegative = amount < 0;
  const displayAmount = formatCurrency(Math.abs(amount));

  let valueClass = '';
  if (type === 'income') valueClass = 'income';
  else if (type === 'expense') valueClass = 'expense';

  return (
    <div className={`summary-card ${type}`}>
      <div className="summary-card-info">
        <span className="summary-card-label">{title}</span>
        <div className={`summary-card-value ${valueClass}`}>
          {isNegative && '- '}
          {displayAmount}
        </div>
        {subtext && <span className="summary-card-subtext">{subtext}</span>}
      </div>

      {Icon && (
        <div className="summary-card-icon-wrap" aria-hidden="true">
          <Icon />
        </div>
      )}
    </div>
  );
};

export default SummaryCard;
