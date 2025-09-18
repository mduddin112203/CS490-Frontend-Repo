import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { actorsAPI } from '../services/api';
import './ActorDetails.css';

const ActorDetails = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        setLoading(true);
        const response = await actorsAPI.getActorById(id);
        setActor(response.data);
      } catch (err) {
        setError('Failed to load actor details. Please try again later.');
        console.error('Error fetching actor details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActorDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading actor details...</h2>
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

  if (!actor) {
    return (
      <div className="error">
        <h2>Actor Not Found</h2>
        <p>The requested actor could not be found.</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="actor-details-page">
      <div className="actor-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>{actor.first_name} {actor.last_name}</h1>
        <p className="actor-subtitle">Actor Details</p>
      </div>

      <div className="actor-content">
        <div className="actor-info-card">
          <h2>Top 5 Rented Films</h2>
          <p className="card-subtitle">Most popular films featuring this actor</p>
          
          {actor.top_films && actor.top_films.length > 0 ? (
            <div className="films-list">
              {actor.top_films.map((film, index) => (
                <Link key={film.film_id} to={`/films/${film.film_id}`} className="film-item-link">
                  <div className="film-item">
                    <div className="film-rank">#{index + 1}</div>
                    <div className="film-info">
                      <h3 className="film-title">{film.title}</h3>
                      <div className="film-details">
                        <span className="category">{film.category_name}</span>
                        <span className="rental-count">{film.rental_count} rentals</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-films">
              <p>No films found for this actor.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActorDetails;

