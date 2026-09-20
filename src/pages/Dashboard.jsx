import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdTrendingDown,
  MdArrowForward,
  MdPieChart,
  MdBarChart,
  MdAdd
} from 'react-icons/md';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTransactions } from '../hooks/useTransactions';
import {
  calculateBalance,
  calculateTotalIncome,
  calculateTotalExpenses,
  calculateCategoryTotals,
  calculateMonthlyTrend,
  sortTransactions
} from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/formatters';
import { getCategoryMeta } from '../data/categories';
import SummaryCard from '../components/SummaryCard';
import CategoryIcon from '../components/CategoryIcon';
import EmptyState from '../components/EmptyState';

// Custom Chart Tooltips
const CustomMonthlyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-title">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="custom-tooltip-row" style={{ color: entry.color }}>
            <span>{entry.name}:</span>
            <span>{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomCategoryTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="custom-tooltip">
        <p className="custom-tooltip-title">{data.name}</p>
        <div className="custom-tooltip-row" style={{ color: data.payload.fill }}>
          <span>Amount:</span>
          <span>{formatCurrency(data.value)}</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Share: {data.payload.percentage}% ({data.payload.count} {data.payload.count === 1 ? 'transaction' : 'transactions'})
        </div>
      </div>
    );
  }
  return null;
};

export const Dashboard = () => {
  const { transactions } = useTransactions();

  // Dynamic calculations
  const totalBalance = useMemo(() => calculateBalance(transactions), [transactions]);
  const totalIncome = useMemo(() => calculateTotalIncome(transactions), [transactions]);
  const totalExpenses = useMemo(() => calculateTotalExpenses(transactions), [transactions]);

  const expenseCategoryData = useMemo(() => {
    const raw = calculateCategoryTotals(transactions, 'expense');
    return raw.map(item => {
      const meta = getCategoryMeta(item.category, 'expense');
      return {
        ...item,
        name: item.category,
        value: item.amount,
        color: meta.color
      };
    });
  }, [transactions]);

  const monthlyTrendData = useMemo(() => {
    return calculateMonthlyTrend(transactions);
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    const sorted = sortTransactions(transactions, 'newest');
    return sorted.slice(0, 5);
  }, [transactions]);

  const hasTransactions = transactions.length > 0;
  const hasExpenses = expenseCategoryData.length > 0;

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Financial Dashboard</h1>
          <p className="page-subtitle">Overview of your income, expenses, and current cash flow</p>
        </div>

        <Link to="/add" className="btn btn-primary">
          <MdAdd size={18} /> Add Transaction
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-grid">
        <SummaryCard
          title="Total Balance"
          amount={totalBalance}
          type="balance"
          subtext="Net balance across all accounts"
          icon={MdAccountBalanceWallet}
        />
        <SummaryCard
          title="Total Income"
          amount={totalIncome}
          type="income"
          subtext="All incoming earnings & cash"
          icon={MdTrendingUp}
        />
        <SummaryCard
          title="Total Expenses"
          amount={totalExpenses}
          type="expense"
          subtext="All outgoing spending & bills"
          icon={MdTrendingDown}
        />
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Income vs Expense Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Income vs Expenses Overview</h2>
          </div>

          <div className="chart-container">
            {hasTransactions ? (
              <ResponsiveContainer width="100%" height={290}>
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                  />
                  <Tooltip content={<CustomMonthlyTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px', fontSize: '13px' }}
                  />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={32} />
                  <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={MdBarChart}
                title="No chart data"
                message="Not enough data to display this chart. Add income or expense records to visualize your cashflow."
                actionText=""
              />
            )}
          </div>
        </div>

        {/* Expense by Category Donut Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Expenses by Category</h2>
          </div>

          <div className="chart-container">
            {hasExpenses ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomCategoryTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Category Breakdown Legend */}
                <div className="category-legend-list">
                  {expenseCategoryData.map((cat) => (
                    <div key={cat.category} className="category-legend-item">
                      <div className="category-legend-label">
                        <span className="category-color-dot" style={{ backgroundColor: cat.color }} />
                        <span>{cat.category}</span>
                      </div>
                      <div className="category-legend-value">
                        {formatCurrency(cat.amount)} <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '12px' }}>({cat.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyState
                icon={MdPieChart}
                title="No expense data"
                message="Not enough data to display this chart. Add expense transactions to see spending breakdown."
                actionText=""
              />
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="dashboard-bottom">
        <div className="recent-transactions-card">
          <div className="recent-transactions-header">
            <div>
              <h2 className="chart-title">Recent Transactions</h2>
              <p className="page-subtitle">Your latest recorded financial entries</p>
            </div>

            {hasTransactions && (
              <Link to="/transactions" className="btn btn-secondary btn-sm">
                View All Transactions <MdArrowForward size={16} />
              </Link>
            )}
          </div>

          {recentTransactions.length > 0 ? (
            <div className="recent-tx-list">
              {recentTransactions.map((tx) => {
                const isIncome = tx.type === 'income';
                const catMeta = getCategoryMeta(tx.category, tx.type);

                return (
                  <div key={tx.id} className="recent-tx-item">
                    <div className="recent-tx-left">
                      <div
                        className="recent-tx-icon-wrap"
                        style={{
                          backgroundColor: `${catMeta.color}15`,
                          color: catMeta.color
                        }}
                      >
                        <CategoryIcon iconName={catMeta.icon} size={20} />
                      </div>
                      <div className="recent-tx-details">
                        <span className="recent-tx-desc">{tx.description}</span>
                        <div className="recent-tx-meta">
                          <span>{tx.category}</span>
                          <span className="recent-tx-meta-dot" />
                          <span>{tx.paymentMethod}</span>
                          <span className="recent-tx-meta-dot" />
                          <span>{formatDate(tx.date)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="recent-tx-right">
                      <span className={`recent-tx-amount ${isIncome ? 'income' : 'expense'}`}>
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount)}
                      </span>
                      <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
                        {isIncome ? 'Income' : 'Expense'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No transactions yet"
              message="Start tracking your finances by adding your first income or expense."
              actionText="Add Transaction"
              actionLink="/add"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
