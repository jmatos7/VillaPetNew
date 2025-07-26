import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaInstagram, FaFacebookF, FaTwitter } from 'react-icons/fa';
import './Footer.scss';

export default function Footer() {
  return (
    <footer className="footer-custom py-4 mt-auto">
      <Container>
        <Row className="footer-container text-light">
          <Col md={4} className="mb-3">
            <h5>Sobre Nós</h5>
            <p>
              Na Villa Pet, cuidamos do seu melhor amigo com amor e dedicação. Descubra nossos serviços e faça parte da nossa comunidade!
            </p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Contactos</h5>
            <p>Email: villapet@gmail.com</p>
            <p>Telefone: +351 912 345 678</p>
          </Col>
          <Col md={4} className="mb-3">
            <h5>Siga-nos</h5>
            <div className="social-icons">
              <a href="https://www.instagram.com/villapet/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center text-secondary mt-3">
            <small>&copy; 2024 Villa Pet. Todos os direitos reservados.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
