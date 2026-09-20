import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import TransactionForm from '../components/TransactionForm';

export const AddTransaction = () => {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();

  const handleFormSubmit = (data) => {
    addTransaction(data);
    navigate('/transactions');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="add-transaction-page">
      <TransactionForm
        onSubmit={handleFormSubmit}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
};

export default AddTransaction;
