import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { transactionService } from '../../services/transactionService';
import { productService } from '../../services/productService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/Loading';
import './TransactionList.css';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterType, setFilterType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchTransactions();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionService.getAll({
        search: searchTerm,
        productId: filterProduct,
        type: filterType,
      });
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        fetchTransactions();
      } catch (error) {
        alert('Error deleting transaction');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="transaction-list">
      <div className="page-header">
        <h1>Transactions</h1>
        <Button onClick={() => navigate('/transactions/new')}>New Transaction</Button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchTransactions()}
        />

        <select value={filterProduct} onChange={(e) => setFilterProduct(e.target.value)}>
          <option value="">All Products</option>
          {products.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          <option value="in">In</option>
          <option value="out">Out</option>
        </select>

        <Button onClick={fetchTransactions}>Filter</Button>
      </div>

      <div className="transactions-grid">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <Card key={transaction._id} className="transaction-card">
              <p>
                <strong>Product:</strong>{' '}
                {transaction.productId
                  ? transaction.productId.name || transaction.productId._id
                  : 'N/A'}
              </p>
              <p>
                <strong>Type:</strong>{' '}
                <span className={transaction.type === 'out' ? 'out-type' : 'in-type'}>
                  {transaction.type ? transaction.type.toUpperCase() : 'N/A'}
                </span>
              </p>
              <p>
                <strong>Quantity:</strong> {transaction.quantity || 0}
              </p>
              <p>
                <strong>Date:</strong>{' '}
                {transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}
              </p>
              {transaction.notes && <p><strong>Notes:</strong> {transaction.notes}</p>}
              <p>
                <strong>Created At:</strong>{' '}
                {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'N/A'}
              </p>
              <div className="transaction-actions">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/transactions/${transaction._id}/edit`)}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(transaction._id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="no-data">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
