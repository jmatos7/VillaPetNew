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

function App() {
  return (
    <AuthModalProvider>
      <Router>
        <VillaPetNavbar />
        <LoginModal /> {/* Pode ficar aqui, visível em todas as páginas */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/marcacoes" element={<Marcacoes />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/admin" element={<Admin/>}/>
        </Routes>
        <Footer />
      </Router>
    </AuthModalProvider>
  );
}

export default App;
