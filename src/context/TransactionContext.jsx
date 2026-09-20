import { useReducer, useEffect, useCallback } from 'react';
import { TransactionContext, TRANSACTION_ACTIONS } from './TransactionContextDefinition';
import { getTransactions, saveTransactions, clearTransactions, getSampleTransactions } from '../utils/storage';

const initialState = {
  transactions: [],
  toast: null
};

const transactionReducer = (state, action) => {
  switch (action.type) {
    case TRANSACTION_ACTIONS.SET_TRANSACTIONS: {
      return {
        ...state,
        transactions: action.payload
      };
    }

    case TRANSACTION_ACTIONS.ADD_TRANSACTION: {
      const newTransactions = [action.payload, ...state.transactions];
      saveTransactions(newTransactions);
      return {
        ...state,
        transactions: newTransactions
      };
    }

    case TRANSACTION_ACTIONS.UPDATE_TRANSACTION: {
      const updatedTransactions = state.transactions.map(t =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      saveTransactions(updatedTransactions);
      return {
        ...state,
        transactions: updatedTransactions
      };
    }

    case TRANSACTION_ACTIONS.DELETE_TRANSACTION: {
      const filteredTransactions = state.transactions.filter(t => t.id !== action.payload);
      saveTransactions(filteredTransactions);
      return {
        ...state,
        transactions: filteredTransactions
      };
    }

    case TRANSACTION_ACTIONS.CLEAR_TRANSACTIONS: {
      clearTransactions();
      return {
        ...state,
        transactions: []
      };
    }

    case TRANSACTION_ACTIONS.SHOW_TOAST: {
      return {
        ...state,
        toast: action.payload
      };
    }

    case TRANSACTION_ACTIONS.HIDE_TOAST: {
      return {
        ...state,
        toast: null
      };
    }

    default:
      return state;
  }
};

export const TransactionProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionReducer, initialState);

  // Initial Load from localStorage
  useEffect(() => {
    const loaded = getTransactions();
    dispatch({
      type: TRANSACTION_ACTIONS.SET_TRANSACTIONS,
      payload: loaded
    });
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    dispatch({
      type: TRANSACTION_ACTIONS.SHOW_TOAST,
      payload: { id: Date.now(), message, type }
    });
  }, []);

  const hideToast = useCallback(() => {
    dispatch({ type: TRANSACTION_ACTIONS.HIDE_TOAST });
  }, []);

  const addTransaction = useCallback((transactionData) => {
    const newTx = {
      ...transactionData,
      id: transactionData.id || `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      amount: Number(transactionData.amount)
    };
    dispatch({
      type: TRANSACTION_ACTIONS.ADD_TRANSACTION,
      payload: newTx
    });
    showToast('✓ Transaction added successfully', 'success');
    return newTx;
  }, [showToast]);

  const updateTransaction = useCallback((transactionData) => {
    const updatedTx = {
      ...transactionData,
      amount: Number(transactionData.amount)
    };
    dispatch({
      type: TRANSACTION_ACTIONS.UPDATE_TRANSACTION,
      payload: updatedTx
    });
    showToast('✓ Transaction updated successfully', 'success');
    return updatedTx;
  }, [showToast]);

  const deleteTransaction = useCallback((id) => {
    dispatch({
      type: TRANSACTION_ACTIONS.DELETE_TRANSACTION,
      payload: id
    });
    showToast('✓ Transaction deleted successfully', 'success');
  }, [showToast]);

  const clearAllTransactions = useCallback(() => {
    dispatch({ type: TRANSACTION_ACTIONS.CLEAR_TRANSACTIONS });
    showToast('All transactions cleared', 'info');
  }, [showToast]);

  const loadSampleData = useCallback(() => {
    const samples = getSampleTransactions();
    saveTransactions(samples);
    dispatch({
      type: TRANSACTION_ACTIONS.SET_TRANSACTIONS,
      payload: samples
    });
    showToast('✓ Demo transactions loaded successfully', 'success');
  }, [showToast]);

  const value = {
    transactions: state.transactions,
    toast: state.toast,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    clearAllTransactions,
    loadSampleData,
    showToast,
    hideToast
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionProvider;
