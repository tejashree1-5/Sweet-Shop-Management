import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

  useEffect(() => {
    filterSweets();
  }, [sweets, searchTerm, categoryFilter, minPrice, maxPrice]);

  const fetchSweets = async () => {
    try {
      const response = await axios.get('/api/sweets');
      setSweets(response.data);
      setFilteredSweets(response.data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSweets = () => {
    let filtered = [...sweets];

    if (searchTerm) {
      filtered = filtered.filter(sweet =>
        sweet.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(sweet =>
        sweet.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    if (minPrice) {
      filtered = filtered.filter(sweet => sweet.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
      filtered = filtered.filter(sweet => sweet.price <= parseFloat(maxPrice));
    }

    setFilteredSweets(filtered);
  };

  const handlePurchase = async (sweetId) => {
    try {
      await axios.post(`/api/sweets/${sweetId}/purchase`);
      setMessage('Purchase successful!');
      setTimeout(() => setMessage(''), 3000);
      fetchSweets();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Purchase failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const categories = [...new Set(sweets.map(sweet => sweet.category))];

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>Sweet Shop</h1>
          <div className="header-actions">
            {user?.role === 'admin' && (
              <button
                className="btn btn-primary"
                onClick={() => navigate('/admin')}
              >
                Admin Panel
              </button>
            )}
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        {message && (
          <div className={`alert ${message.includes('failed') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        {loading ? (
          <div>Loading sweets...</div>
        ) : filteredSweets.length === 0 ? (
          <div className="card">
            <p>No sweets found matching your criteria.</p>
          </div>
        ) : (
          <div className="sweet-grid">
            {filteredSweets.map(sweet => (
              <div key={sweet._id} className="sweet-card">
                <h3>{sweet.name}</h3>
                <div className="category">{sweet.category}</div>
                <div className="price">${sweet.price.toFixed(2)}</div>
                <div className="quantity">
                  {sweet.quantity > 0 ? (
                    <span style={{ color: '#28a745' }}>In Stock: {sweet.quantity}</span>
                  ) : (
                    <span style={{ color: '#dc3545' }}>Out of Stock</span>
                  )}
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => handlePurchase(sweet._id)}
                  disabled={sweet.quantity === 0}
                  style={{ width: '100%' }}
                >
                  {sweet.quantity > 0 ? 'Purchase' : 'Out of Stock'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

