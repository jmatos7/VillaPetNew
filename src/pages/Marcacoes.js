import React, { useEffect, useState, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, ListGroup, Container } from 'react-bootstrap';
import { AuthModalContext } from '../contexts/AuthModalContext';
import { AuthContext } from '../contexts/AuthContext';
import './Marcacoes.scss';

export default function Marcacoes() {
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [showHorarioModal, setShowHorarioModal] = useState(false);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [showServicoModal, setShowServicoModal] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  const { setShowModal } = useContext(AuthModalContext);

  // Verificar estado de login
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);


  const servicosDisponiveis = ['Banho', 'Tosquia', 'Hospedagem', 'Adestramento'];

  const [animais, setAnimais] = useState([]);

  const animaisDoUtilizador = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/user/me/animals', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Erro ao buscar animais');
      }

      const data = await res.json();
      console.log('Animais do utilizador:', data);
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar animais:', error);
      return [];
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimais = async () => {
      setLoading(true);
      setError(null);
      try {
        const dados = await animaisDoUtilizador();
        setAnimais(dados);
      } catch (err) {
        setError('Erro ao carregar animais.');
      } finally {
        setLoading(false);
      }
    };

    if (showAnimalModal) {
      fetchAnimais();
    }
  }, [showAnimalModal]);


  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const handleDateClick = (arg) => {

    if (!isLoggedIn) {
      alert('Precisas de estar logado para fazer marcações.');
      setShowModal(true); // Abre o modal de login
      return;
    }

    const data = new Date(arg.dateStr);
    data.setHours(0, 0, 0, 0);

    if (data < hoje) {
      alert('Não é possível marcar para dias anteriores.');
      return;
    }

    const horarios = [];
    for (let hora = 8; hora < 20; hora++) {
      horarios.push(
        `${hora.toString().padStart(2, '0')}:00 `,
        `${hora.toString().padStart(2, '0')}:30 `
      );
    }

    setDataSelecionada(arg.dateStr);
    setHorariosDisponiveis(horarios);
    setShowHorarioModal(true);
  };

  const marcarHorario = (horario) => {
    setHorarioSelecionado(horario);
    setShowHorarioModal(false);
    setShowServicoModal(true);
  };

  const selecionarServico = (servico) => {
    setServicoSelecionado(servico);
    setShowServicoModal(false);
    setShowAnimalModal(true);
  };


  const selecionarAnimal = (animal) => {
    alert(`Marcaçāo confirmada:
          Data: ${dataSelecionada}
          Hora: ${horarioSelecionado}
          Serviço: ${servicoSelecionado}
          Animal: ${animal.name}`);
    const formData = new FormData();
    formData.append('data', dataSelecionada);
    formData.append('hora', horarioSelecionado);
    formData.append('servico', servicoSelecionado);
    formData.append('animal', animal.id);

    console.log(Object.fromEntries(formData.entries()));



    setDataSelecionada(null);
    setHorarioSelecionado(null);
    setServicoSelecionado(null);
    setShowHorarioModal(false);
    setShowServicoModal(false);
    setShowAnimalModal(false);
  };

  return (
    <Container className="marcacoes-container">
      <h1 className="titulo mb-3">Bem-vindo às marcações</h1>
      <p className="descricao mb-4">Gerencia as marcações do teu melhor amigo.</p>

      <div className="calendar-wrapper mb-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale="pt"
          dateClick={handleDateClick}
          validRange={{ start: hoje }}
          height="auto"
        />
      </div>

      {/* Modal de Horários */}
      <Modal show={showHorarioModal} onHide={() => setShowHorarioModal(false)} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Disponibilidade - {dataSelecionada}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <div className="scroll-container">
            <ListGroup>
              {horariosDisponiveis.map((hora, idx) => (
                <ListGroup.Item
                  action
                  key={idx}
                  onClick={() => marcarHorario(hora)}
                  className="item-horario"
                >
                  {hora}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHorarioModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de Serviços */}
      <Modal show={showServicoModal} onHide={() => setShowServicoModal(false)} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Seleciona o serviço</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <ListGroup>
            {servicosDisponiveis.map((servico, idx) => (
              <ListGroup.Item
                action
                key={idx}
                onClick={() => selecionarServico(servico)}
                className="item-horario"
              >
                {servico}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowServicoModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Modal de Animais */}
      <Modal show={showAnimalModal} onHide={() => setShowAnimalModal(false)} centered>
        <Modal.Header closeButton className="modal-header-custom">
          <Modal.Title>Seleciona o animal</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-custom">
          <ListGroup>
            {animais.length > 0 ? (
              animais.map((animal, idx) => (
                <ListGroup.Item
                  action
                  key={idx}
                  onClick={() => selecionarAnimal(animal)}
                  className="item-horario"
                >
                  {animal.name}
                </ListGroup.Item>
              ))
            ) : (
              <p>Nenhum animal encontrado.</p>
            )}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAnimalModal(false)}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
