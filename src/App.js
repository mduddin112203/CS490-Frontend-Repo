import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FilmDetails from './pages/FilmDetails';
import ActorDetails from './pages/ActorDetails';
import FilmsPage from './pages/FilmsPage';
import CustomersPage from './pages/CustomersPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/films" element={<FilmsPage />} />
          <Route path="/films/:id" element={<FilmDetails />} />
          <Route path="/actors/:id" element={<ActorDetails />} />
          <Route path="/customers" element={<CustomersPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
