# ExpenseTracker - Personal Finance Tracker MVP

A complete, production-quality, responsive Personal Expense Tracker web application built with **React**, **Vite**, **Context API + useReducer**, **Recharts**, **date-fns**, and **React Icons**.

---

## 🌟 Project Overview

ExpenseTracker provides individuals with a clean, intuitive, and modern financial management interface to track daily expenses, log income streams, view automated cash-flow dashboards, and filter historical records seamlessly.

---

## 🚀 Features

- **Dynamic Financial Dashboard**:
  - Real-time **Total Balance** (\(Balance = Total Income - Total Expenses\)).
  - Real-time **Total Income** and **Total Expenses** breakdown.
  - **Income vs Expenses Trend Chart** powered by Recharts.
  - **Expenses by Category Donut Chart** with percentage shares and interactive tooltips.
  - **Recent Transactions** preview with quick links.
- **Transaction Management (Full CRUD)**:
  - **Add Transactions**: Dynamic form supporting both Expense and Income with automatic category switching.
  - **Edit Transactions**: Populates existing values and updates all metrics and charts instantly.
  - **Delete Transactions**: Safe deletion guarded by an accessible confirmation dialog.
- **Search, Filtering & Sorting**:
  - **Instant Search**: Search across descriptions, categories, and payment methods simultaneously.
  - **Type Filter**: Filter by All, Income, or Expense.
  - **Category Filter**: Dynamically populated based on selected type.
  - **Date Filters**: Predefined presets (*All Time*, *Today*, *This Week*, *This Month*) + *Custom Date Range* (From / To).
  - **Amount Filter**: Minimum and Maximum amount range filters.
  - **Sorting**: Newest First, Oldest First, Highest Amount, Lowest Amount.
  - **Clear Filters**: One-click reset for all active filters.
- **Categories Catalog**:
  - Comprehensive view of 9 Expense and 6 Income categories with icons, color indicators, transaction counts, and cumulative amounts.
- **Persistence & Resilience**:
  - Automatic synchronization with browser `localStorage`.
  - Defensive parsing that handles corrupted or invalid storage data gracefully without crashing.
- **UX & Feedback**:
  - Animated toast notification system for additions, updates, deletions, and resets.
  - Form validation with descriptive inline error messages.
  - Polished empty states when no records or search results match.
- **Responsive & Accessible**:
  - Desktop sidebar + mobile collapsible drawer with backdrop.
  - Responsive table on desktop and touch-friendly card view on mobile devices.
  - Semantic HTML, keyboard accessibility, and accessible focus outlines.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React.js (v18)** | Frontend UI framework |
| **Vite** | Blazing-fast build tool and dev server |
| **JavaScript (ES6+)** | Modern JavaScript standard |
| **React Router DOM (v6)** | Client-side routing and navigation |
| **Context API + useReducer** | Predictable global state management |
| **CSS3** | Vanilla modular styling with CSS custom properties |
| **React Icons** | Clean vector iconography (Material Design icons) |
| **date-fns** | Robust date formatting, comparison, and interval handling |
| **Recharts** | Declarative charting library for data visualizations |
| **localStorage** | Client-side persistence |
| **ESLint** | Code quality and React standards enforcement |

---

## 📁 Project Structure

