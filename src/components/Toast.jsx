import { useEffect } from 'react';
import { MdClose, MdCheckCircle, MdError, MdInfo } from 'react-icons/md';
import { useTransactions } from '../hooks/useTransactions';

export const Toast = () => {
  const { toast, hideToast } = useTransactions();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <MdError size={20} />;
      case 'info':
        return <MdInfo size={20} />;
      case 'success':
      default:
        return <MdCheckCircle size={20} />;
    }
  };

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast toast-${toast.type || 'success'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {getIcon()}
          <span>{toast.message}</span>
        </div>
        <button
          type="button"
          className="toast-close"
          onClick={hideToast}
          aria-label="Close notification"
        >
          <MdClose />
        </button>
      </div>
    </div>
  );
};

export default Toast;
