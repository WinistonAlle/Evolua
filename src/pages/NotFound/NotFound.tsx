import { Link } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";
import { useAuth } from "../../contexts/useAuth";

export default function NotFound() {
  const { session } = useAuth();
  const destination = session ? "/app" : "/";
  const label = session ? "Voltar para o painel" : "Voltar para a página inicial";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        position: "relative",
        background: "var(--shell-background)",
      }}
    >
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <ThemeToggle />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: 560,
          padding: 32,
          borderRadius: 24,
          background: "var(--panel-background)",
          border: "1px solid var(--line-soft)",
          boxShadow: "var(--shadow-strong)",
          backdropFilter: "blur(22px) saturate(140%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 60,
            fontWeight: 900,
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.05em",
          }}
        >
          404
        </div>
        <h1
          style={{
            margin: "8px 0 10px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-display)",
            letterSpacing: "-0.04em",
          }}
        >
          Página não encontrada
        </h1>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>
          O endereço acessado não existe ou foi movido.
        </p>

        <Link
          to={destination}
          style={{
            display: "inline-flex",
            marginTop: 20,
            padding: "12px 18px",
            borderRadius: 14,
            background: "var(--button-primary)",
            color: "var(--text-on-accent)",
            fontWeight: 800,
            textDecoration: "none",
            boxShadow: "var(--button-primary-shadow)",
          }}
        >
          {label}
        </Link>
      </div>
    </main>
  );
}
