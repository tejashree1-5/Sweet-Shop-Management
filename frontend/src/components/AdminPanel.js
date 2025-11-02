import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: ''
  });
  const [message, setMessage] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSweets();
  }, []);

  const fetchSweets = async () => {
    try {
      const response = await axios.get('/api/sweets');
      setSweets(response.data);
    } catch (error) {
      console.error('Error fetching sweets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingSweet) {
        await axios.put(`/api/sweets/${editingSweet._id}`, formData);
        setMessage('Sweet updated successfully!');
      } else {
        await axios.post('/api/sweets', formData);
        setMessage('Sweet added successfully!');
      }
      setShowForm(false);
      setEditingSweet(null);
      setFormData({ name: '', category: '', price: '', quantity: '' });
      fetchSweets();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Operation failed');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleEdit = (sweet) => {
    setEditingSweet(sweet);
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      try {
        await axios.delete(`/api/sweets/${sweetId}`);
        setMessage('Sweet deleted successfully!');
        fetchSweets();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Delete failed');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const handleRestock = async (sweetId) => {
    const quantity = prompt('Enter quantity to add:');
    if (quantity && parseInt(quantity) > 0) {
      try {
        await axios.post(`/api/sweets/${sweetId}/restock`, { quantity: parseInt(quantity) });
        setMessage('Restocked successfully!');
        fetchSweets();
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Restock failed');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingSweet(null);
    setFormData({ name: '', category: '', price: '', quantity: '' });
  };

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <h1>Admin Panel - Sweet Shop Management</h1>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
              View Shop
            </button>
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

        <div className="admin-header">
          <h2>Sweets Management</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            Add New Sweet
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h3>{editingSweet ? 'Edit Sweet' : 'Add New Sweet'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  {editingSweet ? 'Update' : 'Add'} Sweet
                </button>
                <button type="button" className="btn btn-danger" onClick={cancelForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sweets.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>
                      No sweets found. Add your first sweet!
                    </td>
                  </tr>
                ) : (
                  sweets.map(sweet => (
                    <tr key={sweet._id}>
                      <td>{sweet.name}</td>
                      <td>{sweet.category}</td>
                      <td>${sweet.price.toFixed(2)}</td>
                      <td>{sweet.quantity}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEdit(sweet)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleRestock(sweet._id)}
                          >
                            Restock
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(sweet._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

