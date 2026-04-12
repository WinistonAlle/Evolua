import styled, { css } from "styled-components";

export const Layout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: var(--shell-background);

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.aside<{ $collapsed?: boolean }>`
  width: 320px;
  background: var(--sidebar-background);
  border-right: 1px solid var(--line-soft);
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(140%);
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    width: 100%;
    max-width: 100%;
    border-right: 0;
    border-bottom: 1px solid var(--line-soft);
    ${({ $collapsed }) => ($collapsed ? "padding-bottom: 0;" : "")}
  }
`;

export const SidebarHeader = styled.div`
  padding: 16px 16px 12px;
  border-bottom: 1px solid var(--line-soft);

  @media (max-width: 640px) {
    padding: 14px 14px 10px;
  }
`;

export const SidebarHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SidebarControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

export const BrandRow = styled.button`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;

  &:hover {
    opacity: 0.94;
  }
`;

export const BrandLogo = styled.img`
  width: 38px;
  height: 38px;
  padding: 4px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    rgba(var(--accent-rgb), 0.14),
    rgba(var(--brand-rgb), 0.08)
  );
  border: 1px solid rgba(var(--accent-rgb), 0.16);
  object-fit: cover;
  object-position: center 28%;
  user-select: none;
  filter: drop-shadow(0 10px 18px rgba(0, 0, 0, 0.08));
`;

export const BrandName = styled.span`
  color: var(--text-primary);
  font-size: 21px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;

  @media (max-width: 640px) {
    font-size: 18px;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  border: 1px solid var(--line-soft);
  background: var(--button-soft);
  color: var(--text-primary);
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: background 160ms ease, transform 160ms ease;

  &:hover {
    background: var(--button-soft-hover);
    transform: translateY(-1px);
  }

  @media (max-width: 900px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
`;

export const PatientsList = styled.div<{ $collapsed?: boolean }>`
  flex: 1;
  overflow-y: auto;
  padding: 10px 8px;

  @media (max-width: 900px) {
    display: ${({ $collapsed }) => ($collapsed ? "none" : "block")};
    max-height: 52vh;
  }
`;

export const SidebarSectionTitle = styled.div`
  padding: 12px 14px 6px;
  color: var(--text-tertiary);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const SidebarNav = styled.div`
  display: grid;
  gap: 6px;
  padding: 8px;
`;

const activeSurface = css`
  border-color: rgba(var(--accent-rgb), 0.34);
  background: linear-gradient(
    135deg,
    rgba(var(--accent-rgb), 0.16),
    rgba(var(--brand-rgb), 0.10)
  );
  color: var(--text-primary);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
`;

export const SidebarNavButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-primary);
  padding: 11px 12px;
  border-radius: 14px;
  text-align: left;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background 160ms ease,
    transform 160ms ease,
    border-color 160ms ease;

  ${({ $active }) => ($active ? activeSurface : "")}

  &:hover {
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, rgba(var(--accent-rgb), 0.18), rgba(var(--brand-rgb), 0.12))"
        : "var(--button-soft-hover)"};
    transform: translateY(-1px);
  }
`;

export const PatientItem = styled.div<{ $active?: boolean }>`
  padding: 12px 14px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-primary);
  border-radius: 14px;
  margin: 6px 6px;
  border: 1px solid transparent;
  background: transparent;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    transform 160ms ease;

  ${({ $active }) => ($active ? activeSurface : "")}

  &:hover {
    background: ${({ $active }) =>
      $active
        ? "linear-gradient(135deg, rgba(var(--accent-rgb), 0.18), rgba(var(--brand-rgb), 0.12))"
        : "var(--button-soft-hover)"};
    transform: translateY(-1px);
  }
`;

export const SidebarHint = styled.div`
  padding: 8px 14px 4px;
  color: var(--text-tertiary);
  font-size: 12px;
`;

export const SidebarFooter = styled.div<{ $collapsed?: boolean }>`
  padding: 14px;
  border-top: 1px solid var(--line-soft);
  background: linear-gradient(180deg, transparent, rgba(var(--brand-rgb), 0.06));

  @media (max-width: 900px) {
    display: ${({ $collapsed }) => ($collapsed ? "none" : "block")};
  }
`;

export const ActionsStack = styled.div`
  display: grid;
  gap: 10px;
`;

export const NewPatientButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 14px;
  border: 0;
  border-radius: 14px;
  background: var(--button-primary);
  color: var(--text-on-accent);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--button-primary-shadow);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    filter 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-soft);
    filter: saturate(1.05);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ActionButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 14px;
  border-radius: 14px;
  border: 1px solid var(--line-soft);
  background: var(--button-soft);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 160ms ease, transform 160ms ease;

  &:hover {
    background: var(--button-soft-hover);
    transform: translateY(-1px);
  }
`;

export const Content = styled.main`
  flex: 1;
  padding: 28px;
  min-width: 0;

  @media (max-width: 900px) {
    padding: 20px;
  }

  @media (max-width: 640px) {
    padding: 14px;
  }
