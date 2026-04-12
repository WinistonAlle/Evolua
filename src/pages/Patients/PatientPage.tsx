import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeartRateLoader from "../../components/HeartRateLoader";
import { usePatients } from "../../hooks/usePatients";
import {
  createPatientExamLink,
  type PatientExamLink,
  type PatientProfile,
} from "../../lib/patients";
import AppLayout from "../App/AppLayout";

import {
  Btn,
  BtnRow,
  Card,
  CardSubtitle,
  CardTitle,
  ConfirmGlassActions,
  ConfirmGlassCard,
  ConfirmGlassContent,
  ConfirmGlassEyebrow,
  ConfirmGlassOrb,
  ConfirmGlassPatient,
  ConfirmGlassText,
  ConfirmGlassTitle,
  Content,
  EyeToggleButton,
  Divider,
  ExamList,
  ExamListInfo,
  ExamListItem,
  Field,
  FormGrid,
  HeaderRow,
  Helper,
  Input,
  InlineActions,
  Label,
  LinkActionButton,
  LinkButtonsGrid,
  LinksToolbar,
  ModalBackdrop,
  ModalCard,
  ModalTitle,
  PreviewLabel,
  SensitiveLinkText,
  Select,
  Small,
  Textarea,
  Title,
} from "./styles";

function normalizeUrl(raw: string) {
  const value = (raw || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w-]+(\.[\w-]+)+/i.test(value)) return `https://${value}`;
  return value;
}

