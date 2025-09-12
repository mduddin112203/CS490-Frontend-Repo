import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { filmsAPI } from '../services/api';
import './FilmDetails.css';

const FilmDetails = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilmDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await filmsAPI.getFilmById(id);
        setFilm(response.data);
      } catch (err) {
        setError('Failed to load film details. Please try again later.');
        console.error('Error fetching film details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFilmDetails();
    }
  }, [id]);

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
        <button onClick={() => window.history.back()} className="btn btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="error">
        <h2>Film Not Found</h2>
        <p>The requested film could not be found.</p>
        <button onClick={() => window.history.back()} className="btn btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="film-details-page">
      <div className="back-button">
        <button onClick={() => window.history.back()} className="btn btn-secondary">
          ← Back to Films
        </button>
      </div>

      <div className="film-header">
        <h1 className="film-title">{film.title}</h1>
        <div className="film-meta">
          <span className="film-year">{film.release_year}</span>
          <span className="film-rating">{film.rating}</span>
          <span className="film-category">{film.category_name}</span>
        </div>
      </div>

      <div className="film-content">
        <div className="film-info">
          <div className="info-section">
            <h3>Description</h3>
            <p className="film-description">
              {film.description || 'No description available.'}
            </p>
          </div>

          <div className="info-section">
            <h3>Film Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Length:</span>
                <span className="detail-value">{film.length} minutes</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rental Rate:</span>
                <span className="detail-value">${film.rental_rate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Replacement Cost:</span>
                <span className="detail-value">${film.replacement_cost}</span>
              </div>
            </div>
          </div>

          {film.actors && film.actors.length > 0 && (
            <div className="info-section">
              <h3>Cast</h3>
              <div className="actors-list">
                {film.actors.map((actor) => (
                  <div key={actor.actor_id} className="actor-item">
                    {actor.first_name} {actor.last_name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilmDetails;
