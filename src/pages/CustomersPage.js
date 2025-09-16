import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { customersAPI } from '../services/api';
import AddCustomerModal from '../components/AddCustomerModal';
import './CustomersPage.css';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState({
    customerId: '',
    name: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pageJump, setPageJump] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'none' });

  const itemsPerPage = 20;

  const fetchCustomers = useCallback( async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await customersAPI.getCustomers(currentPage, itemsPerPage);
      setCustomers(response.data.customers);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load customers. Please try again later.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    // Check if any filter has a value
    const hasFilters = Object.values(searchFilters).some(value => value.trim() !== '');
    
    if (!hasFilters) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    try {
      setIsSearching(true);
      setSearchLoading(true);
      setError(null);
      const response = await customersAPI.searchCustomers(searchFilters);
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to search customers. Please try again later.');
      console.error('Error searching customers:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchFilters({
      customerId: '',
      name: ''
    });
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setPageJump(''); // Clear page jump input
    window.scrollTo(0, 0);
  };

  const handlePageJump = (e) => {
    e.preventDefault();
    const pageNum = parseInt(pageJump);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      setPageJump('');
      window.scrollTo(0, 0);
    } else {
      setError(`Please enter a valid page number between 1 and ${totalPages}`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAddSuccess = () => {
    setSuccessMessage('Customer added successfully!');
    fetchCustomers(); // Refresh the list
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = 'none';
      }
    }
    
    setSortConfig({ key, direction });
  };

  const sortCustomers = (customers) => {
    if (sortConfig.direction === 'none') {
      return customers;
    }

    return [...customers].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortConfig.key) {
        case 'id':
          aValue = a.customer_id;
          bValue = b.customer_id;
          break;
        case 'name':
          aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
          bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'status':
          aValue = a.active ? 1 : 0;
          bValue = b.active ? 1 : 0;
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return ''; // No icon until clicked
    }
    
    switch (sortConfig.direction) {
      case 'asc':
        return ' ↑';
      case 'desc':
        return ' ↓';
      default:
        return ''; // No icon when no sorting
    }
  };

  const displayCustomers = isSearching ? sortCustomers(searchResults) : sortCustomers(customers);

  if (loading && !isSearching) {
    return (
      <div className="loading">
        <h2>Loading customers...</h2>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customer Management</h1>
        <p>Manage your customer database and rental history</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <h3>Find Someone in Particular</h3>
        <p>Filter customers by the following values:</p>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-filters">
            <div className="filter-group">
              <label htmlFor="customerId">Customer ID:</label>
              <input
                type="text"
                id="customerId"
                value={searchFilters.customerId}
                onChange={(e) => handleFilterChange('customerId', e.target.value)}
                placeholder="Customer ID"
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={searchFilters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Name (first, last, or full name)"
                className="filter-input"
              />
            </div>
          </div>
          
          <div className="search-actions">
            <button type="submit" className="btn btn-primary">
              {searchLoading ? 'Searching...' : 'Search'}
            </button>
            {isSearching && (
              <button type="button" onClick={clearSearch} className="btn btn-secondary">
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="success">
          <p>{successMessage}</p>
        </div>
      )}

      {/* Results Section */}
      <div className="results-section">
        {isSearching ? (
          <div className="search-results">
            <h2>Search Results</h2>
            <p>{searchResults.length} customers found</p>
          </div>
        ) : (
          <div className="browse-results">
            <div className="browse-header">
              <div>
                <h2>All Customers</h2>
                <p>Page {currentPage} of {totalPages}</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary"
              >
                Add New Customer
              </button>
            </div>
          </div>
        )}

        {displayCustomers.length === 0 ? (
          <div className="no-results">
            <p>No customers found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="customers-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('id')}
                      title="Click to sort"
                    >
                      ID {getSortIcon('id')}
                    </th>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('name')}
                      title="Click to sort"
                    >
                      Name {getSortIcon('name')}
                    </th>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('email')}
                      title="Click to sort"
                    >
                      Email {getSortIcon('email')}
                    </th>
                    <th 
                      className="sortable" 
                      onClick={() => handleSort('status')}
                      title="Click to sort"
                    >
                      Status {getSortIcon('status')}
                    </th>
                    <th>Member Since</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayCustomers.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td>{customer.customer_id}</td>
                      <td>
                        <strong>{customer.first_name} {customer.last_name}</strong>
                      </td>
                      <td>{customer.email}</td>
                      <td>
                        <span className={`status-badge ${customer.active ? 'active' : 'inactive'}`}>
                          {customer.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {new Date(customer.create_date).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/customers/${customer.customer_id}`}
                            className="btn btn-primary btn-sm"
                          >
                            View Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - only show when not searching */}
            {!isSearching && totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn ${pageNum === currentPage ? 'active' : 'btn-secondary'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
                
                {/* Page Jump */}
                <div className="page-jump">
                  <form onSubmit={handlePageJump} className="page-jump-form">
                    <input
                      type="number"
                      value={pageJump}
                      onChange={(e) => setPageJump(e.target.value)}
                      placeholder={`1-${totalPages}`}
                      className="page-jump-input"
                      min="1"
                      max={totalPages}
                    />
                    <button type="submit" className="btn btn-primary btn-sm">
                      Go
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AddCustomerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />
    </div>
  );
};

export default CustomersPage;