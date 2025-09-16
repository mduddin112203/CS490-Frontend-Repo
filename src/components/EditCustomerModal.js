import React, { useState, useEffect } from 'react';
import { customersAPI } from '../services/api';

const EditCustomerModal = ({ isOpen, onClose, onSuccess, customer }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    active: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form data when customer prop changes
  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        email: customer.email || '',
        active: customer.active !== undefined ? customer.active : 1,
      });
    }
  }, [customer]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await customersAPI.updateCustomer(customer.customer_id, formData);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError('Failed to update customer.');
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#1e1e1e', padding: 24, borderRadius: 8, width: 420 }}>
        <h2 style={{ marginTop: 0 }}>Edit Customer</h2>
        {error && <div style={{ background: '#b00020', color: 'white', padding: 8, borderRadius: 4, marginBottom: 12 }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: 12 }}>
            <input
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="First name"
              required
            />
            <input
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Last name"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#fff' }}>
              <input
                type="checkbox"
                name="active"
                checked={formData.active === 1}
                onChange={handleChange}
              />
              Active Customer
            </label>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCustomerModal;
