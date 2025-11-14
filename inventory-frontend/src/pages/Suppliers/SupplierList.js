import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supplierService } from '../../services/supplierService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/Loading';
import './SupplierList.css';

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await supplierService.getAll({ search: searchTerm });
      setSuppliers(response.data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await supplierService.delete(id);
        fetchSuppliers();
      } catch (error) {
        alert('Error deleting supplier');
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="supplier-list">
      <div className="page-header">
        <h1>Suppliers</h1>
        <Button onClick={() => navigate('/suppliers/new')}>
          Add New Supplier
        </Button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search suppliers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchSuppliers()}
        />
        <Button onClick={fetchSuppliers}>Search</Button>
      </div>

      <div className="suppliers-grid">
        {suppliers.map((supplier) => (
          <Card key={supplier._id} className="supplier-card">
            <h3>{supplier.name}</h3>
            <p>Email: {supplier.email}</p>
            <p>Phone: {supplier.phone}</p>
            <p>Address: {supplier.address}</p>
            <p>Created At: {new Date(supplier.createdAt).toLocaleDateString()}</p>

            <div className="supplier-actions">
              <Button
                variant="secondary"
                onClick={() => navigate(`/suppliers/${supplier._id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(supplier._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {suppliers.length === 0 && (
        <p className="no-data">No suppliers found</p>
      )}
    </div>
  );
};

export default SupplierList;
