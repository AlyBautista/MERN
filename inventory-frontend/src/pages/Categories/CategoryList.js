import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../services/categoryService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/Loading';
import './CategoryList.css';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll({ search: searchTerm });
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.delete(id);
        fetchCategories();
      } catch (error) {
        alert('Error deleting category');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="category-list">
      <div className="page-header">
        <h1>Categories</h1>
        <Button onClick={() => navigate('/categories/new')}>
          Add New Category
        </Button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && fetchCategories()}
        />
        <Button onClick={fetchCategories}>Search</Button>
      </div>

      <div className="categories-grid">
        {categories.map((cat) => (
          <Card key={cat._id} className="category-card">
            <h3>{cat.name}</h3>
            <p className="category-date">Created: {new Date(cat.createdAt).toLocaleDateString()}</p>
            <p className="category-description">{cat.description || 'No description'}</p>
            <div className="category-actions">
              <Button
                variant="secondary"
                onClick={() => navigate(`/categories/${cat._id}`)}
              >
                View
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate(`/categories/${cat._id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(cat._id)}
              >
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="no-data">No categories found</p>
      )}
    </div>
  );
};

export default CategoryList;
