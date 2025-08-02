import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaPaw, FaHeart, FaShieldAlt, FaDog, FaBone, FaBath } from 'react-icons/fa';
import "./Home.scss";

export default function Home() {

 const [servicoAtivo, setServicoAtivo] = useState(null);

  // Hero slideshow
  const imagensHero = [
    {
      url: "/img/animais/hero/alec-favale-Ivzo69e18nk-unsplash.jpg",
    },
    {
      url: "/img/animais/hero/andrea-lightfoot-IrZ5xXXCsn4-unsplash.jpg",
    },
    {
      url: "/img/animais/hero/elena-mozhvilo-y2Rec9stEdQ-unsplash.jpg",
    },
    {
      url: "/img/animais/hero/keith-tanner-CN9x4CR5TAg-unsplash.jpg",
    },
    {
      url: "/img/animais/hero/redd-francisco-C_TkoY43wHQ-unsplash.jpg",
    },
    {
      url: "/img/animais/hero/rhaul-velasquez-alva-jCM48W7y6Y8-unsplash.jpg",
    },
    {
      url: "/img/animais/hero/wolfgang-hasselmann-gcioe8naQys-unsplash.jpg",
    },
  ];

  const [indiceAtual, setIndiceAtual] = useState(0);
  
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
  
  useEffect(() => {
  const intervalo = setInterval(() => {
    setIndiceAtual((prev) => (prev + 1) % imagensHero.length);
  }, 5000);
  return () => clearInterval(intervalo);
}, [indiceAtual, imagensHero.length]);

  const toggleCard = (id) => {
    setServicoAtivo(servicoAtivo === id ? null : id);
  };

  return (
    <>
      <section
        className="hero d-flex align-items-center"
      >

        <div className="hero-bg-image">
          {imagensHero.map((imagem, idx) => (
          <img
            key={idx}
            src={imagem.url}
            alt={`animais ${idx}`}
            className={idx === indiceAtual ? 'active' : ''}
            loading="lazy"
          />
        ))}
        </div>
        {/* Overlay escura para destacar o texto */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          zIndex: 0,
        }} />

        <Container style={{ zIndex: 1, position: 'relative' }}>
          <Row>
            <Col md={8} lg={6}>
              <h1 className="hero-title">Bem-vindo ao VillaPet</h1>
              <p className="hero-subtitle">Cuidados e carinho para o seu melhor amigo.</p>

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
