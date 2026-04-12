import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logoEvolua from "../../assets/logo_evolua-optimized.png";
import HeartRateLoader from "../../components/HeartRateLoader";
import "../Login/login.css";
import { startPostAuthLoading } from "../../lib/post-auth-loading";
import {
  getAuthRedirectUrl,
  getSupabaseConfigError,
  isSupabaseConfigured,
  supabase,
} from "../../lib/supabase";

type FeedbackMessage = {
  type: "error" | "success";
  text: string;
};

type PasswordRule = {
  id: string;
  label: string;
  valid: boolean;
};

function getPasswordRules(password: string): PasswordRule[] {
  return [
    {
      id: "length",
      label: "Pelo menos 8 caracteres",
      valid: password.length >= 8,
    },
    {
      id: "upper",
      label: "Uma letra maiúscula",
      valid: /[A-Z]/.test(password),
    },
    {
      id: "lower",
      label: "Uma letra minúscula",
      valid: /[a-z]/.test(password),
    },
    {
      id: "number",
      label: "Um número",
      valid: /\d/.test(password),
    },
    {
      id: "special",
      label: "Um caractere especial",
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];
}

function getPasswordValidationMessage(password: string) {
  const failedRules = getPasswordRules(password).filter((rule) => !rule.valid);

  if (failedRules.length === 0) {
    return null;
  }

  return "A senha deve ter 8 caracteres, com letra maiúscula, minúscula, número e caractere especial.";
}

function getReadableSignupError(message: string) {
  if (message.includes("User already registered")) {
    return "Esse email já está cadastrado. Tente entrar ou redefinir sua senha.";
  }

  if (message.includes("Password should be at least")) {
    return "A senha não atende à política do projeto. Use uma senha mais forte.";
  }

  if (message.includes("Signup is disabled")) {
    return "O cadastro está desativado no projeto Supabase.";
  }

  if (message.includes("redirect")) {
    return "O redirecionamento de confirmação não está autorizado no Supabase.";
  }

  return message;
}

export default function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<"signup" | null>(null);
  const [message, setMessage] = useState<FeedbackMessage | null>(null);
  const [verificationEmail, setVerificationEmail] = useState("");
  const passwordRules = getPasswordRules(password);
  const loading = loadingAction !== null;

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    const cleanName = fullName.trim().replace(/\s+/g, " ");
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setMessage({ type: "error", text: "Preencha nome, email e senha para continuar." });
      return;
    }

    const passwordValidationMessage = getPasswordValidationMessage(password);
    if (passwordValidationMessage) {
      setMessage({ type: "error", text: passwordValidationMessage });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "A confirmação da senha não confere." });
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
      setLoadingAction("signup");

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
          },
          emailRedirectTo: getAuthRedirectUrl(),
        },
      });

      if (error) {
        setMessage({ type: "error", text: getReadableSignupError(error.message) });
        return;
      }

      if (data.session) {
        startPostAuthLoading(2500);
        navigate("/app", { replace: true });
        return;
      }

      setMessage({
        type: "success",
        text: "Conta criada. Verifique seu email para confirmar o cadastro antes de entrar.",
      });
      setVerificationEmail(cleanEmail);
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const details = error instanceof Error ? error.message : "";
      setMessage({
        type: "error",
        text: details
          ? `Não foi possível concluir o cadastro agora. ${details}`
          : "Não foi possível concluir o cadastro agora. Tente novamente.",
      });
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="ev-login">
      {verificationEmail && (
        <div
          className="ev-modalBackdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="email-verification-title"
        >
          <div className="ev-modalGlass">
            <div className="ev-modalGlass__orb" aria-hidden />
            <div className="ev-modalGlass__content">
              <span className="ev-modalGlass__eyebrow">Cadastro quase pronto</span>
              <h3 id="email-verification-title" className="ev-modalGlass__title">
                Verifique seu email para liberar o acesso
              </h3>
              <p className="ev-modalGlass__text">
                Enviamos um link de confirmação para:
              </p>
              <div className="ev-modalGlass__email">{verificationEmail}</div>
              <p className="ev-modalGlass__hint">
                Abra sua caixa de entrada, procure pelo email do Evolua e clique no link de
                confirmação antes de tentar entrar no sistema.
              </p>
              <div className="ev-modalGlass__actions">
                <button
                  type="button"
                  className="ev-submit ev-submit--ghost"
                  onClick={() => setVerificationEmail("")}
                >
                  Revisar cadastro
                </button>
                <Link className="ev-submit ev-submit--link" to="/login">
                  Ir para login
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <aside className="ev-left" aria-label="Apresentação do sistema">
        <div className="ev-left__pattern" aria-hidden />

        <div className="ev-left__content">
          <div className="ev-brandRow">
            <img src={logoEvolua} alt="Evolua" className="ev-logo-main" />
          </div>

          <p className="ev-subtitle-main">
            Crie seu acesso para começar a organizar prontuários, evoluções e o fluxo do
            atendimento em um só lugar.
          </p>
        </div>

        <div className="ev-left__footer">
          <span>Desenvolvido por</span> <strong> Winiston Alle</strong>
        </div>
      </aside>

      <main className="ev-right" aria-label="Área de cadastro">
        <div className="ev-card">
          <h2 className="ev-card__title">Criar conta</h2>
          <p className="ev-card__subtitle">
            Cadastre-se para acessar a plataforma Evolua
          </p>

          {message && (
            <div
              className={`ev-message ${message.type === "error" ? "ev-message--error" : "ev-message--success"}`}
              role="status"
              aria-live="polite"
            >
              {message.text}
            </div>
          )}

          <form className="ev-form" onSubmit={handleSignup}>
            <label className="ev-field">
              <span>Nome completo</span>
              <input
                type="text"
                placeholder="Seu nome"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </label>

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
                  type={showPassword ? "text" : "password"}
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ev-eye"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
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
              <div className="ev-passwordRules" aria-live="polite">
                {passwordRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`ev-passwordRule ${rule.valid ? "is-valid" : ""}`}
                  >
                    <span className="ev-passwordRule__icon" aria-hidden>
                      {rule.valid ? "✓" : "•"}
                    </span>
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            </label>

            <label className="ev-field">
              <span>Confirmar senha</span>
              <div className="ev-pass">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="ev-eye"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  title={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
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
              {loadingAction === "signup" ? (
                <HeartRateLoader size="button" tone="inverse" />
              ) : (
                "Criar conta"
              )}
            </button>

            <div className="ev-links">
              <span>Já tem uma conta?</span>
              <Link to="/login">Entrar</Link>
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
