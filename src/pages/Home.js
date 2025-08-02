import React from "react";
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaPaw, FaHeart, FaShieldAlt, FaDog, FaBone, FaBath } from 'react-icons/fa';
import { useState } from 'react';
import "./Home.scss";

export default function Home() {

  const [servicoAtivo, setServicoAtivo] = useState(null);

  const servicos = [
    {
      id: 1,
      titulo: 'Banhos & Tosquias',
      icone: <FaBath />,
      descricao: 'Higiene completa com produtos seguros para o seu pet.',
      detalhes: 'Banhos terapêuticos, corte de unhas, secagem profissional e escovagem com carinho.'
    },
    {
      id: 2,
      titulo: 'Hospedagem',
      icone: <FaPaw />,
      descricao: 'Estadia confortável e supervisionada.',
      detalhes: 'Espaço climatizado, monitorização 24h e rotina com passeios e atividades.'
    },
    {
      id: 3,
      titulo: 'Adestramento',
      icone: <FaBone />,
      descricao: 'Treinos personalizados para melhor comportamento.',
      detalhes: 'Métodos positivos e eficazes com educadores certificados.'
    }
  ];


  const toggleCard = (id) => {
    setServicoAtivo(servicoAtivo === id ? null : id);
  };

  return (
    <>
      <section
        className="hero d-flex align-items-center"
      >
        <img
          src="/img/animais/estadia.jpg"
          alt="animal hero"
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
              <h1 className="hero-title">Bem-vindo ao VillaPet</h1>
              <p className="hero-subtitle">
                Cuidados e carinho para o seu melhor amigo.
              </p>

              <Button
  className="btn-villapet"
  size="lg"
  onClick={() => {
    const section = document.getElementById('sobre');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }}
>
  <FaPaw style={{ marginRight: '8px' }} />
  Saiba Mais
</Button>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="sobre" className="secao-sobre">
        <Container>
          <Row>
            <Col md={6}>
              <h2><FaPaw style={{ marginRight: '8px', color: '#C5A880' }} /> Quem Somos</h2>
              <p>Somos uma equipa apaixonada por animais, dedicada a oferecer o melhor cuidado em ambiente seguro, limpo e cheio de carinho.</p>
              <blockquote className="frase-villapet">
                "Onde há amor pelos animais, há cuidado verdadeiro."
              </blockquote>

              <ul className="valores-villapet">
                <li><FaHeart className="icon" /> Atendimento personalizado e afetuoso</li>
                <li><FaShieldAlt className="icon" /> Ambiente seguro e higienizado</li>
                <li><FaDog className="icon" /> Profissionais experientes e apaixonados</li>
              </ul>

            </Col>
            <Col md={6}>
              <img src="/img/animais/treino.jpg" alt="Equipa VillaPet" className="img-fluid rounded" />
            </Col>
          </Row>
        </Container>
      </section>

      <section id="servicos" className="secao-servicos py-5">
        <Container>
          <h2 className="mb-5">
            <FaPaw style={{ marginRight: '8px', color: '#C5A880' }} />
            Serviços
          </h2>
          <Row className="justify-content-center">
            {servicos.map((servico) => (
              <Col key={servico.id} md={6} lg={3} className="mb-4">
                <Card
                  className={`card-servico h-100 text-center p-3 ${servicoAtivo === servico.id ? 'ativo' : ''}`}
                  onClick={() => toggleCard(servico.id)}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  <div className="icone-servico mb-3">{servico.icone}</div>
                  <Card.Title>{servico.titulo}</Card.Title>

                  <div className="descricao-servico">
                    <p>{servico.descricao}</p>
                  </div>

                  <div className={`detalhes-servico ${servicoAtivo === servico.id ? 'visivel' : ''}`}>
                    <p>{servico.detalhes}</p>
                  </div>
                </Card>

              </Col>
            ))}

          </Row>
        </Container>
      </section>


    </>
  );
}
