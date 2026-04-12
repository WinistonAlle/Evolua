import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoEvolua from "../../assets/logo_evolua-optimized.png";
import HeartRateLoader from "../../components/HeartRateLoader";
import "./login.css";
import { startPostAuthLoading } from "../../lib/post-auth-loading";
import {
  getAuthRedirectUrl,
  getSupabaseConfigError,
  isSupabaseConfigured,
  supabase,
} from "../../lib/supabase";

export default function Login() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<"login" | "reset" | null>(null);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const loading = loadingAction !== null;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = email.trim();

    if (!cleanEmail || !password) {
      setMessage({ type: "error", text: "Preencha email e senha." });
      return;
    }

    if (!isSupabaseConfigured()) {
      setMessage({
        type: "error",
        text: getSupabaseConfigError() ?? "Supabase não configurado.",
      });
      return;
    }

    try {
      setLoadingAction("login");

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message.includes("Invalid login credentials")
            ? "Email ou senha inválidos."
            : error.message,
        });
        return;
      }

      startPostAuthLoading(2500);
      navigate("/app", { replace: true });
    } catch {
      setMessage({ type: "error", text: "Erro inesperado ao entrar. Tente novamente." });
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleForgotPassword() {
    setMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setMessage({ type: "error", text: "Digite seu email acima para recuperar a senha." });
      return;
    }

    if (!isSupabaseConfigured()) {
      setMessage({
        type: "error",
        text: getSupabaseConfigError() ?? "Supabase não configurado.",
      });
      return;
    }

    try {
      setLoadingAction("reset");
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: getAuthRedirectUrl(),
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      setMessage({
        type: "success",
        text: "Se esse email existir, enviamos um link de recuperação.",
      });
    } catch {
      setMessage({ type: "error", text: "Não foi possível enviar o email de recuperação." });
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="ev-login">
      {/* LEFT / HERO */}
      <aside className="ev-left" aria-label="Apresentação do sistema">
        <div className="ev-left__pattern" aria-hidden />

        <div className="ev-left__content">
          <div className="ev-brandRow">
            <img src={logoEvolua} alt="Evolua" className="ev-logo-main" />
          </div>

          <p className="ev-subtitle-main">
            Centralize prontuário, evoluções, prescrições e pendências com foco em cuidado,
            confiança e tecnologia.
          </p>
        </div>

        <div className="ev-left__footer">
          <span>Desenvolvido por</span> <strong> Winiston Alle</strong>
        </div>
      </aside>

      {/* RIGHT / FORM */}
      <main className="ev-right" aria-label="Área de login">
        <div className="ev-card">
          <h2 className="ev-card__title">Bem-vindo</h2>
          <p className="ev-card__subtitle">
            Entre com suas credenciais para acessar o sistema
          </p>

          {/* Mensagem de feedback */}
          {message && (
            <div
              className={`ev-message ${message.type === "error" ? "ev-message--error" : "ev-message--success"}`}
              role="status"
              aria-live="polite"
            >
              {message.text}
            </div>
          )}

          <form className="ev-form" onSubmit={handleLogin}>
            <label className="ev-field">
              <span>Email</span>
              <input
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>

            <label className="ev-field">
              <span>Senha</span>
              <div className="ev-pass">
                <input
                  type={show ? "text" : "password"}
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ev-eye"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                  title={show ? "Ocultar senha" : "Mostrar senha"}
                  disabled={loading}
                >
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </label>

            <button className="ev-submit" type="submit" disabled={loading}>
              {loadingAction === "login" ? (
                <HeartRateLoader size="button" tone="inverse" />
              ) : (
                "Entrar"
              )}
            </button>

            <div className="ev-links">
              <span>Não tem conta?</span>
              <Link to="/cadastro">Criar cadastro</Link>
            </div>

            <div className="ev-links">
              <button type="button" onClick={handleForgotPassword} disabled={loading}>
                {loadingAction === "reset" ? (
                  <HeartRateLoader size="compact" />
                ) : (
                  "Esqueci minha senha"
                )}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() =>
                  setMessage({
                    type: "success",
                    text: "Escreva para evoluapb@gmail.com e retornaremos com suporte.",
                  })
                }
                disabled={loading}
              >
                Suporte
              </button>
            </div>

            <div className="ev-links">
              <Link to="/">Voltar para a página inicial</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
