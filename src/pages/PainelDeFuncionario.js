import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Plus, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./PainelDeFuncionarios.scss";

const PainelFuncionario = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [marcacoesHoje, setMarcacoesHoje] = useState([]);
  const [users, setUsers] = useState([]);

  const formatarData = (data) => {
    return data.toLocaleDateString("pt-PT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatarDataChave = (data) => {
    return data.toISOString().split("T")[0];
  };

  const dadosSimulados = {
    "2025-08-01": [
      { id: 1, nome: "Rex", tutor: "João", hora: "10:00" },
      { id: 2, nome: "Mia", tutor: "Ana", hora: "11:30" },
    ],
    "2025-08-02": [
      { id: 3, nome: "Luna", tutor: "Carlos", hora: "09:00" },
      { id: 4, nome: "Max", tutor: "Beatriz", hora: "12:00" },
    ],
    "2025-08-03": [],
  };

  useEffect(() => {
    const chave = formatarDataChave(dataSelecionada);
    setMarcacoesHoje(dadosSimulados[chave] || []);

    setUsers([
      { id: 1, nome: "João Matos", email: "joao@email.com" },
      { id: 2, nome: "Ana Silva", email: "ana@email.com" },
    ]);
  }, [dataSelecionada]);

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text(`Marcações de ${formatarData(dataSelecionada)}`, 14, 15);
    doc.autoTable({
      head: [["Hora", "Animal", "Tutor"]],
      body: marcacoesHoje.map((m) => [m.hora, m.nome, m.tutor]),
      startY: 20,
    });
    doc.save(`marcacoes-${formatarDataChave(dataSelecionada)}.pdf`);
  };

  const mudarDia = (dias) => {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() + dias);
    setDataSelecionada(novaData);
  };

  return (
    <div className="container mt-4">
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
              <Button variant="primary">
                <Plus size={18} className="me-2" />
                Nova Marcação
              </Button>
            </div>
          </div>

          {/* Controlo de data */}
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-2">
              <Button variant="outline-secondary" onClick={() => mudarDia(-1)} size="sm">
                <ChevronLeft size={16} />
              </Button>

              <DatePicker
                selected={dataSelecionada}
                onChange={(date) => setDataSelecionada(date)}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />

              <Button variant="outline-secondary" onClick={() => mudarDia(1)} size="sm">
                <ChevronRight size={16} />
              </Button>
            </div>

            <strong className="text-muted">{formatarData(dataSelecionada)}</strong>
          </div>

          {marcacoesHoje.length === 0 ? (
            <p className="text-muted">Sem marcações neste dia.</p>
          ) : (
            <ul className="list-group">
              {marcacoesHoje.map((m) => (
                <li
                  key={m.id}
                  className="list-group-item"
                  style={{
                    backgroundColor: "#E0E0E0",
                    border: "1px solid #C5A880",
                    borderRadius: "12px",
                    marginBottom: "8px",
                  }}
                >
                  <strong>{m.hora}</strong> - {m.nome} ({m.tutor})
                </li>
              ))}
            </ul>
          )}
        </Card.Body>
      </Card>

      {/* Utilizadores */}
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>Utilizadores</h4>
            <Button variant="primary">
              <UserPlus size={18} className="me-2" />
              Novo Utilizador
            </Button>
          </div>
          <ul className="list-group">
            {users.map((u) => (
              <li
                key={u.id}
                className="list-group-item"
                style={{
                  backgroundColor: "#E0E0E0",
                  border: "1px solid #C5A880",
                  borderRadius: "12px",
                  marginBottom: "8px",
                }}
              >
                <strong>{u.nome}</strong>{" "}
                <span className="text-muted">({u.email})</span>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PainelFuncionario;
