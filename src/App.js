import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VillaPetNavbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Marcacoes from './pages/Marcacoes';
import Footer from './components/Footer'

function App() {
  return (
    <>
    <Router>
      <VillaPetNavbar />
  
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/marcacoes" element={<Marcacoes />} />
        </Routes>
      <Footer />
    </Router>
    </>
  );
}

export default App;
