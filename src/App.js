import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FilmDetails from './pages/FilmDetails';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/films/:id" element={<FilmDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
