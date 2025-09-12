import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { filmsAPI } from '../services/api';
import './FilmsPage.css';

const FilmsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await filmsAPI.searchFilms(searchQuery.trim());
      setSearchResults(response.data);
      setHasSearched(true);
    } catch (err) {
      setError('Failed to search films. Please try again later.');
      console.error('Error searching films:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="films-page">
      <div className="films-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Search Films</h1>
        <p className="films-subtitle">Find films by title, actor, or genre</p>
      </div>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={handleInputChange}
              placeholder="Search by film title, actor name, or genre..."
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      <div className="results-section">
        {error && (
          <div className="error">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {hasSearched && !loading && (
          <div className="results-header">
            <h2>
              {searchResults.length > 0 
                ? `Found ${searchResults.length} film${searchResults.length === 1 ? '' : 's'}`
                : 'No films found'
              }
            </h2>
            {searchQuery && (
              <p className="search-term">for "{searchQuery}"</p>
            )}
          </div>
        )}

        {loading && (
          <div className="loading">
            <h3>Searching films...</h3>
          </div>
        )}

        {hasSearched && !loading && searchResults.length > 0 && (
          <div className="films-grid">
            {searchResults.map((film) => (
              <Link key={film.film_id} to={`/films/${film.film_id}`} className="film-card-link">
                <div className="film-card">
                  <div className="film-card-header">
                    <h3 className="film-title">{film.title}</h3>
                    <span className="film-year">({film.release_year})</span>
                  </div>
                  <div className="film-card-body">
                    <p className="film-description">
                      {film.description ? 
                        (film.description.length > 150 
                          ? `${film.description.substring(0, 150)}...` 
                          : film.description
                        ) : 
                        'No description available'
                      }
                    </p>
                    <div className="film-details">
                      <span className="film-category">{film.category_name}</span>
                      <span className="film-rating">{film.rating}</span>
                    </div>
                    <div className="film-meta">
                      <span className="film-length">{film.length} min</span>
                      <span className="film-rate">${film.rental_rate}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {hasSearched && !loading && searchResults.length === 0 && (
          <div className="no-results">
            <h3>No films found</h3>
            <p>Try searching with different keywords or check your spelling.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilmsPage;
