import React, { useState, useEffect } from 'react';
import { filmsAPI } from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [topFilms, setTopFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopFilms = async () => {
      try {
        setLoading(true);
        const response = await filmsAPI.getTopRented();
        setTopFilms(response.data);
      } catch (err) {
        setError('Failed to load top films. Please try again later.');
        console.error('Error fetching top films:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopFilms();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading top films...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1>Welcome to Sakila DVD Store</h1>
        <p>Your premier destination for movie rentals and entertainment</p>
      </div>

      <div className="content-section">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top 5 Rented Films</h2>
            <p className="card-subtitle">Most popular movies of all time</p>
          </div>
          <div className="films-list">
            {topFilms.map((film, index) => (
              <div key={film.film_id} className="film-item">
                <div className="film-rank">#{index + 1}</div>
                <div className="film-info">
                  <h3 className="film-title">{film.title}</h3>
                  <div className="film-details">
                    <span className="category">{film.category_name}</span>
                    <span className="rental-count">{film.rental_count} rentals</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
