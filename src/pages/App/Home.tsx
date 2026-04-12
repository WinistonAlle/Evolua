import { Link } from "react-router-dom";
import { useDeferredValue, useMemo, useState } from "react";
import AppLayout from "./AppLayout";
import { usePatients } from "../../hooks/usePatients";
import {
  CardTitle,
  Content,
  EmptyState,
  Field,
  HeaderPrimaryButton,
  InfoList,
  InfoRow,
  MetricCard,
  MetricsGrid,
  NewPatientButton,
  PageActions,
  PageHeader,
  PageTitle,
  PatientSummaryCard,
  PatientsGrid,
  SearchInput,
  SubtleText,
  MetricValue,
  WideCard,
} from "./styles";

export default function Home() {
  const { patients } = usePatients();
  const activePatients = patients.filter((patient) => patient.status !== "discharged");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  const filteredPatients = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();
    if (!normalized) return patients;

    return patients.filter((patient) => {
      return [patient.name, patient.email || "", patient.phone || "", patient.insurance || ""]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
    });
  }, [patients, deferredQuery]);

  const recentPatients = filteredPatients.slice(0, 6);

  return (
    <AppLayout>
      <Content>
        <PageHeader>
          <PageTitle>Painel clínico</PageTitle>
          <PageActions>
            <HeaderPrimaryButton as={Link} to="/patients/new">
              + Novo paciente
            </HeaderPrimaryButton>
          </PageActions>
        </PageHeader>

        <MetricsGrid>
          <MetricCard>
            <CardTitle>Pacientes ativos</CardTitle>
            <MetricValue>{activePatients.length}</MetricValue>
            <SubtleText>Base sincronizada com Supabase.</SubtleText>
          </MetricCard>

          <MetricCard>
            <CardTitle>Resultados da busca</CardTitle>
            <MetricValue>{filteredPatients.length}</MetricValue>
            <SubtleText>Filtro por nome, email, telefone ou convênio.</SubtleText>
          </MetricCard>

          <MetricCard>
            <CardTitle>Próximo passo</CardTitle>
            <MetricValue>{patients.length === 0 ? "0" : "1"}</MetricValue>
            <SubtleText>Adicionar evolução clínica e timeline por paciente.</SubtleText>
          </MetricCard>
        </MetricsGrid>

        <WideCard>
          <CardTitle>Busca rápida</CardTitle>
          <Field>
            <SearchInput
              placeholder="Buscar paciente por nome, email, telefone ou convênio"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </Field>
        </WideCard>

        {recentPatients.length > 0 ? (
          <PatientsGrid>
            {recentPatients.map((patient) => (
              <PatientSummaryCard key={patient.id}>
                <CardTitle>{patient.name}</CardTitle>
                <SubtleText>
                  Criado em {new Date(patient.createdAt).toLocaleDateString()}
                </SubtleText>
                <InfoList>
                  <InfoRow>
                    <strong>Telefone:</strong> {patient.phone || "Não informado"}
                  </InfoRow>
                  <InfoRow>
                    <strong>Email:</strong> {patient.email || "Não informado"}
                  </InfoRow>
                  <InfoRow>
                    <strong>Convênio:</strong> {patient.insurance || "Não informado"}
                  </InfoRow>
                </InfoList>
                <div style={{ marginTop: 14 }}>
                  <NewPatientButton as={Link} to={`/patients/${patient.id}`}>
                    Abrir ficha
                  </NewPatientButton>
                </div>
              </PatientSummaryCard>
            ))}
          </PatientsGrid>
        ) : (
          <EmptyState>
            <h2>{patients.length === 0 ? "Cadastre o primeiro paciente" : "Nenhum resultado"}</h2>
            <p>
              {patients.length === 0
                ? "Sua base ainda está vazia. Crie o primeiro paciente para começar os atendimentos."
                : "A busca atual não retornou pacientes. Ajuste o filtro ou abra um cadastro novo."}
            </p>
            <NewPatientButton as={Link} to="/patients/new">
              + Novo paciente
            </NewPatientButton>
          </EmptyState>
        )}
      </Content>
    </AppLayout>
  );
}