```text
Expense/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── CategoryIcon.jsx     # Dynamic category and payment icon renderer
│   │   ├── ConfirmDialog.jsx    # Accessible modal confirmation dialog
│   │   ├── EmptyState.jsx       # Reusable empty state with CTA
│   │   ├── FilterBar.jsx        # Multi-criteria filter and sort controls
│   │   ├── Navbar.jsx           # Top header with mobile menu toggle
│   │   ├── SearchBar.jsx        # Real-time search input with clear button
│   │   ├── Sidebar.jsx          # Desktop/mobile navigation sidebar
│   │   ├── SummaryCard.jsx      # Metric summary card for balance/income/expense
│   │   ├── Toast.jsx            # Animated auto-dismiss notification toast
│   │   ├── TransactionForm.jsx  # Add/Edit form with validation
│   │   ├── TransactionItem.jsx  # Desktop table row & mobile card view
│   │   └── TransactionList.jsx  # Table / card list container
│   ├── context/
│   │   └── TransactionContext.jsx # Global useReducer state & actions
│   ├── data/
│   │   ├── categories.js        # Expense & Income predefined categories
│   │   └── paymentMethods.js    # Payment methods (Cash, UPI, Card, etc.)
│   ├── hooks/
│   │   └── useTransactions.js   # Custom hook for transaction state
│   ├── pages/
│   │   ├── AddTransaction.jsx   # Add transaction page
│   │   ├── Categories.jsx       # Categories catalog page
│   │   ├── Dashboard.jsx        # Financial overview dashboard & charts
│   │   └── Transactions.jsx     # Transaction history, search & filter page
│   ├── styles/
│   │   ├── dashboard.css        # Dashboard and chart styles
│   │   ├── forms.css            # Form layout and input validation styles
│   │   ├── global.css           # Design tokens, resets, utilities
│   │   ├── layout.css           # Sidebar, navbar, mobile drawer styles
│   │   └── transactions.css     # History table, cards, and filter styles
│   ├── utils/
│   │   ├── calculations.js      # Pure calculation, filter, and sort functions
│   │   ├── formatters.js        # Currency (₹ INR) and date formatting helpers
│   │   └── storage.js           # Defensive localStorage reader and writer
│   ├── App.jsx                  # Main routing layout
│   └── main.jsx                 # Application entry point
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML template
├── package.json
└── README.md
```

---

## ⚡ Installation & Setup

### 1. Prerequisites
Ensure you have **Node.js (v18 or newer)** and **npm** installed on your machine.

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

### 5. Run Lint Check
```bash
npm run lint
```

---

## 📖 Usage Guide

1. **Dashboard (`/`)**:
   - Inspect dynamic balances, income vs expense monthly trends, and expense category breakdown.
   - Click **"Load Demo Data"** in the top bar if you want to quickly explore with pre-populated sample transactions.
2. **Add Transaction (`/add`)**:
   - Select **Expense** or **Income**.
   - Input amount, select category, choose payment method (UPI, Cash, Credit Card, Debit Card, Bank Transfer, Other), add a description, and select the date.
   - Click **Add Transaction** to save.
3. **Transaction History (`/transactions`)**:
   - Search by keyword or apply multi-dimensional filters (type, category, payment method, date range, amount range).
   - Click the **Edit icon** on any transaction to modify its fields.
   - Click the **Delete icon** to bring up the confirmation modal.
4. **Categories (`/categories`)**:
   - View expense and income categories with total usage metrics and amounts.

---

## 💾 LocalStorage Persistence

- **Key**: `expenseTrackerTransactions`
- Stored as a serialized JSON array of transaction objects:
  ```json
  [
    {
      "id": "tx_1726849200000_abc12",
      "type": "expense",
      "amount": 500,
      "category": "Food",
      "paymentMethod": "UPI",
      "description": "Lunch with Team",
      "date": "2026-09-20"
    }
  ]
  ```
- All state changes (add, edit, delete, clear) are synchronized to `localStorage` automatically via `src/utils/storage.js`.

---

## 🔮 Future Architecture & Backend Migration

The architecture strictly decouples UI components and state logic from storage implementation:
- `TransactionContext` dispatches pure actions.
- LocalStorage logic is contained within `src/utils/storage.js`.
- Future integration with a backend (e.g. Node.js/Express, Python/FastAPI, PostgreSQL/MySQL, or Supabase) can be achieved simply by replacing `src/utils/storage.js` with standard `fetch`/`axios` asynchronous REST API service calls without restructuring components.
