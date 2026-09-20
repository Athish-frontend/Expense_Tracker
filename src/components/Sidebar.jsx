import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdReceiptLong,
  MdAddCircleOutline,
  MdCategory,
  MdClose,
  MdAccountBalanceWallet
} from 'react-icons/md';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: MdDashboard, end: true },
    { to: '/transactions', label: 'Transactions', icon: MdReceiptLong },
    { to: '/add', label: 'Add Transaction', icon: MdAddCircleOutline },
    { to: '/categories', label: 'Categories', icon: MdCategory }
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="brand" onClick={onClose}>
            <div className="brand-icon">
              <MdAccountBalanceWallet />
            </div>
            <span>ExpenseTracker</span>
          </NavLink>
          {isOpen && (
            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              aria-label="Close menu"
              style={{ display: 'flex' }}
            >
              <MdClose size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon className="nav-icon" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/add" className="btn btn-primary sidebar-footer-btn" onClick={onClose}>
            <MdAddCircleOutline size={18} /> New Entry
          </NavLink>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
    </>
  );
};

export default Sidebar;
