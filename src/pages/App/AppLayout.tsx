import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeartRateLoader from "../../components/HeartRateLoader";
import ThemeToggle from "../../components/ThemeToggle";
import { usePatients } from "../../hooks/usePatients";
import { supabase } from "../../lib/supabase";

import {
  ActionButton,
  ActionsStack,
  BrandLogo,
  BrandName,
  BrandRow,
  Content,
  Layout,
  MobileMenuButton,
  NewPatientButton,
  PatientItem,
  PatientsList,
  Sidebar,
  SidebarControls,
  SidebarFooter,
  SidebarHeader,
  SidebarHeaderRow,
  SidebarNav,
  SidebarNavButton,
  SidebarSectionTitle,
  SidebarHint,
} from "./styles";

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { patients, loading, error } = usePatients();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activePatients = patients.filter((patient) => patient.status !== "discharged");
  const dischargedPatients = patients.filter((patient) => patient.status === "discharged");

  const match = location.pathname.match(/^\/patients\/([^/]+)$/);
  const activePatientId = match ? match[1] : null;
  const activePath = location.pathname;

  function goTo(path: string) {
    setMobileMenuOpen(false);
    navigate(path);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  }

  return (
    <Layout>
      <Sidebar $collapsed={!mobileMenuOpen}>
        <SidebarHeader>
          <SidebarHeaderRow>
            <BrandRow onClick={() => goTo("/app")} title="Evolua">
              <BrandLogo src="/favicon.png" alt="Evolua" />
              <BrandName>Evolua</BrandName>
            </BrandRow>
            <SidebarControls>
              <ThemeToggle compact />
              <MobileMenuButton onClick={() => setMobileMenuOpen((value) => !value)}>
                {mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
              </MobileMenuButton>
            </SidebarControls>
          </SidebarHeaderRow>
        </SidebarHeader>

        <PatientsList $collapsed={!mobileMenuOpen}>
          <SidebarSectionTitle>Visão geral</SidebarSectionTitle>
          <SidebarNav>
            <SidebarNavButton
              $active={activePath === "/app"}
              onClick={() => goTo("/app")}
            >
              Painel
            </SidebarNavButton>
            <SidebarNavButton
              $active={activePath === "/settings"}
              onClick={() => goTo("/settings")}
            >
              Configurações
            </SidebarNavButton>
          </SidebarNav>

          <SidebarSectionTitle>Pacientes</SidebarSectionTitle>
          {loading ? (
            <SidebarHint>
              <HeartRateLoader size="compact" />
            </SidebarHint>
          ) : null}
          {!loading && error ? <SidebarHint>{error}</SidebarHint> : null}
          {!loading && !error && activePatients.length === 0 ? (
            <SidebarHint>Nenhum paciente cadastrado ainda.</SidebarHint>
          ) : null}
          {activePatients.map((patient) => (
            <PatientItem
              key={patient.id}
              $active={activePatientId === patient.id}
              onClick={() => goTo(`/patients/${patient.id}`)}
              title={patient.name}
            >
              {patient.name}
            </PatientItem>
          ))}

          {dischargedPatients.length > 0 ? (
            <>
              <SidebarSectionTitle>Altas</SidebarSectionTitle>
              {dischargedPatients.map((patient) => (
                <PatientItem
                  key={patient.id}
                  $active={activePatientId === patient.id}
                  onClick={() => goTo(`/patients/${patient.id}`)}
                  title={patient.name}
                >
                  {patient.name}
                </PatientItem>
              ))}
            </>
          ) : null}
        </PatientsList>

        <SidebarFooter $collapsed={!mobileMenuOpen}>
          <ActionsStack>
            <NewPatientButton onClick={() => goTo("/patients/new")}>
              + Novo paciente
            </NewPatientButton>
            <ActionButton onClick={handleLogout}>Sair</ActionButton>
          </ActionsStack>
        </SidebarFooter>
      </Sidebar>

      <Content>{children}</Content>
    </Layout>
  );
}
