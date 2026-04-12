import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import "./landing.css";

import heroImg from "../../assets/imagemlanding-optimized.png";
import logoHeader from "../../assets/logohorizontal-optimized.png";

const contactEmail = "evoluapb@gmail.com";

export default function Landing() {
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    let raf = 0;

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    const onMove = (event: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = (event.clientX - centerX) / (rect.width / 2);
      const dy = (event.clientY - centerY) / (rect.height / 2);

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        hero.style.setProperty("--mx", String(clamp(dx, -1, 1)));
        hero.style.setProperty("--my", String(clamp(dy, -1, 1)));
      });
    };

    hero.style.setProperty("--mx", "0");
    hero.style.setProperty("--my", "0");

    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ev-landing">
      <header className="ev-header">
        <div className="ev-header__inner">
          <a className="ev-brand" href="#inicio" aria-label="Evolua - Início">
            <img
              className="ev-brand__logo ev-brand__logo--wide"
              src={logoHeader}
              alt="Evolua"
              draggable={false}
            />
          </a>

          <nav className="ev-nav" aria-label="Navegação principal">
            <a href="#inicio" className="ev-nav__link">Início</a>
            <a href="#como-funciona" className="ev-nav__link">Como funciona</a>
            <a href="#sobre" className="ev-nav__link">Sobre nós</a>
            <a href="#contatos" className="ev-nav__link">Contato</a>
          </nav>

          <div className="ev-header__actions">
            <ThemeToggle className="ev-themeSwitch" />
            <Link className="ev-loginBtn ev-loginBtn--ghost" to="/cadastro">
              <span>Criar conta</span>
            </Link>
            <Link className="ev-loginBtn ev-loginBtn--primary" to="/login">
              <span>Entrar</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="ev-hero" ref={heroRef}>
          <div className="ev-hero__inner">
            <div className="ev-hero__copy ev-enter ev-enter--copy">
              <span className="ev-hero__eyebrow">Sistema para clínicas e consultórios</span>
              <h1 className="ev-hero__title">
                O cuidado flui melhor quando a equipe encontra tudo no mesmo lugar.
              </h1>

              <div className="ev-hero__actions">
                <Link className="ev-loginBtn ev-loginBtn--primary" to="/login">
                  <span>Entrar no sistema</span>
                </Link>
                <Link className="ev-loginBtn ev-loginBtn--ghost" to="/cadastro">
                  <span>Criar acesso</span>
                </Link>
              </div>

            </div>

            <div className="ev-hero__art ev-enter ev-enter--art" aria-hidden>
              <div className="ev-hero__visual">
                <img className="ev-hero__image" src={heroImg} alt="" draggable={false} />
              </div>
            </div>
          </div>
        </section>

        <section id="como-funciona" className="ev-section">
          <div className="ev-container">
            <div className="ev-section__heading">
              <span className="ev-section__eyebrow">Como funciona</span>
              <h2>Um fluxo simples para a equipe atender com mais clareza.</h2>
              <p>
                O sistema foi pensado para reduzir atrito na rotina clínica. Em vez de caçar
                links, anotações e acessos soltos, tudo fica organizado por paciente.
              </p>
            </div>

            <div className="ev-flow">
              <article className="ev-flow__step">
                <span className="ev-flow__index">01</span>
                <h3>Novo paciente</h3>
                <p>
                  Cadastre o nome e já deixe prontuário e exames configurados desde o primeiro
                  contato.
                </p>
              </article>

              <article className="ev-flow__step">
                <span className="ev-flow__index">02</span>
                <h3>Acesso rápido na consulta</h3>
                <p>
                  Abra prontuário, exames laboratoriais e raio X por botões diretos na ficha do
                  paciente.
                </p>
              </article>

              <article className="ev-flow__step">
                <span className="ev-flow__index">03</span>
                <h3>Acompanhamento contínuo</h3>
                <p>
                  Salve observações, próximos passos e mova pacientes para alta sem perder o
                  histórico.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="sobre" className="ev-section ev-section--alt">
          <div className="ev-container">
            <div className="ev-about">
              <div className="ev-about__intro">
                <span className="ev-section__eyebrow">Sobre nós</span>
                <h2>O Evolua serve para dar previsibilidade ao atendimento clínico.</h2>
                <p>
                  Ele foi criado para clínicas e consultórios que precisam de um sistema simples
                  para organizar a jornada do paciente. Em vez de depender de mensagens soltas,
                  planilhas e links espalhados, a equipe passa a trabalhar com uma base única,
                  objetiva e fácil de abrir durante a consulta.
                </p>
              </div>

              <div className="ev-about__details">
                <div>
                  <h3>Para que o sistema serve</h3>
                  <ul>
                    <li>Concentrar links de prontuário e exames por paciente.</li>
                    <li>Registrar observações e contexto clínico sem poluir a tela.</li>
                    <li>Manter pacientes ativos e altas organizados em um só fluxo.</li>
                  </ul>
                </div>

                <div>
                  <h3>Onde ele ajuda mais</h3>
                  <ul>
                    <li>Consultórios com rotina intensa e necessidade de resposta rápida.</li>
                    <li>Clínicas que lidam com múltiplos exames por paciente.</li>
                    <li>Equipes que precisam abrir informações certas no momento da consulta.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contatos" className="ev-section">
          <div className="ev-container">
            <div className="ev-contact">
              <div className="ev-contact__copy">
                <span className="ev-section__eyebrow">Contato</span>
                <h2>Quer conhecer melhor o sistema ou tirar uma dúvida?</h2>
              </div>

              <div className="ev-contact__panel">
                <div className="ev-contact__field">
                  <span>Email</span>
                  <strong>{contactEmail}</strong>
                </div>
                <a
                  className="ev-loginBtn ev-loginBtn--primary"
                  href={`mailto:${contactEmail}?subject=Contato%20Evolua`}
                >
                  <span>Entrar em contato</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="ev-footer">
        <div className="ev-container ev-footer__inner">
          <span>© {new Date().getFullYear()} Evolua</span>
          <span>Desenvolvido por <strong>Winiston Alle</strong></span>
        </div>
      </footer>
    </div>
  );
}
