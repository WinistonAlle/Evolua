import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeartRateLoader from "../../components/HeartRateLoader";
import { usePatients } from "../../hooks/usePatients";
import { createPatientExamLink, type PatientExamLink, type PatientProfile } from "../../lib/patients";
import AppLayout from "../App/AppLayout";
import {
  Btn,
  BtnRow,
  Card,
  CardTitle,
  Content,
  ExamList,
  ExamListInfo,
  ExamListItem,
  Field,
  Helper,
  Input,
  Label,
  ModalBackdrop,
  ModalCard,
  ModalTitle,
  Select,
  Small,
  Subtitle,
  Title,
} from "./styles";

function createInitialProfile(): PatientProfile {
  return {
    examLinks: [],
    recordUrl: "",
    ageLabel: "",
    phone: "",
    email: "",
    insurance: "",
    mainComplaint: "",
    alerts: "",
    observations: "",
    nextSteps: "",
    savedAt: null,
  };
}

type ExamModalState = {
  mode: "create" | "edit";
  id?: string;
  title: string;
  url: string;
  category: PatientExamLink["category"];
};

function getExamCategoryLabel(category: PatientExamLink["category"]) {
  if (category === "laboratory") return "Laboratório";
  if (category === "radiography") return "Raio X";
  return "Outro";
}

