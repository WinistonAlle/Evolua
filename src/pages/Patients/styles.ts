import styled from "styled-components";

export const Content = styled.div`
  width: 100%;
  padding: 18px;
  max-width: 1100px;

  @media (max-width: 640px) {
    padding: 0;
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 720px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const Title = styled.h1`
  margin: 0;
  font-family: var(--font-display);
  font-size: 28px;
  line-height: 1.04;
  letter-spacing: -0.04em;
  color: var(--text-primary);

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

export const Subtitle = styled.div`
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 13px;

  strong {
    color: var(--text-primary);
  }
`;

export const Card = styled.div`
  background: var(--panel-background);
  border: 1px solid var(--line-soft);
  border-radius: 22px;
  padding: 20px;
  backdrop-filter: blur(20px) saturate(140%);
  box-shadow: var(--card-shadow);

  @media (max-width: 640px) {
    padding: 16px;
    border-radius: 18px;
  }
`;

export const CardTitle = styled.h2`
  margin: 0 0 12px;
  color: var(--text-primary);
  font-family: var(--font-display);
  letter-spacing: -0.03em;
  font-size: 18px;
`;

export const CardSubtitle = styled.div`
  margin: -4px 0 14px;
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.6;
`;

export const StatusPill = styled.span<{ $tone?: "default" | "warning" }>`
  display: inline-flex;
  align-items: center;
  padding: 7px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $tone }) =>
    $tone === "warning" ? "var(--danger-text)" : "var(--text-secondary)"};
  background: ${({ $tone }) =>
    $tone === "warning" ? "var(--danger-bg)" : "rgba(var(--accent-rgb), 0.12)"};
  border: 1px solid
    ${({ $tone }) =>
      $tone === "warning" ? "var(--danger-border)" : "rgba(var(--accent-rgb), 0.18)"};
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  background: var(--field-muted);
  border: 1px solid var(--line-soft);
  border-radius: 16px;
  padding: 12px;
`;

export const Label = styled.label`
  display: block;
  font-weight: 800;
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid var(--line-soft);
  background: var(--field-background);
  border-radius: 14px;
  padding: 12px 13px;
  outline: none;
  font-weight: 700;
  color: var(--text-primary);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;

  &:focus {
    border-color: rgba(var(--accent-rgb), 0.46);
    box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.12);
  }

  &::placeholder {
    color: var(--text-tertiary);
    font-weight: 700;
  }

  @media (max-width: 640px) {
    min-height: 48px;
    font-size: 16px;
  }
`;

export const Select = styled.select`
  width: 100%;
  border: 1px solid var(--line-soft);
  background: var(--field-background);
  border-radius: 14px;
  padding: 12px 13px;
  outline: none;
  font-weight: 700;
  color: var(--text-primary);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;

  &:focus {
    border-color: rgba(var(--accent-rgb), 0.46);
    box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.12);
  }

  @media (max-width: 640px) {
    min-height: 48px;
    font-size: 16px;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 120px;
  resize: vertical;
  border: 1px solid var(--line-soft);
  background: var(--field-background);
  border-radius: 14px;
  padding: 12px;
  outline: none;
  font: inherit;
  font-weight: 600;
  color: var(--text-primary);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;

  &:focus {
    border-color: rgba(var(--accent-rgb), 0.46);
    box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.12);
  }

  &::placeholder {
    color: var(--text-tertiary);
    font-weight: 700;
  }

  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

export const Helper = styled.div`
  margin-top: 8px;
  color: var(--text-tertiary);
  font-size: 12px;
`;

export const BtnRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    > * {
      width: 100%;
      justify-content: center;
    }
  }
`;

