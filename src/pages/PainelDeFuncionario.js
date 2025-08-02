import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
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
    { id: 5, nome: "Max", tutor: "Beatriz", hora: "12:00" },
    { id: 6, nome: "Max", tutor: "Beatriz", hora: "12:00" },
    { id: 7, nome: "Max", tutor: "Beatriz", hora: "12:00" },
    { id: 8, nome: "Max", tutor: "Beatriz", hora: "12:00" },
  ],
};

const usuariosSimulados = [
  { id: 1, nome: "João Matos", email: "joao@email.com", telemovel: "912345678" },
  { id: 2, nome: "Ana Silva", email: "ana@email.com", telemovel: "987654321" },
  { id: 3, nome: "Ana Silva", email: "ana@email.com", telemovel: "987654321" },
  { id: 4, nome: "Ana Silva", email: "ana@email.com", telemovel: "987654321" },
  { id: 5, nome: "Ana Silva", email: "ana@email.com", telemovel: "987654321" },
  { id: 6, nome: "Amanel", email: "ana@email.com", telemovel: "987654321" },
  { id: 7, nome: "jona", email: "ana@email.com", telemovel: "987654321" },
  { id: 8, nome: "quim", email: "ana@email.com", telemovel: "987654321" },
];

// Animais simulados por utilizador
const animaisSimulados = {
  1: [
    { id: 1, nome: "Rex", raca: "Pastor Alemão", idade: 5 },
    { id: 2, nome: "Bella", raca: "Labrador", idade: 3 },
  ],
  2: [
    { id: 3, nome: "Mia", raca: "Poodle", idade: 2 },
  ],
};


const PainelFuncionario = () => {
  const hoje = new Date();
  const [dataSelecionada, setDataSelecionada] = useState(hoje.toISOString().split("T")[0]);
  const [marcacoesHoje, setMarcacoesHoje] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSelecionado, setUserSelecionado] = useState(null);
  const [filtro, setFiltro] = useState("");
  

  const usersFiltrados = users.filter((user) =>
    user.nome.toLowerCase().includes(filtro.toLowerCase())
  );


  useEffect(() => {
    setMarcacoesHoje(dadosSimulados[dataSelecionada] || []);
    setUsers(usuariosSimulados);
  }, [dataSelecionada]);

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
      head: [["Hora","Serviço", "Animal", "Tutor"]],
      body: marcacoesHoje.map(({ hora,servico, nome, tutor }) => [hora, servico,nome, tutor]),
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
              <Button className="botao-add">
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
              <Button className="botao-add">
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
                    onClick={() => setUserSelecionado(users.find(u => u.id === id))}
                  >
                    <strong>{nome}</strong>{" "}
                    <span className="text-muted">({email})</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card.Body>
        </Card>


        {/* Painel detalhes */}
        {userSelecionado && (
          <Card className="detalhes-usuario flex-grow-1" style={{ minWidth: 280, maxWidth: 400 }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Detalhes do Utilizador</h4>
                <Button variant="outline-secondary" size="sm" onClick={() => setUserSelecionado(null)}>
                  <X size={18} />
                </Button>
              </div>
              <p><strong>Nome:</strong> {userSelecionado.nome}</p>
              <p><strong>Email:</strong> {userSelecionado.email}</p>
              <p><strong>Telemóvel:</strong> {userSelecionado.telemovel || "Não registado"}</p>

              <h5 className="mt-4">Animais</h5>
              {animaisSimulados[userSelecionado.id]?.length > 0 ? (
                <ul>
                  {animaisSimulados[userSelecionado.id].map(({ id, nome, raca, idade }) => (
                    <li key={id}>
                      <strong>{nome}</strong> - {raca}, {idade} anos
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Sem animais registados.</p>
              )}
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PainelFuncionario;