function isHttpUrl(raw: string) {
  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function createEmptyProfile(): PatientProfile {
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

function normalizeExamLinkForSave(link: PatientExamLink) {
  return {
    ...link,
    label: link.label.trim(),
    url: normalizeUrl(link.url),
    category: link.category,
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

function EyeIcon({ hidden }: { hidden: boolean }) {
  if (hidden) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M3 4.5 20 19.5M10.6 10.4a3 3 0 0 0 4 4M9.4 5.8A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a16.7 16.7 0 0 1-3.1 3.8M6.1 8.1C3.7 10 2 12 2 12s3.5 7 10 7c1.8 0 3.3-.3 4.6-.9"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PatientPageContent({ patientId }: { patientId: string }) {
  const navigate = useNavigate();
  const {
    dischargePatient,
    getPatientById,
    getPatientProfile,
    savePatientProfile,
    loading: patientsLoading,
    saving,
  } = usePatients();
  const patient = getPatientById(patientId);
  const [profile, setProfile] = useState<PatientProfile>(createEmptyProfile());
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editingLinks, setEditingLinks] = useState(false);
  const [examsExpanded, setExamsExpanded] = useState(false);
  const [linksHidden, setLinksHidden] = useState(true);
  const [examModal, setExamModal] = useState<ExamModalState | null>(null);
  const [confirmingDischarge, setConfirmingDischarge] = useState(false);
  const recordFieldRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        setLoadingProfile(true);
        const nextProfile = await getPatientProfile(patientId);
        if (!active) return;
        setProfile(nextProfile);
        setSavedAt(nextProfile.savedAt || null);
        setFeedback(null);
      } catch (error) {
        if (!active) return;
        setFeedback(error instanceof Error ? error.message : "Não foi possível carregar o perfil.");
      } finally {
        if (active) setLoadingProfile(false);
      }
    }

    void loadProfile();

    return () => {
      active = false;
    };
  }, [getPatientProfile, patientId]);

  const normalizedRecord = useMemo(() => normalizeUrl(profile.recordUrl), [profile.recordUrl]);
  const normalizedExamLinks = useMemo(
    () =>
      profile.examLinks.map((link, index) => {
        const normalized = normalizeExamLinkForSave(link);
        return {
          ...normalized,
          label: normalized.label || `Exame ${index + 1}`,
        };
      }),
    [profile.examLinks],
  );

  const visibleExamButtons = normalizedExamLinks.filter((link) => isHttpUrl(link.url));
  const canOpenRecord = isHttpUrl(normalizedRecord);
  const isDischarged = patient?.status === "discharged";
  const pageTitle = patient?.name
    ? patient.name
    : loadingProfile || patientsLoading
      ? "Carregando paciente..."
      : "Paciente não encontrado";

  useEffect(() => {
    document.title = patient?.name ? `${patient.name} | Evolua` : "Paciente | Evolua";

    return () => {
      document.title = "Evolua";
    };
  }, [patient?.name]);

  async function handleSave() {
    const payload: PatientProfile = {
      examLinks: profile.examLinks
        .map(normalizeExamLinkForSave)
        .filter((link) => link.label || link.url),
      recordUrl: normalizedRecord,
      ageLabel: profile.ageLabel.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
      insurance: profile.insurance.trim(),
      mainComplaint: profile.mainComplaint.trim(),
      alerts: profile.alerts.trim(),
      observations: profile.observations.trim(),
      nextSteps: profile.nextSteps.trim(),
      savedAt: new Date().toISOString(),
    };

    try {
      await savePatientProfile(patientId, payload);
      setProfile(payload);
      setSavedAt(payload.savedAt ?? null);
      setEditingLinks(false);
      setFeedback("Ficha salva com sucesso.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível salvar a ficha.");
    }
  }

  async function handleDischarge() {
    if (isDischarged) return;

    try {
      await dischargePatient(patientId);
      navigate("/app", { replace: true });
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Não foi possível dar alta agora.");
    } finally {
      setConfirmingDischarge(false);
    }
  }

  function openUrl(url: string) {
    const normalizedUrl = normalizeUrl(url);
    if (!isHttpUrl(normalizedUrl)) return;
    window.open(normalizedUrl, "_blank", "noopener,noreferrer");
  }

  function openRecordEditor() {
    setEditingLinks(true);
    setFeedback(null);

    window.requestAnimationFrame(() => {
      recordFieldRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function openCreateExamModal() {
    setExamModal({
      mode: "create",
      title: "",
      url: "",
      category: "other",
    });
  }

  function openEditExamModal(link: PatientExamLink) {
    setExamModal({
      mode: "edit",
      id: link.id,
      title: link.label,
      url: link.url,
      category: link.category,
    });
  }

  function removeExamLink(linkId: string) {
    setProfile((current) => ({
      ...current,
      examLinks: current.examLinks.filter((link) => link.id !== linkId),
    }));
  }

  function handleSaveExamModal() {
    if (!examModal) return;

    const label = examModal.title.trim();
    const url = examModal.url.trim();

    if (!label || !url) {
      setFeedback("Preencha título e link do exame antes de salvar.");
      return;
    }

    const nextLink = createPatientExamLink(label, url, examModal.category);

    setProfile((current) => ({
      ...current,
      examLinks:
        examModal.mode === "edit" && examModal.id
          ? current.examLinks.map((link) =>
              link.id === examModal.id ? { ...nextLink, id: examModal.id } : link,
            )
          : [...current.examLinks, nextLink],
    }));

    setExamModal(null);
    setEditingLinks(true);
    setFeedback(null);
  }

  return (
    <AppLayout>
      <Content>
        <HeaderRow>
          <div>
            <Title>{pageTitle}</Title>
          </div>

          <BtnRow>
            <Btn onClick={() => navigate("/app")} $ghost>
              Voltar
            </Btn>
            <Btn onClick={() => navigate("/patients/new")} $primary>
              Novo paciente
            </Btn>
            {!isDischarged ? (
              <Btn
                onClick={() => setConfirmingDischarge(true)}
                $danger
                disabled={saving || loadingProfile}
              >
                Dar alta
              </Btn>
            ) : null}
          </BtnRow>
        </HeaderRow>

        <Card>
          <CardTitle>Links do paciente</CardTitle>

          <LinksToolbar>
            <Small>
              {feedback ? (
                feedback
              ) : loadingProfile || patientsLoading ? (
                <HeartRateLoader size="compact" />
              ) : savedAt ? (
                <>
                  Último salvamento: <strong>{new Date(savedAt).toLocaleString()}</strong>
                </>
              ) : (
                "Ainda não há links salvos para este paciente."
              )}
            </Small>

            <InlineActions>
              <EyeToggleButton
                type="button"
                onClick={() => setLinksHidden((current) => !current)}
                aria-label={linksHidden ? "Mostrar links" : "Ocultar links"}
                title={linksHidden ? "Mostrar links" : "Ocultar links"}
              >
                <EyeIcon hidden={linksHidden} />
              </EyeToggleButton>
              <BtnRow style={{ marginTop: 0 }}>
                <Btn type="button" onClick={() => setEditingLinks((current) => !current)} $ghost>
                  {editingLinks ? "Fechar edição" : "Editar prontuário e exames"}
                </Btn>
                {editingLinks ? (
                  <Btn onClick={handleSave} $primary disabled={loadingProfile || saving}>
                    {saving ? (
                      <HeartRateLoader size="button" tone="inverse" />
                    ) : (
                      "Salvar links"
                    )}
                  </Btn>
                ) : null}
              </BtnRow>
            </InlineActions>
          </LinksToolbar>

          <LinkButtonsGrid>
            <LinkActionButton
              type="button"
              onClick={() => (canOpenRecord ? openUrl(normalizedRecord) : openRecordEditor())}
            >
              <strong>Prontuário</strong>
              <span>
                {canOpenRecord
                  ? linksHidden
                    ? "Link oculto"
                    : "Abrir prontuário do paciente"
                  : "Clique para cadastrar o link do prontuário"}
              </span>
            </LinkActionButton>

            <LinkActionButton
              type="button"
              onClick={() =>
                visibleExamButtons.length > 0
                  ? setExamsExpanded((current) => !current)
                  : setEditingLinks(true)
              }
            >
              <strong>Exames</strong>
              <span>
                {visibleExamButtons.length > 0
                  ? examsExpanded
                    ? "Fechar lista de exames"
                    : `Abrir ${visibleExamButtons.length} link(s) de exame`
                  : "Cadastre os links de exame na edição"}
              </span>
            </LinkActionButton>
          </LinkButtonsGrid>

          {examsExpanded && visibleExamButtons.length > 0 ? (
            <ExamList>
              {visibleExamButtons.map((link) => (
                <ExamListItem
                  key={link.id}
                  type="button"
                  onClick={() => openUrl(link.url)}
                  title={link.label}
                >
                  <ExamListInfo>
                    <strong>{link.label}</strong>
                    <span>
                      {getExamCategoryLabel(link.category)} ·{" "}
                      <SensitiveLinkText $hidden={linksHidden}>{link.url}</SensitiveLinkText>
                    </span>
                  </ExamListInfo>
                </ExamListItem>
              ))}
            </ExamList>
          ) : null}

          {!canOpenRecord && visibleExamButtons.length === 0 ? (
            <Small style={{ marginTop: 14 }}>
              Nenhum link está pronto para abertura ainda. Comece cadastrando o prontuário
              e depois adicione os exames.
            </Small>
          ) : null}

          {editingLinks ? (
            <>
              <Divider />

              <div style={{ display: "grid", gap: 14 }}>
                <Field ref={recordFieldRef}>
                  <Label htmlFor="patient-record-url">Link do prontuário</Label>
                  <Input
                    id="patient-record-url"
                    value={profile.recordUrl}
                    onChange={(event) =>
                      setProfile((current) => ({ ...current, recordUrl: event.target.value }))
                    }
                    placeholder="https://... (ou cole: www.site.com/prontuario)"
                    inputMode="url"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                  <Helper>
                    Cole aqui o link do prontuário. Depois de salvar, o botão de prontuário
                    fica disponível na ficha principal.
                  </Helper>
                </Field>

                <div>
                  <PreviewLabel>Botões de exames</PreviewLabel>
                  <Helper>
                    Cada exame é cadastrado em um modal com título, link e tipo.
                  </Helper>
                </div>

                <BtnRow>
                  <Btn type="button" onClick={openCreateExamModal} $soft>
                    + Cadastrar exame
                  </Btn>
                </BtnRow>

                <ExamList>
                  {profile.examLinks.length === 0 ? (
                    <Small>Nenhum botão de exame criado ainda.</Small>
                  ) : null}

                  {profile.examLinks.map((link) => (
                    <ExamListItem key={link.id}>
                      <ExamListInfo>
                        <strong>{link.label || "Exame sem título"}</strong>
                        <span>
                          {getExamCategoryLabel(link.category)} · {link.url || "Sem link"}
                        </span>
                      </ExamListInfo>

                      <BtnRow style={{ marginTop: 0 }}>
                        <Btn type="button" onClick={() => openEditExamModal(link)} $ghost>
                          Editar
                        </Btn>
                        <Btn type="button" onClick={() => removeExamLink(link.id)} $danger>
                          Remover
                        </Btn>
                      </BtnRow>
                    </ExamListItem>
                  ))}
                </ExamList>
              </div>
            </>
          ) : null}
        </Card>

        <Card>
          <CardTitle>Informações de apoio</CardTitle>
          <CardSubtitle>
            Dados complementares e anotações rápidas para contexto do atendimento.
          </CardSubtitle>

          <FormGrid>
            <Field>
              <Label htmlFor="patient-phone">Telefone</Label>
              <Input
                id="patient-phone"
                value={profile.phone}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="(11) 99999-9999"
                inputMode="tel"
              />
            </Field>

            <Field>
              <Label htmlFor="patient-email">Email</Label>
              <Input
                id="patient-email"
                value={profile.email}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="paciente@email.com"
                inputMode="email"
                autoCapitalize="none"
              />
            </Field>

            <Field>
              <Label htmlFor="patient-insurance">Convênio / origem</Label>
              <Input
                id="patient-insurance"
                value={profile.insurance}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, insurance: event.target.value }))
                }
                placeholder="Ex.: Unimed, Bradesco, Particular"
              />
            </Field>

            <Field>
              <Label htmlFor="patient-age-label">Idade ou faixa etária</Label>
              <Input
                id="patient-age-label"
                value={profile.ageLabel}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, ageLabel: event.target.value }))
                }
                placeholder="Ex.: 42 anos"
              />
            </Field>
          </FormGrid>

          <Divider />

          <Field>
            <Label htmlFor="patient-alerts">Alertas importantes</Label>
            <Textarea
              id="patient-alerts"
              value={profile.alerts}
              onChange={(event) =>
                setProfile((current) => ({ ...current, alerts: event.target.value }))
              }
              placeholder="Alergias, restrições, riscos, preferências ou informações críticas."
            />
          </Field>

          <Field>
            <Label htmlFor="patient-observations">Observações</Label>
            <Textarea
              id="patient-observations"
              value={profile.observations}
              onChange={(event) =>
                setProfile((current) => ({ ...current, observations: event.target.value }))
              }
              placeholder="Anotações livres sobre evolução, contexto, orientação ou pendências."
            />
          </Field>

          <BtnRow>
            <Btn onClick={handleSave} $soft disabled={loadingProfile || saving}>
              {saving ? (
                <HeartRateLoader size="button" />
              ) : (
                "Salvar observações"
              )}
            </Btn>
          </BtnRow>
        </Card>
      </Content>

      {examModal ? (
        <ModalBackdrop>
          <ModalCard role="dialog" aria-modal="true" aria-labelledby="exam-modal-title">
            <ModalTitle id="exam-modal-title">
              {examModal.mode === "edit" ? "Editar exame" : "Cadastrar exame"}
            </ModalTitle>
            <CardSubtitle style={{ marginTop: 8 }}>
              Defina o título do botão, o link e o tipo do exame.
            </CardSubtitle>

            <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
              <Field>
                <Label htmlFor="exam-modal-title-input">Título</Label>
                <Input
                  id="exam-modal-title-input"
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
                <Label htmlFor="exam-modal-url-input">Link</Label>
                <Input
                  id="exam-modal-url-input"
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
                <Label htmlFor="exam-modal-category-input">Tipo de exame</Label>
                <Select
                  id="exam-modal-category-input"
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
              <Btn type="button" onClick={handleSaveExamModal} $primary>
                Salvar exame
              </Btn>
            </BtnRow>
          </ModalCard>
        </ModalBackdrop>
      ) : null}

      {confirmingDischarge ? (
        <ModalBackdrop>
          <ConfirmGlassCard
            role="dialog"
            aria-modal="true"
            aria-labelledby="discharge-confirm-title"
          >
            <ConfirmGlassOrb aria-hidden />
            <ConfirmGlassContent>
              <ConfirmGlassEyebrow>Confirmação de alta</ConfirmGlassEyebrow>
              <ConfirmGlassTitle id="discharge-confirm-title">
                Dar alta deste paciente?
              </ConfirmGlassTitle>
              <ConfirmGlassText>
                A ficha continua salva, mas o paciente sai da lista principal e do fluxo ativo.
              </ConfirmGlassText>
              <ConfirmGlassPatient>{patient?.name || "Paciente selecionado"}</ConfirmGlassPatient>

              <ConfirmGlassActions>
                <Btn
                  type="button"
                  onClick={() => setConfirmingDischarge(false)}
                  $ghost
                  disabled={saving}
                >
                  Cancelar
                </Btn>
                <Btn type="button" onClick={handleDischarge} $danger disabled={saving}>
                  {saving ? <HeartRateLoader size="button" /> : "Confirmar alta"}
                </Btn>
              </ConfirmGlassActions>
            </ConfirmGlassContent>
          </ConfirmGlassCard>
        </ModalBackdrop>
      ) : null}
    </AppLayout>
  );
}

export default function PatientPage() {
  const { id } = useParams();
  const patientId = id || "unknown";

  return <PatientPageContent key={patientId} patientId={patientId} />;
}
