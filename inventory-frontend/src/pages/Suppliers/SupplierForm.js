import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierService } from '../../services/supplierService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/Loading';
import './SupplierForm.css';

const SupplierForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    createdAt: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) fetchSupplier();
  }, [id]);

  const fetchSupplier = async () => {
    setLoading(true);
    try {
      const response = await supplierService.getById(id);
      const supplier = response.data;
      setFormData({
        name: supplier.name || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || '',
        createdAt: supplier.createdAt
          ? supplier.createdAt.slice(0, 10)
          : new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setError('Error loading supplier');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
      };

      if (isEdit) {
        await supplierService.update(id, data);
      } else {
        await supplierService.create(data);
      }

      navigate('/suppliers');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving supplier');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="supplier-form">
      <Card title={isEdit ? 'Edit Supplier' : 'Add New Supplier'}>
        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <Input
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />

    
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/suppliers')}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SupplierForm;
