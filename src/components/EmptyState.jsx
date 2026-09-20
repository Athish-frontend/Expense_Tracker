import { Link } from 'react-router-dom';
import { MdReceiptLong, MdAdd } from 'react-icons/md';

export const EmptyState = ({
  icon: Icon = MdReceiptLong,
  title = 'No transactions yet',
  message = 'Start tracking your finances by adding your first income or expense.',
  actionText = 'Add Transaction',
  actionLink = '/add',
  onAction,
  secondaryActionText,
  onSecondaryAction
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--border-color)',
        minHeight: '240px'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-surface-secondary)',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          marginBottom: '16px'
        }}
      >
        <Icon />
      </div>

      <h3
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--text-main)',
          marginBottom: '6px'
        }}
      >
        {title}
      </h3>

      <p
        style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          maxWidth: '380px',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}
      >
        {message}
      </p>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {actionText && (
          actionLink ? (
            <Link to={actionLink} className="btn btn-primary btn-sm">
              <MdAdd size={16} /> {actionText}
            </Link>
          ) : (
            <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
              {actionText}
            </button>
          )
        )}

        {secondaryActionText && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onSecondaryAction}>
            {secondaryActionText}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
