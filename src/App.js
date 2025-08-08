import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VillaPetNavbar from './components/Navbar';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Marcacoes from './pages/Marcacoes';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import Profile from './pages/Profile';
import Admin from './pages/PainelDeFuncionario';
import { AuthModalProvider } from './contexts/AuthModalContext'; 
import { AuthProvider } from './contexts/AuthContext';  

function App() {
  return (
    <AuthProvider> 
      <AuthModalProvider>
        <Router>
          <VillaPetNavbar />
          <LoginModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/marcacoes" element={<Marcacoes />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
        </Router>
      </AuthModalProvider>
    </AuthProvider>
  );
}

export default App;
