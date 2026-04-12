import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppErrorBoundary } from "./components/AppErrorBoundary";
import { AuthProvider } from "./contexts/AuthContext";
import { PatientsProvider } from "./contexts/PatientsProvider";
import { AppThemeProvider } from "./theme/theme";

createRoot(document.getElementById("root")!).render(
  <AppThemeProvider>
    <AppErrorBoundary>
      <AuthProvider>
        <PatientsProvider>
          <App />
        </PatientsProvider>
      </AuthProvider>
    </AppErrorBoundary>
  </AppThemeProvider>,
);
