import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Plus, UserPlus, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./PainelDeFuncionarios.scss";

// Dados simulados
const dadosSimulados = {
  "2025-08-01": [
    { id: 1, nome: "Rex", tutor: "João", hora: "10:00" },
    { id: 2, nome: "Mia", tutor: "Ana", hora: "11:30" },
  ],
  "2025-08-02": [
    { id: 3, nome: "Luna", servico: "Tosquia", tutor: "Carlos", hora: "09:00" },
    { id: 4, nome: "Max", tutor: "Beatriz", hora: "12:00" },
  ],
};

const usuariosSimulados = [
  { id: 1, nome: "João Matos", email: "joao@email.com", telemovel: "912345678" },
  { id: 2, nome: "Ana Silva", email: "ana@email.com", telemovel: "987654321" },
];

const animaisSimulados = {
  1: [
    { id: 1, nome: "Rex", raca: "Pastor Alemão", idade: 5 },
    { id: 2, nome: "Bella", raca: "Labrador", idade: 3 },
  ],
  2: [{ id: 3, nome: "Mia", raca: "Poodle", idade: 2 }],
};

const servicosSimulados = ["Tosquia", "Banho", "spa"];

const PainelFuncionario = () => {
  const hoje = new Date();
  const [dataSelecionada, setDataSelecionada] = useState(hoje.toISOString().split("T")[0]);
  const [marcacoesHoje, setMarcacoesHoje] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSelecionado, setUserSelecionado] = useState(null);
  const [filtro, setFiltro] = useState("");

  const [showHorarioModal, setShowHorarioModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAnimalModal, setShowAnimalModal] = useState(false);
  const [showServicoModal, setShowServicoModal] = useState(false);
  const [showCriarUserModal, setShowCriarUserModal] = useState(false);

  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [userParaMarcacao, setUserParaMarcacao] = useState(null);
  const [animalSelecionado, setAnimalSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  const horariosDisponiveis = ["09:00", "10:00", "11:00", "12:00", "13:00"];

  // Filtrar users para modal
  const usersFiltrados = users.filter((user) =>
    user.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  useEffect(() => {
    setMarcacoesHoje(dadosSimulados[dataSelecionada] || []);
    setUsers(usuariosSimulados);
  }, [dataSelecionada]);

  // Função para iniciar marcação: abre o modal para escolher utilizador
  const iniciarMarcacao = () => {
    setShowUserModal(true);
    setUserParaMarcacao(null);
    setAnimalSelecionado(null);
    setServicoSelecionado(null);
    setHorarioSelecionado(null);
  };

  // Após escolher utilizador, abrir modal para escolher animal
  const escolherUser = (user) => {
    setUserParaMarcacao(user);
    setShowUserModal(false);
    setShowAnimalModal(true);
  };

  // Após escolher animal, abrir modal para escolher serviço
  const escolherAnimal = (animal) => {
    setAnimalSelecionado(animal);
    setShowAnimalModal(false);
    setShowServicoModal(true);
  };

  // Após escolher serviço, abrir modal para escolher horário
  const escolherServico = (servico) => {
    setServicoSelecionado(servico);
    setShowServicoModal(false);
    setShowHorarioModal(true);
  };

  // Após escolher horário, finalizar marcação (por enquanto só fecha e imprime no console)
  const escolherHorario = (hora) => {
    setHorarioSelecionado(hora);
    setShowHorarioModal(false);
    // Aqui podes adicionar a lógica para guardar a marcação, atualizar estado, etc
  };

  //Funcao para criar um novo utilizador
  const criarUtilizador = (nome, email, telemovel) => {
    setShowCriarUserModal(true);
    const novoUtilizador = {
      id: users.length + 1,
      nome,
      email,
      telemovel,
    };
    setUsers([...users, novoUtilizador]);
    setShowCriarUserModal(false);
    alert(`Utilizador ${nome} criado com sucesso!`);
  };

  // Exportar marcações para PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    const dataLegivel = new Date(dataSelecionada).toLocaleDateString("pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    doc.text(`Marcações de ${dataLegivel}`, 14, 15);
    autoTable(doc, {
      head: [["Hora", "Serviço", "Animal", "Tutor"]],
      body: marcacoesHoje.map(({ hora, servico, nome, tutor }) => [hora, servico || "-", nome, tutor]),
      startY: 20,
    });
    doc.save(`marcacoes-${dataSelecionada}.pdf`);
  };

  return (
    <div className="container mt-4 painel-funcionario">
      <h1 className="mb-4" style={{ color: "#701C1C" }}>
        Painel do Funcionário
      </h1>

      {/* Marcações */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Marcações</h4>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={exportarPDF}>
                Exportar PDF
              </Button>
              <Button className="botao-add" onClick={iniciarMarcacao}>
                <Plus size={18} className="me-2" />
                Nova Marcação
              </Button>
            </div>
          </div>

          <Form.Group className="mb-3" controlId="formData">
            <Form.Label>Selecionar Data</Form.Label>
            <Form.Control
              type="date"
              value={dataSelecionada}
              style={{ maxWidth: "150px" }}
              onChange={(e) => setDataSelecionada(e.target.value)}
            />
          </Form.Group>

          <strong className="text-muted mb-3 d-block">
            {new Date(dataSelecionada).toLocaleDateString("pt-PT", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </strong>

          {marcacoesHoje.length === 0 ? (
            <p className="text-muted">Sem marcações neste dia.</p>
          ) : (
            <ul className="list-group">
              {marcacoesHoje.map(({ id, hora, nome, tutor }) => (
                <li
                  key={id}
                  className="list-group-item"
                  style={{
                    backgroundColor: "#E0E0E0",
                    border: "1px solid #C5A880",
                    borderRadius: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <strong>{hora}</strong> - {nome} ({tutor})
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>

      {/* Utilizadores + detalhe */}
      <div className="d-flex flex-wrap gap-4">
        <Card className="usuarios-lista flex-grow-1" style={{ minWidth: 280, maxWidth: 350 }}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4>Utilizadores</h4>
              <Button className="botao-add"on onClick={() => setShowCriarUserModal(true)}>
                <UserPlus size={18} className="me-2" />
                Novo Utilizador
              </Button>
            </div>

            <Form.Control
              type="text"
              placeholder="Procurar utilizador..."
              className="mb-3"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />

            <div className="scroll-area">
              <ul className="list-group">
                {usersFiltrados.map(({ id, nome, email }) => (
                  <li
                    key={id}
                    className={`list-group-item ${userSelecionado?.id === id ? "ativo" : ""}`}
                    style={{
                      backgroundColor: "#E0E0E0",
                      border: "1px solid #C5A880",
                      borderRadius: "12px",
                      marginBottom: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => setUserSelecionado(users.find((u) => u.id === id))}
                  >
                    <strong>{nome}</strong> <span className="text-muted">({email})</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card.Body>
        </Card>

        {/* Painel detalhes */}
        {userSelecionado && (
          <Card
            className="detalhes-usuario flex-grow-1"
            style={{ minWidth: 280, maxWidth: 400 }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Detalhes do Utilizador</h4>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setUserSelecionado(null)}
                >
                  <X size={18} />
                </Button>
              </div>
              <p>
                <strong>Nome:</strong> {userSelecionado.nome}
              </p>
              <p>
                <strong>Email:</strong> {userSelecionado.email}
              </p>
              <p>
                <strong>Telemóvel:</strong> {userSelecionado.telemovel || "Não registado"}
              </p>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* MODAL: Escolher Utilizador */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Escolher Utilizador para Marcação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type="text"
            placeholder="Procurar utilizador..."
            className="mb-3"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <ListGroup>
            {usersFiltrados.map((user) => (
              <ListGroup.Item
                key={user.id}
                action
                onClick={() => escolherUser(user)}
              >
                {user.nome} - {user.email}
              </ListGroup.Item>
            ))}
            {usersFiltrados.length === 0 && <p>Nenhum utilizador encontrado.</p>}
          </ListGroup>
        </Modal.Body>
      </Modal>

      {/* MODAL: Escolher Animal */}
      <Modal show={showAnimalModal} onHide={() => setShowAnimalModal(false)} size="md" centered>
        <Modal.Header closeButton>
          <Modal.Title>Escolher Animal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userParaMarcacao && (
            <>
              <p>
                Animais do utilizador <strong>{userParaMarcacao.nome}</strong>:
              </p>
              <ListGroup>
                {(animaisSimulados[userParaMarcacao.id] || []).map((animal) => (
                  <ListGroup.Item
                    key={animal.id}
                    action
                    onClick={() => escolherAnimal(animal)}
                  >
                    {animal.nome} - {animal.raca} ({animal.idade} anos)
                  </ListGroup.Item>
                ))}
                {(animaisSimulados[userParaMarcacao.id] || []).length === 0 && (
                  <p>Este utilizador não tem animais registados.</p>
                )}
              </ListGroup>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* MODAL: Escolher Serviço */}
      <Modal show={showServicoModal} onHide={() => setShowServicoModal(false)} size="sm" centered>
        <Modal.Header closeButton>
          <Modal.Title>Escolher Serviço</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {servicosSimulados.map((servico, idx) => (
              <ListGroup.Item
                key={idx}
                action
                onClick={() => escolherServico(servico)}
              >
                {servico}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>

      {/* MODAL: Escolher Horário */}
      <Modal show={showHorarioModal} onHide={() => setShowHorarioModal(false)} size="sm" centered>
        <Modal.Header closeButton>
          <Modal.Title>Escolher Horário</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {horariosDisponiveis.map((hora, idx) => (
              <ListGroup.Item key={idx} action onClick={() => escolherHorario(hora)}>
                {hora}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
      </Modal>

      {/* MODAL: Criar User */}
      <Modal show={showCriarUserModal} onHide={() => setShowCriarUserModal(false)} size="sm" centered>
        <Modal.Header closeButton>
          <Modal.Title>Criar Utilizador</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control type="text" placeholder="Nome do utilizador" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email do utilizador" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTelefone">
              <Form.Label>Telemóvel</Form.Label>
              <Form.Control type="tel" placeholder="912345678" />
            </Form.Group>
          </Form>
          <Button variant="primary" onClick={() => setShowCriarUserModal(false)}>
            Criar Utilizador
          </Button>

        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PainelFuncionario;
