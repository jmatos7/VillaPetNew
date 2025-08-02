import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaInstagram } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhone } from "react-icons/fi";
import './Contact.scss';

export default function Contact() {
  return (
    <Container className="py-5 contact-section">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h1 className="contact-title">Contactos</h1>

          <div className="contact-box">
            <ul className="list-unstyled mb-0 contact-list">
              <li><strong><FiPhone /> Telefone:</strong> +351 912 345 678</li>
              <li><strong><AiOutlineMail /> Email:</strong> villapet@gmail.com</li>
              <li><strong><FaInstagram /> Instagram:</strong> villapet</li>
              <li><strong><IoLocationOutline /> Localização:</strong> R. Vieira Portuense, Porto, Portugal</li>
            </ul>
          </div>

          <div className="mapa mt-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.911009166797!2d-8.633383316277978!3d41.16286472376699!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2465a5df55d137%3A0xdd671ffbd0209085!2sR.%20Vieira%20Portuense%2080%2C%204050-230%20Porto!5e0!3m2!1spt-PT!2spt!4v1730106939369!5m2!1spt-PT!2spt"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa Villa Pet"
            ></iframe>
          </div>

          <div className="mt-5">
            <h2 className="contact-title">Contacte-nos</h2>
            <Form className="contact-form mt-3">
              <Form.Group className="mb-3" controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="O seu nome" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="exemplo@dominio.com" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formAssunto">
                <Form.Label>Assunto</Form.Label>
                <Form.Control type="text" placeholder="Ex: Marcação, Informações, etc." />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formMensagem">
                <Form.Label>Mensagem</Form.Label>
                <Form.Control as="textarea" rows={5} placeholder="Escreva a sua mensagem..." />
              </Form.Group>

              <Button variant="primary" type="submit" className="mt-2">
                Enviar
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
