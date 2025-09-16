import React, { useState } from 'react';
import { customersAPI } from '../services/api';
import './AddCustomerModal.css';

const AddCustomerModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    district: '',
    city: '',
    country: '',
    phone: '',
    store_id: '1'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await customersAPI.createCustomer(formData);
      onSuccess();
      onClose();
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        district: '',
        city: '',
        country: '',
        phone: '',
        store_id: '1'
      });
    } catch (err) {
      setError('Failed to create customer. Please try again.');
      console.error('Error creating customer:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Customer</h2>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name" className="form-label">First Name:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name" className="form-label">Last Name:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address" className="form-label">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="district" className="form-label">District:</label>
              <input
                type="text"
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city" className="form-label">City:</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country" className="form-label">Country:</label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone:</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="store_id" className="form-label">Store:</label>
            <select
              id="store_id"
              name="store_id"
              value={formData.store_id}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="1">Store 1</option>
              <option value="2">Store 2</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Customer'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCustomerModal;