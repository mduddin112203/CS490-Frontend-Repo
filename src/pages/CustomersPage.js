import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customersAPI } from '../services/api';
import './CustomersPage.css';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await customersAPI.getCustomers(currentPage, limit, searchQuery);
        setCustomers(response.data.customers);
        setPagination(response.data.pagination);
        setSearchTerm(response.data.search || '');
      } catch (err) {
        setError('Failed to load customers. Please try again later.');
        console.error('Error fetching customers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [currentPage, limit, searchQuery]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchQuery);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading customers...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <div className="customers-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Customers</h1>
        <p className="customers-subtitle">Manage customer information</p>
      </div>

      <div className="customers-content">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-group">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                placeholder="Search by ID, first name, or last name..."
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
              {searchTerm && (
                <button type="button" onClick={clearSearch} className="clear-button">
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="customers-stats">
          <div className="stat-card">
            <h3>Total Customers</h3>
            <p className="stat-number">{pagination.totalCustomers}</p>
          </div>
          <div className="stat-card">
            <h3>Current Page</h3>
            <p className="stat-number">{pagination.currentPage} of {pagination.totalPages}</p>
          </div>
          {searchTerm && (
            <div className="stat-card">
              <h3>Search Results</h3>
              <p className="stat-number">"{searchTerm}"</p>
            </div>
          )}
        </div>

        <div className="customers-list">
          {customers.map((customer) => (
            <div key={customer.customer_id} className="customer-card">
              <div className="customer-header">
                <h3 className="customer-name">
                  {customer.first_name} {customer.last_name}
                </h3>
                <span className={`customer-status ${customer.active ? 'active' : 'inactive'}`}>
                  {customer.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="customer-details">
                <div className="customer-info">
                  <p className="customer-email">{customer.email}</p>
                  <p className="customer-id">ID: {customer.customer_id}</p>
                </div>
                <div className="customer-meta">
                  <p className="customer-date">
                    Member since: {formatDate(customer.create_date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!pagination.hasPrev}
              className="pagination-button"
            >
              ← Previous
            </button>
            
            <div className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!pagination.hasNext}
              className="pagination-button"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomersPage;
