import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import LandingPage from './pages/LandingPage';
import FilmsPage from './pages/FilmsPage';
import CustomersPage from './pages/CustomersPage';
import FilmDetails from './pages/FilmDetails';
import ActorDetails from './pages/ActorDetails';
import CustomerDetails from './pages/CustomerDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              Sakila DVD Store
            </Link>
            <div className="nav-menu">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/films" className="nav-link">Films</Link>
              <Link to="/customers" className="nav-link">Customers</Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/films" element={<FilmsPage />} />
            <Route path="/films/:id" element={<FilmDetails />} />
            <Route path="/actors/:id" element={<ActorDetails />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/customers/:id" element={<CustomerDetails />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>&copy; 2025 Sakila DVD Store - Md Uddin CS490</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
