import React from "react";
import "./Home.scss";

const servicos = [
  {
    title: "Alojamento de Luxo",
    description: "Ambientes seguros e confortáveis para o seu melhor amigo.",
    icon: (
      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <path d="M4 20 L24 4 L44 20 V44 H4 Z" />
        <circle cx="24" cy="30" r="8" />
      </svg>
    ),
  },
  {
    title: "Cuidados e Saúde",
    description: "Equipa especializada para garantir o bem-estar do seu pet.",
    icon: (
      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <path d="M12 36 L36 12" />
        <path d="M36 36 L12 12" />
        <circle cx="24" cy="24" r="10" />
      </svg>
    ),
  },
  {
    title: "Diversão e Socialização",
    description: "Espaços de brincadeira e interação para todos os animais.",
    icon: (
      <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
        <circle cx="24" cy="24" r="10" />
        <path d="M24 14 L24 34" />
        <path d="M14 24 L34 24" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="villa-home">

      <section className="hero-section">
        <div className="hero-content">
          <h1>Villa Pet</h1>
          <p>O melhor hotel para o seu animal de estimação.</p>
          <button className="btn-primary">Os nossos serviços</button>
        </div>
      </section>

      <section className="services-section">
        <h2>Os Nossos Serviços</h2>
        <div className="cards-container">
          {servicos.map(({ title, description, icon }, i) => (
            <div key={i} className="card">
              <div className="icon">{icon}</div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="why-choose-section">
        <h2>Porquê Escolher o Villa Pet?</h2>
        <ul>
          <li>Profissionais especializados e apaixonados por animais.</li>
          <li>Ambiente seguro e acolhedor.</li>
          <li>Serviços personalizados para cada pet.</li>
          <li>Localização central no Porto com fácil acesso.</li>
        </ul>
      </section>

    </main>
  );
}
