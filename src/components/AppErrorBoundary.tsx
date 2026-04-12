import { Component, type ErrorInfo, type ReactNode } from "react";
import HeartRateLoader from "./HeartRateLoader";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled application error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "24px",
            background:
              "radial-gradient(circle at top left, rgba(126, 211, 214, 0.18), transparent 38%), var(--shell-background)",
          }}
        >
          <div
            style={{
              width: "min(520px, 100%)",
              display: "grid",
              gap: "20px",
              padding: "32px",
              borderRadius: "28px",
              background: "var(--surface)",
              boxShadow: "0 24px 80px rgba(15, 23, 42, 0.16)",
              border: "1px solid var(--border)",
              textAlign: "center",
            }}
          >
            <HeartRateLoader label="" />
            <div style={{ display: "grid", gap: "10px" }}>
              <h1
                style={{
                  margin: 0,
                  color: "var(--text-primary)",
                  fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
                }}
              >
                O sistema encontrou uma falha inesperada.
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  fontSize: "1rem",
                }}
              >
                Recarregue a página. Se o problema persistir, revise os dados recentes antes de seguir.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
