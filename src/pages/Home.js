import React from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import "./Home.scss";

export default function Home() {

  return (
    <section
      className="hero d-flex align-items-center"
    >
      <img
        src="/img/animais/PE-Funpets-00023.jpg"
        alt="Villa Pet"
        className="hero-bg-image"
      />
      <Container>
        <Row>
          <Col md={8} lg={6}>
            <h1 className="hero-title">Bem-vindo ao Villa Pet</h1>
            <p className="hero-subtitle">
              Cuidados e carinho para o seu melhor amigo.
            </p>
            <Button variant="primary" size="lg">
              Saiba Mais
            </Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
