import { Link } from 'react-router-dom';
import { MdMenu, MdAdd, MdAutoAwesome } from 'react-icons/md';
import { useTransactions } from '../hooks/useTransactions';

export const Navbar = ({ onToggleSidebar }) => {
  const { transactions, loadSampleData } = useTransactions();

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <MdMenu />
        </button>

        <div className="navbar-greeting">
          Welcome back! You have <span>{transactions.length}</span> {transactions.length === 1 ? 'transaction' : 'transactions'} recorded.
        </div>
      </div>

      <div className="navbar-right">
        {transactions.length === 0 && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadSampleData}
            title="Load sample transactions for demonstration"
          >
            <MdAutoAwesome /> Load Demo Data
          </button>
        )}

        <Link to="/add" className="btn btn-primary btn-sm">
          <MdAdd size={18} /> Add Transaction
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
