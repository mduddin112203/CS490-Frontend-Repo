import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customersAPI } from '../services/api';
import './CustomerDetails.css';

const CustomerDetails = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    district: '',
    city: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await customersAPI.getCustomerById(id);
        setCustomer(response.data);
        
        // Initialize edit form with customer data
        setEditForm({
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          address: response.data.address,
          district: response.data.district,
          city: response.data.city,
          country: response.data.country,
          phone: response.data.phone
        });
      } catch (err) {
        setError('Failed to load customer details. Please try again later.');
        console.error('Error fetching customer details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  const handleReturnRental = async (rentalId) => {
    if (!window.confirm('Are you sure you want to mark this rental as returned?')) {
      return;
    }

    try {
      await customersAPI.returnRental(id, rentalId);
      setSuccessMessage('Rental returned successfully!');
      
      // Refresh customer data
      const response = await customersAPI.getCustomerById(id);
      setCustomer(response.data);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to return rental. Please try again later.');
      console.error('Error returning rental:', err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await customersAPI.updateCustomer(id, editForm);
      setSuccessMessage('Customer updated successfully!');
      setShowEditForm(false);
      
      // Refresh customer data
      const response = await customersAPI.getCustomerById(id);
      setCustomer(response.data);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update customer. Please try again later.');
      console.error('Error updating customer:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      return;
    }

    try {
      await customersAPI.deleteCustomer(id);
      setSuccessMessage('Customer deleted successfully!');
      
      // Redirect to customers page after a short delay
      setTimeout(() => {
        window.location.href = '/customers';
      }, 2000);
    } catch (err) {
      setError('Failed to delete customer. Please try again later.');
      console.error('Error deleting customer:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading customer details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/customers" className="btn btn-primary">
          Back to Customers
        </Link>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="error">
        <h2>Customer Not Found</h2>
        <p>The requested customer could not be found.</p>
        <Link to="/customers" className="btn btn-primary">
          Back to Customers
        </Link>
      </div>
    );
  }

  const activeRentals = customer.rental_history?.filter(rental => rental.status === 'Rented') || [];
  const returnedRentals = customer.rental_history?.filter(rental => rental.status === 'Returned') || [];

  return (
    <div className="customer-details-page">
      <div className="breadcrumb">
        <Link to="/customers" className="breadcrumb-link">Customers</Link>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{customer.first_name} {customer.last_name}</span>
      </div>

      {successMessage && (
        <div className="success">
          <p>{successMessage}</p>
        </div>
      )}

      <div className="customer-header">
        <div className="customer-avatar">
          <div className="avatar-placeholder">
            <span className="avatar-icon">USER</span>
          </div>
        </div>
        
        <div className="customer-info">
          <h1 className="customer-name">
            {customer.first_name} {customer.last_name}
          </h1>
          <div className="customer-meta">
            <span className={`status-badge ${customer.active ? 'active' : 'inactive'}`}>
              {customer.active ? 'Active Member' : 'Inactive Member'}
            </span>
            <span className="member-since">
              Member since {new Date(customer.create_date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="customer-details-grid">
            <div className="detail-item">
              <strong>Customer ID:</strong>
              <span>{customer.customer_id}</span>
            </div>
            <div className="detail-item">
              <strong>Email:</strong>
              <span>{customer.email}</span>
            </div>
            <div className="detail-item">
              <strong>Address:</strong>
              <span>{customer.address}</span>
            </div>
            <div className="detail-item">
              <strong>District:</strong>
              <span>{customer.district}</span>
            </div>
            <div className="detail-item">
              <strong>City:</strong>
              <span>{customer.city}</span>
            </div>
            <div className="detail-item">
              <strong>Country:</strong>
              <span>{customer.country}</span>
            </div>
            <div className="detail-item">
              <strong>Phone:</strong>
              <span>{customer.phone}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="customer-content">
        {/* Active Rentals */}
        <div className="content-section">
          <h2>Active Rentals ({activeRentals.length})</h2>
          {activeRentals.length > 0 ? (
            <div className="rentals-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Rental ID</th>
                    <th>Film</th>
                    <th>Category</th>
                    <th>Rental Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRentals.map((rental) => (
                    <tr key={rental.rental_id}>
                      <td>{rental.rental_id}</td>
                      <td>
                        <Link to={`/films/${rental.film_id}`} className="film-link">
                          {rental.title}
                        </Link>
                      </td>
                      <td>{rental.category_name}</td>
                      <td>{new Date(rental.rental_date).toLocaleDateString()}</td>
                      <td>
                        <span className="status-badge rented">Rented</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleReturnRental(rental.rental_id)}
                          className="btn btn-success btn-sm"
                        >
                          Mark Returned
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No active rentals.</p>
          )}
        </div>

        {/* Rental History */}
        <div className="content-section">
          <h2>Rental History ({returnedRentals.length})</h2>
          {returnedRentals.length > 0 ? (
            <div className="rentals-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Rental ID</th>
                    <th>Film</th>
                    <th>Category</th>
                    <th>Rental Date</th>
                    <th>Return Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedRentals.slice(0, 10).map((rental) => (
                    <tr key={rental.rental_id}>
                      <td>{rental.rental_id}</td>
                      <td>
                        <Link to={`/films/${rental.film_id}`} className="film-link">
                          {rental.title}
                        </Link>
                      </td>
                      <td>{rental.category_name}</td>
                      <td>{new Date(rental.rental_date).toLocaleDateString()}</td>
                      <td>{new Date(rental.return_date).toLocaleDateString()}</td>
                      <td>
                        <span className="status-badge returned">Returned</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {returnedRentals.length > 10 && (
                <p className="history-note">
                  Showing last 10 rentals. Total history: {returnedRentals.length} rentals
                </p>
              )}
            </div>
          ) : (
            <p>No rental history available.</p>
          )}
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && (
        <div className="edit-form-section">
          <h2>Edit Customer Details</h2>
          <form onSubmit={handleEditSubmit} className="edit-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name" className="form-label">First Name:</label>
                <input
                  type="text"
                  id="first_name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="last_name" className="form-label">Last Name:</label>
                <input
                  type="text"
                  id="last_name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
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
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address" className="form-label">Address:</label>
              <input
                type="text"
                id="address"
                value={editForm.address}
                onChange={(e) => setEditForm({...editForm, address: e.target.value})}
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
                  value={editForm.district}
                  onChange={(e) => setEditForm({...editForm, district: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="city" className="form-label">City:</label>
                <input
                  type="text"
                  id="city"
                  value={editForm.city}
                  onChange={(e) => setEditForm({...editForm, city: e.target.value})}
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
                  value={editForm.country}
                  onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone:</label>
                <input
                  type="tel"
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Update Customer</button>
              <button type="button" onClick={() => setShowEditForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="customer-actions">
        <Link to="/customers" className="btn btn-secondary">
          Back to Customers
        </Link>
        <button 
          className="btn btn-primary"
          onClick={() => setShowEditForm(true)}
        >
          Edit Customer
        </button>
        <button 
          className="btn btn-danger"
          onClick={handleDelete}
        >
          Delete Customer
        </button>
      </div>
    </div>
  );
};

export default CustomerDetails;
