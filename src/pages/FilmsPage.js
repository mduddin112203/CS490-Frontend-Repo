import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { filmsAPI } from '../services/api';
import './FilmsPage.css';

const FilmsPage = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    actorName: '',
    genre: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // search mode toggle
  const [searchLoading, setSearchLoading] = useState(false);
  const [pageJump, setPageJump] = useState('');

  const itemsPerPage = 20;

  const fetchFilms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await filmsAPI.getFilms(currentPage, itemsPerPage);
      setFilms(response.data.films);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError('Failed to load films. Please try again later.');
      console.error('Error fetching films:', err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

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
      const response = await filmsAPI.searchFilms(searchFilters);
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to search films. Please try again later.');
      console.error('Error searching films:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchFilters({
      title: '',
      actorName: '',
      genre: ''
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

  const displayFilms = isSearching ? searchResults : films;

  if (loading && !isSearching) {
    return (
      <div className="loading">
        <h2>Loading films...</h2>
      </div>
    );
  }

  return (
    <div className="films-page">
      <div className="page-header">
        <h1>Films Collection</h1>
        <p>Browse and search our extensive movie collection</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <h3>Find Your Film</h3>
        <p>Filter films by the following criteria:</p>
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-filters">
            <div className="filter-group">
              <label htmlFor="title">Film Title:</label>
              <input
                type="text"
                id="title"
                value={searchFilters.title}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                placeholder="Film Title"
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="actorName">Actor Name:</label>
              <input
                type="text"
                id="actorName"
                value={searchFilters.actorName}
                onChange={(e) => handleFilterChange('actorName', e.target.value)}
                placeholder="Actor Name (first, last, or full name)"
                className="filter-input"
              />
            </div>
            
            <div className="filter-group">
              <label htmlFor="genre">Genre:</label>
              <input
                type="text"
                id="genre"
                value={searchFilters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                placeholder="Genre"
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

      {/* Results Section */}
      <div className="results-section">
        {isSearching ? (
          <div className="search-results">
            <h2>Search Results</h2>
            <p>{searchResults.length} films found</p>
          </div>
        ) : (
          <div className="browse-results">
            <h2>All Films</h2>
            <p>Page {currentPage} of {totalPages}</p>
          </div>
        )}

        {displayFilms.length === 0 ? (
          <div className="no-results">
            <p>No films found. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <>
            <div className="films-grid">
              {displayFilms.map((film) => (
                <div key={film.film_id} className="film-card">
                  <div className="film-card-header">
                    <h3 className="film-title">
                      <Link to={`/films/${film.film_id}`}>
                        {film.title}
                      </Link>
                    </h3>
                    <span className="film-rating">{film.rating}</span>
                  </div>
                  <div className="film-card-body">
                    <div className="film-category">
                      <span className="category-badge">{film.category_name}</span>
                    </div>
                    <div className="film-rate">
                      <strong>${film.rental_rate}</strong> / rental
                    </div>
                  </div>
                  <div className="film-card-footer">
                    <Link to={`/films/${film.film_id}`} className="btn btn-primary btn-sm">
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
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
    </div>
  );
};

export default FilmsPage;

