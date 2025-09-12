import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { filmsAPI, actorsAPI } from '../services/api';
import './LandingPage.css';

const LandingPage = () => {
  const [topFilms, setTopFilms] = useState([]);
  const [topActors, setTopActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [filmsResponse, actorsResponse] = await Promise.all([
          filmsAPI.getTopRented(),
          actorsAPI.getTopActors()
        ]);
        
        setTopFilms(filmsResponse.data);
        setTopActors(actorsResponse.data);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
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
        <div className="content-grid">
          {/* Top 5 Rented Films */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Top 5 Rented Films</h2>
              <p className="card-subtitle">Most popular movies of all time</p>
            </div>
            <div className="films-list">
              {topFilms.map((film, index) => (
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
          </div>

          {/* Top 5 Actors */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Top 5 Actors</h2>
              <p className="card-subtitle">Most prolific actors in our collection</p>
            </div>
            <div className="actors-list">
              {topActors.map((actor, index) => (
                <Link key={actor.actor_id} to={`/actors/${actor.actor_id}`} className="actor-item-link">
                  <div className="actor-item">
                    <div className="actor-rank">#{index + 1}</div>
                    <div className="actor-info">
                      <h3 className="actor-name">{actor.first_name} {actor.last_name}</h3>
                      <div className="actor-details">
                        <span className="film-count">{actor.film_count} films</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