`;

export const PageHeader = styled.div`
  max-width: 980px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    align-items: stretch;
    flex-direction: column;
    margin-bottom: 14px;
  }
`;

export const PageActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;

    > * {
      width: 100%;
    }
  }
`;

export const EmptyState = styled.div`
  min-height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;

  h2 {
    margin: 0 0 8px;
    color: var(--text-primary);
    font-family: var(--font-display);
    font-size: 24px;
    letter-spacing: -0.03em;
  }

  p {
    margin: 0;
    color: var(--text-secondary);
    max-width: 520px;
  }

  @media (max-width: 640px) {
    min-height: 240px;
    padding: 18px 0;

    h2 {
      font-size: 22px;
    }
  }
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-display);
  letter-spacing: -0.04em;
  font-size: 30px;
  line-height: 1.05;

  @media (max-width: 640px) {
    font-size: 25px;
  }
`;

export const SubtleText = styled.p`
  margin: 6px 0 0;
  color: var(--text-secondary);
  line-height: 1.6;
`;

export const Divider = styled.div`
  height: 1px;
  margin: 16px 0;
  background: var(--line-soft);
`;

export const Card = styled.div`
  background: var(--panel-background);
  border: 1px solid var(--line-soft);
  border-radius: 22px;
  padding: 20px;
  backdrop-filter: blur(20px) saturate(140%);
  box-shadow: var(--card-shadow);
  max-width: 860px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    padding: 16px;
    border-radius: 18px;
    margin-bottom: 16px;
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  max-width: 980px;
  margin-bottom: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled(Card)`
  margin-bottom: 0;
`;

export const WideCard = styled(Card)`
  max-width: 980px;
`;

export const MetricValue = styled.div`
  color: var(--text-primary);
  font-family: var(--font-display);
  font-size: 32px;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.05em;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`;

export const CardTitle = styled.h2`
  margin: 0 0 12px;
  color: var(--text-primary);
  font-family: var(--font-display);
  letter-spacing: -0.03em;
  font-size: 19px;

  @media (max-width: 640px) {
    font-size: 17px;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 14px 0;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: var(--text-secondary);
`;

export const Input = styled.input`
  height: 46px;
  border-radius: 14px;
  border: 1px solid var(--line-soft);
  background: var(--field-background);
  padding: 0 14px;
  color: var(--text-primary);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;

  &::placeholder {
    color: var(--text-tertiary);
  }

  &:focus {
    outline: none;
    border-color: rgba(var(--accent-rgb), 0.55);
    box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.16);
  }

  @media (max-width: 640px) {
    height: 48px;
    font-size: 16px;
  }
`;

export const SearchInput = styled(Input)`
  width: 100%;
  max-width: none;
`;

export const PatientsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 980px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const PatientSummaryCard = styled(Card)`
  margin-bottom: 0;
`;

export const InfoList = styled.div`
  display: grid;
  gap: 8px;
  margin-top: 12px;
`;

export const InfoRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: baseline;
  color: var(--text-secondary);
  font-size: 13px;
  flex-wrap: wrap;

  strong {
    color: var(--text-primary);
    font-weight: 800;
  }
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 6px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    > * {
      width: 100%;
    }
  }
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 14px;
  padding: 11px 14px;
  cursor: pointer;
  font-weight: 800;
  background: var(--button-primary);
  color: var(--text-on-accent);
  box-shadow: var(--button-primary-shadow);
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-soft);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const HeaderPrimaryButton = styled(PrimaryButton)`
  width: auto;
  min-width: 180px;
  white-space: nowrap;

  @media (max-width: 640px) {
    width: 100%;
  }
`;

export const GhostButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  font-weight: 800;
  background: var(--button-soft);
  color: var(--text-primary);
  transition: background 160ms ease, transform 160ms ease;

  &:hover {
    background: var(--button-soft-hover);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const StatusBanner = styled.div<{ $tone: "error" | "success" }>`
  margin-top: 14px;
  padding: 12px 14px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid
    ${({ $tone }) => ($tone === "error" ? "var(--danger-border)" : "var(--success-border)")};
  background: ${({ $tone }) => ($tone === "error" ? "var(--danger-bg)" : "var(--success-bg)")};
  color: ${({ $tone }) => ($tone === "error" ? "var(--danger-text)" : "var(--success-text)")};
`;

export const SegmentedControl = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid var(--line-soft);
  background: var(--field-muted);
  margin-top: 16px;
`;

export const SegmentButton = styled.button<{ $active?: boolean }>`
  min-width: 110px;
  padding: 10px 14px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: ${({ $active }) => ($active ? "var(--panel-solid)" : "transparent")};
  color: ${({ $active }) => ($active ? "var(--text-primary)" : "var(--text-secondary)")};
  font-weight: 800;
  cursor: pointer;
  box-shadow: ${({ $active }) => ($active ? "var(--card-shadow)" : "none")};
  transition:
    transform 160ms ease,
    background 160ms ease,
    color 160ms ease;

  &:hover {
    transform: translateY(-1px);
    background: ${({ $active }) => ($active ? "var(--panel-solid)" : "var(--button-soft)")};
  }
`;
