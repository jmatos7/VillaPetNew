import React, { useState, useEffect, useContext } from 'react';
import { AuthModalContext } from '../contexts/AuthModalContext';
import { AuthContext } from '../contexts/AuthContext';
import { Navbar, Container, Offcanvas, Nav, Button, Image } from 'react-bootstrap';
import { FiMenu, FiHome, FiCalendar, FiPhone, FiUser, FiLogIn } from 'react-icons/fi';
import './Navbar.scss';

export default function ModernNavbar() {
  const [show, setShow] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  const { setShowModal } = useContext(AuthModalContext);

  // Verificar estado de login
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);


  // Detetar scroll para aplicar fundo translúcido
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Navbar
        className={`navbar-custom py-3 ${scrolled ? 'scrolled' : ''}`}
        expand={false}
      >
        <Container fluid>
          <Button variant="outline-light" onClick={handleShow} aria-label="Abrir menu">
            <FiMenu size={24} />
          </Button>

          <Navbar.Brand href="/" className="mx-auto">
            <Image src="../img/VillaPetLogo.png" height={40} alt="Villa Pet Logo" />
          </Navbar.Brand>

          <Nav>
            {isLoggedIn ? (
              <Nav.Link href="/profile" className="d-flex align-items-center" onClick={handleClose}>
                <FiUser size={22} className="me-1" />
                <span className="d-none d-md-inline">Meu Perfil</span>
              </Nav.Link>
            ) : (
              <Nav.Link className="d-flex align-items-center" onClick={() => setShowModal(true)}>
                <FiLogIn size={22} className="me-1" />
                <span className="d-none d-md-inline">Login</span>
              </Nav.Link>

            )}
          </Nav>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="start" backdrop={true} className="offcanvas-custom">
        <Offcanvas.Header closeButton closeVariant="white">
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column fs-5">
            <Nav.Link href="/">
              <FiHome className="me-2" />
              Início
            </Nav.Link>
            <Nav.Link href="/marcacoes">
              <FiCalendar className="me-2" />
              Marcações
            </Nav.Link>
            <Nav.Link href="/contact">
              <FiPhone className="me-2" />
              Contactos
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