export default function NewPatientPage() {
  const navigate = useNavigate();
  const { addPatient } = usePatients();
  const [name, setName] = useState("");
  const [profile, setProfile] = useState<PatientProfile>(createInitialProfile());
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [examModal, setExamModal] = useState<ExamModalState | null>(null);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const cleanName = name.trim().replace(/\s+/g, " ");

    if (!cleanName) {
      setMessage("Informe o nome do paciente para continuar.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const patient = await addPatient(cleanName, profile);
      navigate(`/patients/${patient.id}`, { replace: true });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível criar o paciente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <Content>
        <div style={{ marginBottom: 14 }}>
          <Title>Novo paciente</Title>
          <Subtitle>
            Cadastre o paciente e já deixe prontuário e exames principais prontos para acesso.
          </Subtitle>
        </div>

        <Card as="form" onSubmit={handleCreate}>
          <CardTitle>Cadastro inicial</CardTitle>

          <Field>
            <Label htmlFor="patient-name">Nome completo</Label>
            <Input
              id="patient-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (message) setMessage(null);
              }}
              placeholder="Ex.: Ana Beatriz Souza"
              autoFocus
            />
          </Field>

          <Field>
            <Label htmlFor="patient-record-url">Prontuário do paciente</Label>
            <Input
              id="patient-record-url"
              value={profile.recordUrl}
              onChange={(event) =>
                setProfile((current) => ({ ...current, recordUrl: event.target.value }))
              }
              placeholder="https://... (opcional)"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            <Helper>
              Cole aqui o link do prontuário. Se ainda não tiver esse link, pode criar o
              paciente agora e preencher depois na ficha.
            </Helper>
          </Field>

          <div>
            <Label>Exames</Label>
            <Helper>
              Clique em cadastrar exame para abrir o modal com título, link e tipo.
            </Helper>
          </div>

          <BtnRow>
            <Btn
              type="button"
              onClick={() =>
                setExamModal({
                  mode: "create",
                  title: "",
                  url: "",
                  category: "other",
                })
              }
              $ghost
            >
              + Cadastrar exame
            </Btn>
          </BtnRow>

          <ExamList>
            {profile.examLinks.length === 0 ? <Small>Nenhum exame cadastrado ainda.</Small> : null}

            {profile.examLinks.map((link) => (
              <ExamListItem key={link.id}>
                <ExamListInfo>
                  <strong>{link.label || "Exame sem título"}</strong>
                  <span>
                    {getExamCategoryLabel(link.category)} · {link.url || "Sem link"}
                  </span>
                </ExamListInfo>

                <BtnRow style={{ marginTop: 0 }}>
                  <Btn
                    type="button"
                    onClick={() =>
                      setExamModal({
                        mode: "edit",
                        id: link.id,
                        title: link.label,
                        url: link.url,
                        category: link.category,
                      })
                    }
                    $ghost
                  >
                    Editar
                  </Btn>
                  <Btn
                    type="button"
                    onClick={() =>
                      setProfile((current) => ({
                        ...current,
                        examLinks: current.examLinks.filter((item) => item.id !== link.id),
                      }))
                    }
                    $danger
                  >
                    Remover
                  </Btn>
                </BtnRow>
              </ExamListItem>
            ))}
          </ExamList>

          {message ? <Small>{message}</Small> : null}

          <BtnRow>
            <Btn type="button" onClick={() => navigate("/app")} $ghost disabled={loading}>
              Cancelar
            </Btn>
            <Btn type="submit" $primary disabled={loading}>
              {loading ? (
                <HeartRateLoader size="button" tone="inverse" />
              ) : (
                "Criar paciente"
              )}
            </Btn>
          </BtnRow>
        </Card>
      </Content>

      {examModal ? (
        <ModalBackdrop>
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="new-patient-exam-modal">
            <ModalTitle id="new-patient-exam-modal">
              {examModal.mode === "edit" ? "Editar exame" : "Cadastrar exame"}
            </ModalTitle>
            <Subtitle style={{ marginTop: 8 }}>
              Informe o título, o link e se o exame é de laboratório, raio X ou outro tipo.
            </Subtitle>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              <Field>
                <Label htmlFor="new-patient-exam-title">Título</Label>
                <Input
                  id="new-patient-exam-title"
                  value={examModal.title}
                  onChange={(event) =>
                    setExamModal((current) =>
                      current ? { ...current, title: event.target.value } : current,
                    )
                  }
                  placeholder="Ex.: Exames laboratoriais"
                  autoFocus
                />
              </Field>

              <Field>
                <Label htmlFor="new-patient-exam-url">Link</Label>
                <Input
                  id="new-patient-exam-url"
                  value={examModal.url}
                  onChange={(event) =>
                    setExamModal((current) =>
                      current ? { ...current, url: event.target.value } : current,
                    )
                  }
                  placeholder="https://..."
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </Field>

              <Field>
                <Label htmlFor="new-patient-exam-category">Tipo de exame</Label>
                <Select
                  id="new-patient-exam-category"
                  value={examModal.category}
                  onChange={(event) =>
                    setExamModal((current) =>
                      current
                        ? {
                            ...current,
                            category: event.target.value as PatientExamLink["category"],
                          }
                        : current,
                    )
                  }
                >
                  <option value="laboratory">Laboratório</option>
                  <option value="radiography">Raio X</option>
                  <option value="other">Outro</option>
                </Select>
              </Field>
            </div>

            <BtnRow>
              <Btn type="button" onClick={() => setExamModal(null)} $ghost>
                Cancelar
              </Btn>
              <Btn
                type="button"
                onClick={() => {
                  const title = examModal.title.trim();
                  const url = examModal.url.trim();

                  if (!title || !url) {
                    setMessage("Preencha título e link do exame antes de salvar.");
                    return;
                  }

                  const nextExam = createPatientExamLink(title, url, examModal.category);

                  setProfile((current) => ({
                    ...current,
                    examLinks:
                      examModal.mode === "edit" && examModal.id
                        ? current.examLinks.map((item) =>
                            item.id === examModal.id ? { ...nextExam, id: examModal.id } : item,
                          )
                        : [...current.examLinks, nextExam],
                  }));

                  setExamModal(null);
                  if (message) setMessage(null);
                }}
                $primary
              >
                Salvar exame
              </Btn>
            </BtnRow>
          </ModalCard>
        </ModalBackdrop>
      ) : null}
    </AppLayout>
  );
}
