import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { transactionService } from '../../services/transactionService';
import { productService } from '../../services/productService';
import './TransactionForm.css';
import Button from '../../components/common/Button';
import Loading from '../../components/Loading';

const TransactionForm = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: '',
    type: 'in',
    quantity: '',
    date: '',
    notes: '',
    createdAt: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();

    if (id) {
      fetchTransaction(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchTransaction = async (transactionId) => {
    try {
      const response = await transactionService.getById(transactionId);
      setFormData({
        ...response.data,
        createdAt: response.data.createdAt || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await transactionService.update(id, formData);
      } else {
        await transactionService.create(formData);
      }
      navigate('/transactions');
    } catch (error) {
      alert('Error saving transaction');
      console.error(error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="transaction-form">
      <h1>{id ? 'Edit Transaction' : 'New Transaction'}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Product</label>
          <select
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            required
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Type</label>
          <select name="type" value={formData.type} onChange={handleChange} required>
            <option value="in">In</option>
            <option value="out">Out</option>
          </select>
        </div>

        <div className="form-row">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div className="form-row">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date.split('T')[0] || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-actions">
          <Button type="submit">{id ? 'Update' : 'Create'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/transactions')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