export const Btn = styled.button<{
  $primary?: boolean;
  $ghost?: boolean;
  $soft?: boolean;
  $danger?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 14px;
  padding: 11px 14px;
  cursor: pointer;
  font-weight: 900;
  letter-spacing: -0.01em;
  transition:
    transform 160ms ease,
    background 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;

  background: ${({ $primary, $ghost, $soft, $danger }) => {
    if ($primary) return "var(--button-primary)";
    if ($danger) return "var(--danger-bg)";
    if ($soft) return "rgba(var(--accent-rgb), 0.14)";
    if ($ghost) return "var(--button-soft)";
    return "var(--button-soft)";
  }};

  color: ${({ $primary, $danger }) => {
    if ($primary) return "var(--text-on-accent)";
    if ($danger) return "var(--danger-text)";
    return "var(--text-primary)";
  }};
  border-color: ${({ $ghost, $danger }) => {
    if ($danger) return "var(--danger-border)";
    if ($ghost) return "var(--line-soft)";
    return "transparent";
  }};
  box-shadow: ${({ $primary }) => ($primary ? "var(--button-primary-shadow)" : "none")};

  &:hover:enabled {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: var(--line-soft);
  margin: 16px 0;
`;

export const PreviewRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const PreviewItem = styled.div`
  background: rgba(var(--surface-rgb), 0.54);
  border: 1px dashed var(--preview-dashed);
  border-radius: 16px;
  padding: 14px;
`;

export const LinkSpotlightGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LinkSpotlightCard = styled.div`
  padding: 20px;
  border-radius: 20px;
  border: 1px solid var(--line-soft);
  background:
    radial-gradient(420px 220px at 0% 0%, rgba(var(--accent-rgb), 0.14), transparent 62%),
    var(--panel-solid);
  box-shadow: var(--card-shadow);
`;

export const LinkSpotlightTitle = styled.div`
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 8px;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  background: linear-gradient(
    180deg,
    rgba(var(--surface-rgb), 0.92),
    rgba(var(--surface-rgb), 0.72)
  );
  border: 1px solid var(--line-soft);
  border-radius: 18px;
  padding: 14px;
`;

export const SummaryValue = styled.div`
  color: var(--text-primary);
  font-size: 15px;
  font-weight: 800;
  line-height: 1.45;
  word-break: break-word;
`;

export const PreviewLabel = styled.div`
  font-weight: 900;
  font-size: 12px;
  color: var(--text-primary);
  margin-bottom: 6px;
`;

export const PreviewLink = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  text-align: left;
  cursor: pointer;
  color: var(--link-color);
  font-weight: 800;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
  }
`;

export const Small = styled.div`
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.5;
`;

export const LinksToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    align-items: stretch;
  }
`;

export const InlineActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const LinkButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LinkActionButton = styled.button`
  min-height: 78px;
  padding: 18px;
  border-radius: 18px;
  border: 1px solid var(--line-soft);
  background:
    radial-gradient(260px 140px at 0% 0%, rgba(var(--accent-rgb), 0.16), transparent 60%),
    rgba(var(--surface-rgb), 0.64);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
  box-shadow: var(--card-shadow);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    border-color 160ms ease;

  strong {
    display: block;
    font-size: 16px;
    font-weight: 900;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
  }

  span {
    display: block;
    color: var(--text-secondary);
    font-size: 13px;
    line-height: 1.55;
    word-break: break-word;
  }

  &:hover:enabled {
    transform: translateY(-1px);
    box-shadow: var(--shadow-soft);
    border-color: rgba(var(--accent-rgb), 0.22);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  @media (max-width: 640px) {
    min-height: 72px;
    padding: 16px;
  }
`;

export const EyeToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--line-soft);
  background: var(--button-soft);
  color: var(--text-primary);
  border-radius: 999px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: -0.01em;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;

  svg {
    width: 16px;
    height: 16px;
    display: block;
  }

  &:hover {
    background: var(--button-soft-hover);
    border-color: var(--line-strong);
    transform: translateY(-1px);
  }
`;

export const ExamList = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 16px;
`;

export const ExamListItem = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  border: 1px solid var(--line-soft);
  border-radius: 18px;
  padding: 14px 16px;
  background: rgba(var(--surface-rgb), 0.46);
  text-align: left;
  cursor: pointer;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(var(--accent-rgb), 0.22);
    box-shadow: var(--shadow-soft);
    background: rgba(var(--surface-rgb), 0.58);
  }

  @media (max-width: 900px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const ExamListInfo = styled.div`
  min-width: 0;

  strong {
    display: block;
    font-size: 15px;
    font-weight: 900;
    color: var(--text-primary);
    letter-spacing: -0.02em;
  }

  span {
    display: block;
    margin-top: 4px;
    font-size: 13px;
    line-height: 1.55;
    color: var(--text-secondary);
    word-break: break-word;
  }
`;

export const SensitiveLinkText = styled.span<{ $hidden?: boolean }>`
  filter: ${({ $hidden }) => ($hidden ? "blur(6px)" : "none")};
  user-select: ${({ $hidden }) => ($hidden ? "none" : "text")};
  transition: filter 160ms ease;
`;

export const EditorSection = styled.div`
  display: grid;
  gap: 14px;
`;

export const LinkEditorList = styled.div`
  display: grid;
  gap: 12px;
`;

export const LinkEditorRow = styled.div`
  border: 1px solid var(--line-soft);
  border-radius: 18px;
  padding: 14px;
  background: rgba(var(--surface-rgb), 0.48);
`;

export const InlineGrid = styled.div`
  display: grid;
  grid-template-columns: 0.8fr 1.2fr auto;
  gap: 10px;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 120;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(5, 10, 18, 0.42);
  backdrop-filter: blur(14px) saturate(140%);

  @media (max-width: 640px) {
    align-items: flex-end;
    padding: 12px 12px 0;
  }
`;

export const ModalCard = styled.div`
  width: min(100%, 560px);
  border-radius: 24px;
  border: 1px solid var(--line-soft);
  background: var(--panel-background);
  box-shadow: var(--shadow-strong);
  padding: 22px;
  backdrop-filter: blur(20px) saturate(140%);

  @media (max-width: 640px) {
    width: 100%;
    max-height: min(86vh, 720px);
    overflow-y: auto;
    border-radius: 24px 24px 0 0;
    padding: 18px;
  }
`;

export const ModalTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 24px;
  letter-spacing: -0.04em;

  @media (max-width: 640px) {
    font-size: 21px;
  }
`;

export const ConfirmGlassCard = styled.div`
  position: relative;
  width: min(100%, 560px);
  overflow: hidden;
  border-radius: 30px;
  border: 1px solid rgba(17, 32, 49, 0.08);
  background:
    radial-gradient(320px 180px at 0% 0%, rgba(var(--accent-rgb), 0.14), transparent 62%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(244, 248, 251, 0.88));
  box-shadow: 0 24px 80px rgba(8, 15, 28, 0.18);
  backdrop-filter: blur(28px) saturate(165%);

  html[data-theme="dark"] & {
    border-color: rgba(255, 255, 255, 0.16);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.08)),
      rgba(9, 18, 31, 0.74);
    box-shadow: 0 24px 80px rgba(8, 15, 28, 0.26);
  }

  @media (max-width: 640px) {
    width: 100%;
    border-radius: 28px 28px 0 0;
  }
`;

export const ConfirmGlassOrb = styled.div`
  position: absolute;
  top: -88px;
  right: -42px;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(var(--accent-rgb), 0.34) 0%,
    rgba(var(--accent-rgb), 0.08) 62%,
    transparent 75%
  );
  pointer-events: none;
`;

export const ConfirmGlassContent = styled.div`
  position: relative;
  display: grid;
  gap: 14px;
  padding: 34px 30px 28px;
  color: var(--text-primary);

  @media (max-width: 640px) {
    padding: 26px 20px 22px;
  }
`;

export const ConfirmGlassEyebrow = styled.span`
  display: inline-flex;
  width: fit-content;
  padding: 7px 12px;
  border-radius: 999px;
  border: 1px solid rgba(17, 32, 49, 0.1);
  background: rgba(17, 32, 49, 0.05);
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;

  html[data-theme="dark"] & {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.16);
    color: rgba(255, 255, 255, 0.86);
  }
`;

export const ConfirmGlassTitle = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 800;
  line-height: 1.04;
  letter-spacing: -0.05em;

  @media (max-width: 640px) {
    font-size: 26px;
  }
`;

export const ConfirmGlassText = styled.p`
  margin: 0;
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 500;
  line-height: 1.7;
`;

export const ConfirmGlassPatient = styled.div`
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid var(--line-soft);
  background: rgba(255, 255, 255, 0.62);
  color: var(--text-primary);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.35;
  word-break: break-word;

  html[data-theme="dark"] & {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.14);
    color: #ffffff;
  }
`;

export const ConfirmGlassActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;

  @media (max-width: 640px) {
    > * {
      width: 100%;
    }
  }
`;
