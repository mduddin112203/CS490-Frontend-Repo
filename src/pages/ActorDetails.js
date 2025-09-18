import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { actorsAPI } from '../services/api';
import './ActorDetails.css';

const ActorDetails = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [topRentedFilms, setTopRentedFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [actorResponse, filmsResponse] = await Promise.all([
          actorsAPI.getActorById(id),
          actorsAPI.getActorTopRentedFilms(id)
        ]);
        
        setActor(actorResponse.data);
        setTopRentedFilms(filmsResponse.data);
      } catch (err) {
        setError('Failed to load actor details. Please try again later.');
        console.error('Error fetching actor details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActorDetails();
    }
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
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!actor) {
    return (
      <div className="error">
        <h2>Actor Not Found</h2>
        <p>The requested actor could not be found.</p>
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="actor-details-page">
      <div className="back-button">
        <Link to="/" className="btn btn-secondary">
          Back to Home
        </Link>
      </div>

      <div className="actor-header">
        <h1 className="actor-name">
          {actor.first_name} {actor.last_name}
        </h1>
        <p className="actor-info">
          {actor.films ? actor.films.length : 0} Films
        </p>
      </div>

      <div className="filmography-section">
        <h2>Filmography</h2>
        {actor.films && actor.films.length > 0 ? (
          <div className="films-grid">
            {actor.films.map((film) => (
              <Link
                key={film.film_id}
                to={`/films/${film.film_id}`}
                className="film-card"
              >
                <div className="film-title">{film.title}</div>
                <div className="film-genre">{film.category_name}</div>
                <div className="film-description">
                  Click to view details
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

      {topRentedFilms && topRentedFilms.length > 0 && (
        <div className="filmography-section">
          <h2>Top 5 Rented Films</h2>
          <div className="films-grid">
            {topRentedFilms.map((film, index) => (
              <Link
                key={film.film_id}
                to={`/films/${film.film_id}`}
                className="film-card"
              >
                <div className="film-title">#{index + 1} {film.title}</div>
                <div className="film-genre">{film.category_name}</div>
                <div className="film-description">
                  {film.rental_count} rentals
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActorDetails;


