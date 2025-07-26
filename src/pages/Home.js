import React from "react";
import { Container, Row, Col, Button } from 'react-bootstrap';
import "./Home.scss";

export default function Home() {

  return (
    <section
      className="hero d-flex align-items-center"
    >
     <img
  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=90"
  alt="Test Image"
  style={{
    width: '100%',
    height: '100vh',
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
  }}
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
