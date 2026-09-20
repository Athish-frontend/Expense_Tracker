import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MdTrendingDown, MdTrendingUp, MdAdd, MdLabel } from 'react-icons/md';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES, getCategoryMeta } from '../data/categories';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatters';
import CategoryIcon from '../components/CategoryIcon';

export const Categories = () => {
  const { transactions } = useTransactions();

  // Compute category transaction statistics
  const stats = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      const cat = t.category;
      if (!map[cat]) {
        map[cat] = { count: 0, total: 0, type: t.type };
      }
      map[cat].count += 1;
      map[cat].total += Number(t.amount) || 0;
    });
    return map;
  }, [transactions]);

  // Identify any user-defined custom categories
  const customCategories = useMemo(() => {
    const predefinedNames = ALL_CATEGORIES.map(c => c.name.toLowerCase());
    const customList = [];

    Object.keys(stats).forEach(catName => {
      if (!predefinedNames.includes(catName.toLowerCase()) && catName.toLowerCase() !== 'other') {
        const meta = getCategoryMeta(catName, stats[catName].type);
        customList.push({
          id: catName,
          name: catName,
          icon: meta.icon,
          color: meta.color,
          description: `Custom ${stats[catName].type} tag`,
          type: stats[catName].type,
          count: stats[catName].count,
          total: stats[catName].total
        });
      }
    });

    return customList;
  }, [stats]);

  return (
    <div className="categories-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories Overview</h1>
          <p className="page-subtitle">Standard and custom tag categories organized by Expense and Income types</p>
        </div>

        <Link to="/add" className="btn btn-primary">
          <MdAdd size={18} /> Add Transaction
        </Link>
      </div>

      {/* User Custom Tags Section (if any exist) */}
      {customCategories.length > 0 && (
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MdLabel size={20} />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
              Custom Category Tags ({customCategories.length})
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px'
            }}
          >
            {customCategories.map((cat) => {
              const isIncome = cat.type === 'income';
              return (
                <div
                  key={cat.id}
                  className="card"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '18px'
                  }}
                >
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: `${cat.color}15`,
                      color: cat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '22px',
                      flexShrink: 0
                    }}
                  >
                    <CategoryIcon iconName={cat.icon} size={22} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                        {cat.name}
                      </h3>
                      <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`} style={{ fontSize: '11px' }}>
                        {isIncome ? 'Income' : 'Expense'} Tag
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '10px' }}>
                      {cat.description}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        borderTop: '1px solid var(--border-light)',
                        paddingTop: '8px'
                      }}
                    >
                      <span>{cat.count} {cat.count === 1 ? 'transaction' : 'transactions'}</span>
                      <strong style={{ color: isIncome ? 'var(--color-income)' : 'var(--color-expense)', fontWeight: 700 }}>
                        {formatCurrency(cat.total)}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Expense Categories Section */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-expense-light)',
              color: 'var(--color-expense)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MdTrendingDown size={20} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Expense Categories ({EXPENSE_CATEGORIES.length})
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {EXPENSE_CATEGORIES.map((cat) => {
            const catStat = stats[cat.name] || { count: 0, total: 0 };
            return (
              <div
                key={cat.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '18px'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0
                  }}
                >
                  <CategoryIcon iconName={cat.icon} size={22} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {cat.name}
                    </h3>
                    <span className="badge badge-expense" style={{ fontSize: '11px' }}>
                      Expense
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '10px' }}>
                    {cat.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '8px'
                    }}
                  >
                    <span>{catStat.count} {catStat.count === 1 ? 'transaction' : 'transactions'}</span>
                    <strong style={{ color: 'var(--color-expense)', fontWeight: 700 }}>
                      {formatCurrency(catStat.total)}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Income Categories Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-income-light)',
              color: 'var(--color-income)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MdTrendingUp size={20} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>
            Income Categories ({INCOME_CATEGORIES.length})
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}
        >
          {INCOME_CATEGORIES.map((cat) => {
            const catStat = stats[cat.name] || { count: 0, total: 0 };
            return (
              <div
                key={cat.id}
                className="card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '18px'
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '22px',
                    flexShrink: 0
                  }}
                >
                  <CategoryIcon iconName={cat.icon} size={22} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {cat.name}
                    </h3>
                    <span className="badge badge-income" style={{ fontSize: '11px' }}>
                      Income
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: '10px' }}>
                    {cat.description}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '8px'
                    }}
                  >
                    <span>{catStat.count} {catStat.count === 1 ? 'transaction' : 'transactions'}</span>
                    <strong style={{ color: 'var(--color-income)', fontWeight: 700 }}>
                      {formatCurrency(catStat.total)}
                    </strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
