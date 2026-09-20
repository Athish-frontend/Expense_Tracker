import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { TransactionProvider } from './context/TransactionContext';
import App from './App';

// Global stylesheets
import './styles/global.css';
import './styles/layout.css';
import './styles/dashboard.css';
import './styles/transactions.css';
import './styles/forms.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TransactionProvider>
        <App />
      </TransactionProvider>
    </BrowserRouter>
  </React.StrictMode>
);
