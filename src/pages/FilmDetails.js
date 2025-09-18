import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { filmsAPI, customersAPI } from '../services/api';
import './FilmDetails.css';

const FilmDetails = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [rentalForm, setRentalForm] = useState({ customer_id: '', store_id: '1' });
  const [customerPreview, setCustomerPreview] = useState(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [rentalSuccess, setRentalSuccess] = useState('');

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await filmsAPI.getFilmById(id);
        setFilm(response.data);
      } catch (err) {
        setError('Failed to load film details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFilmDetails();
    }
  }, [id]);

  const handleCustomerIdChange = async (e) => {
    const customerId = e.target.value;
    setRentalForm({...rentalForm, customer_id: customerId});
    
    if (customerId && customerId.length > 0) {
      try {
        setCustomerLoading(true);
        const response = await customersAPI.getCustomerById(customerId);
        setCustomerPreview(response.data);
        setShowConfirmation(true);
      } catch (err) {
        setCustomerPreview(null);
        setShowConfirmation(false);
      } finally {
        setCustomerLoading(false);
      }
    } else {
      setCustomerPreview(null);
      setShowConfirmation(false);
    }
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    try {
      await filmsAPI.rentFilm(id, rentalForm.customer_id, rentalForm.store_id);
      setRentalSuccess('Film rented successfully!');
      setShowRentalForm(false);
      setShowConfirmation(false);
      setCustomerPreview(null);
      setRentalForm({ customer_id: '', store_id: '1' });
      // Refresh film data to update availability
      const response = await filmsAPI.getFilmById(id);
      setFilm(response.data);
      setTimeout(() => setRentalSuccess(''), 3000);
    } catch (err) {
      setError('Failed to rent film. Please check inventory availability.');
    }
  };

  const closeModal = () => {
    setShowRentalForm(false);
    setShowConfirmation(false);
    setCustomerPreview(null);
    setRentalForm({ customer_id: '', store_id: '1' });
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading film details...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
        <Link to="/films" className="btn btn-primary">Back to Films</Link>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="error">
        <h2>Film Not Found</h2>
        <p>The requested film could not be found.</p>
        <Link to="/films" className="btn btn-primary">Back to Films</Link>
      </div>
    );
  }

  return (
    <div className="film-details-page">
      <div className="film-actions-top">
        <Link to="/films" className="btn btn-secondary btn-sm">
          Back to Films
        </Link>
        <button 
          className="btn btn-primary btn-sm" 
          onClick={() => setShowRentalForm(true)}
        >
          Rent Film
        </button>
      </div>

      {rentalSuccess && (
        <div className="success">
          <p>{rentalSuccess}</p>
        </div>
      )}

      <div className="film-header">
        <h1 className="film-title">{film.title}</h1>
        <div className="film-meta">
          <span className="meta-pill">{film.release_year}</span>
          <span className="meta-pill">{film.rating}</span>
          <span className="meta-pill">{film.category_name}</span>
        </div>
      </div>

      <div className="film-content">
        <div className="film-poster-section">
          <div className="film-poster">FILM</div>
        </div>
        
        <div className="film-info">
          <div className="info-section">
            <h3>Description</h3>
            <p>{film.description}</p>
          </div>
          
          <div className="info-section">
            <h3>Rental Duration:</h3>
            <p>{film.rental_duration} days</p>
          </div>
          
          <div className="info-section">
            <h3>Rental Rate:</h3>
            <p>${film.rental_rate}</p>
          </div>
          
          <div className="info-section">
            <h3>Replacement Cost:</h3>
            <p>${film.replacement_cost}</p>
          </div>
        </div>
      </div>

      <div className="cast-section">
        <h2>Cast & Crew</h2>
        <div className="cast-grid">
          {film.actors && film.actors.length > 0 ? (
            film.actors.map((actor) => (
              <Link
                key={actor.actor_id}
                to={`/actors/${actor.actor_id}`}
                className="cast-member"
              >
                {actor.first_name} {actor.last_name}
              </Link>
            ))
          ) : (
            <p>No cast information available.</p>
          )}
        </div>
      </div>

      <div className="availability-section">
        <h2>Availability</h2>
        <div className="availability-grid">
          {film.inventory && film.inventory.length > 0 ? (
            film.inventory.map((store) => (
              <div key={store.store_id} className="store-availability">
                <div className="store-name">Store {store.store_id}</div>
                <div className={`availability-count ${store.available_copies > 0 ? 'available' : 'unavailable'}`}>
                  {store.available_copies} copies available
                </div>
              </div>
            ))
          ) : (
            <p>No inventory information available.</p>
          )}
        </div>
      </div>

      {film.special_features && (
        <div className="special-features-section">
          <h2>Special Features</h2>
          <div className="features-list">
            {film.special_features.split(',').map((feature, index) => (
              <span key={index} className="feature-badge">
                {feature.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {showRentalForm && (
        <div className="rental-modal">
          <div className="rental-modal-content">
            <h2>Rent "{film.title}"</h2>
            
            <form onSubmit={handleRentalSubmit}>
              <div className="form-group">
                <label htmlFor="customer_id" className="form-label">
                  Customer ID:
                </label>
                <input
                  type="number"
                  id="customer_id"
                  value={rentalForm.customer_id}
                  onChange={handleCustomerIdChange}
                  className="form-control"
                  required
                  placeholder="Enter customer ID to preview"
                />
              </div>

              {customerLoading && (
                <div className="loading">Searching for customer...</div>
              )}

              {customerPreview && (
                <div className="customer-preview">
                  <h4>Customer Preview:</h4>
                  <div className="customer-info">
                    <p><strong>Name:</strong> {customerPreview.first_name} {customerPreview.last_name}</p>
                    <p><strong>Email:</strong> {customerPreview.email}</p>
                    <p><strong>Status:</strong> {customerPreview.active ? 'Active' : 'Inactive'}</p>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="store_id" className="form-label">
                  Store:
                </label>
                <select
                  id="store_id"
                  value={rentalForm.store_id}
                  onChange={(e) => setRentalForm({...rentalForm, store_id: e.target.value})}
                  className="form-control"
                  required
                >
                  <option value="1">Store 1</option>
                  <option value="2">Store 2</option>
                </select>
              </div>

              {showConfirmation && customerPreview && (
                <div className="confirmation-text">
                  Ready to rent "{film.title}" to {customerPreview.first_name} {customerPreview.last_name}?
                </div>
              )}

              <div className="modal-actions">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!showConfirmation || !customerPreview}
                >
                  Confirm Rental
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilmDetails;
