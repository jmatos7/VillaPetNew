import React, { useState } from 'react';
import { Navbar, Container, Offcanvas, Nav, Button, Image } from 'react-bootstrap';
import { FiMenu, FiHome, FiCalendar, FiPhone, FiUser, FiLogIn } from 'react-icons/fi';
import './Navbar.scss';

export default function ModernNavbar() {
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // simula estado de login

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Aqui poderia ser a função real de logout/login com backend
  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);

  return (
    <>
      <Navbar className="navbar-custom py-3" variant="dark" expand={false}>
        <Container fluid>
          <Button variant="outline-light" onClick={handleShow} aria-label="Abrir menu">
            <FiMenu size={24} />
          </Button>

          <Navbar.Brand href="/" className="mx-auto">
            <Image src="../img/VillaPetLogo.png" height={40} alt="Villa Pet Logo" />
          </Navbar.Brand>

          <Nav>
            {isLoggedIn ? (
              <Nav.Link href="/perfil" className="d-flex align-items-center" onClick={toggleLogin}>
                <FiUser size={22} className="me-1" />
                <span className="d-none d-md-inline">Meu Perfil</span>
              </Nav.Link>
            ) : (
              <Nav.Link href="/login" className="d-flex align-items-center" onClick={toggleLogin}>
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
