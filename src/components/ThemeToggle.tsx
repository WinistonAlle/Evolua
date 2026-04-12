import styled from "styled-components";
import { useTheme } from "../theme/theme-context";

type ThemeToggleProps = {
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
};

export default function ThemeToggle({
  className,
  compact = false,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const actionLabel = isDark ? "Ativar tema claro" : "Ativar tema escuro";

  return (
    <ToggleButton
      type="button"
      className={className}
      onClick={toggleTheme}
      aria-label={actionLabel}
      title={actionLabel}
      $compact={compact}
      $dark={isDark}
    >
      <Orb $compact={compact} $dark={isDark}>
        <SunCore $dark={isDark} />
        <SunRing $dark={isDark} />
        <MoonMask $dark={isDark} />
        <Spark $position="top" $dark={isDark} />
        <Spark $position="right" $dark={isDark} />
        <Spark $position="bottom" $dark={isDark} />
        <Spark $position="left" $dark={isDark} />
      </Orb>
    </ToggleButton>
  );
}

const ToggleButton = styled.button<{ $compact: boolean; $dark: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $compact }) => ($compact ? "38px" : "42px")};
  height: ${({ $compact }) => ($compact ? "38px" : "42px")};
  padding: 0;
  border: 1px solid
    ${({ $dark }) =>
      $dark ? "rgba(148, 163, 184, 0.18)" : "rgba(17, 32, 49, 0.10)"};
  border-radius: 999px;
  background: ${({ $dark }) =>
    $dark
      ? "rgba(8, 17, 29, 0.48)"
      : "rgba(255, 255, 255, 0.42)"};
  color: var(--text-primary);
  cursor: pointer;
  backdrop-filter: blur(16px) saturate(135%);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;

  &:hover {
    background: ${({ $dark }) =>
      $dark
        ? "rgba(8, 17, 29, 0.64)"
        : "rgba(255, 255, 255, 0.66)"};
    border-color: var(--line-strong);
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    transform: translateY(-1px);
  }
`;

const Orb = styled.span<{ $compact: boolean; $dark: boolean }>`
  position: relative;
  width: ${({ $compact }) => ($compact ? "20px" : "22px")};
  height: ${({ $compact }) => ($compact ? "20px" : "22px")};
  display: inline-block;
  border-radius: 999px;
  overflow: visible;

  ${ToggleButton}:hover & {
    transform: rotate(${({ $dark }) => ($dark ? "-8deg" : "8deg")});
    transition: transform 220ms ease;
  }
`;

const SunCore = styled.span<{ $dark: boolean }>`
  position: absolute;
  inset: 4px;
  border-radius: 999px;
  background: ${({ $dark }) =>
    $dark
      ? "linear-gradient(180deg, #f8fafc, #dbe7f4)"
      : "linear-gradient(180deg, #ffd54d, #ffb300)"};
  box-shadow: ${({ $dark }) =>
    $dark
      ? "0 0 18px rgba(255, 255, 255, 0.18)"
      : "0 0 22px rgba(255, 196, 0, 0.28)"};
  transition:
    inset 220ms ease,
    background 220ms ease,
    box-shadow 220ms ease;
`;

const SunRing = styled.span<{ $dark: boolean }>`
  position: absolute;
  inset: 0;
  border-radius: 999px;
  border: 1.5px solid
    ${({ $dark }) =>
      $dark ? "rgba(248, 250, 252, 0.14)" : "rgba(255, 196, 0, 0.32)"};
  transform: scale(${({ $dark }) => ($dark ? "0.78" : "1")});
  opacity: ${({ $dark }) => ($dark ? 0.22 : 1)};
  transition:
    transform 220ms ease,
    opacity 220ms ease,
    border-color 220ms ease;
`;

const MoonMask = styled.span<{ $dark: boolean }>`
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 999px;
  top: ${({ $dark }) => ($dark ? "1px" : "2px")};
  left: ${({ $dark }) => ($dark ? "8px" : "13px")};
  background: ${({ $dark }) =>
    $dark ? "rgba(8, 17, 29, 0.92)" : "rgba(255, 255, 255, 0.98)"};
  opacity: ${({ $dark }) => ($dark ? 1 : 0)};
  transform: scale(${({ $dark }) => ($dark ? "1" : "0.8")});
  transition:
    left 220ms ease,
    top 220ms ease,
    opacity 220ms ease,
    transform 220ms ease,
    background 220ms ease;
`;

const Spark = styled.span<{ $position: "top" | "right" | "bottom" | "left"; $dark: boolean }>`
  position: absolute;
  background: ${({ $dark }) =>
    $dark ? "rgba(248, 250, 252, 0.78)" : "rgba(255, 196, 0, 0.92)"};
  border-radius: 999px;
  opacity: ${({ $dark }) => ($dark ? 0.92 : 0.56)};
  transition:
    opacity 220ms ease,
    transform 220ms ease,
    background 220ms ease;

  ${({ $position }) =>
    $position === "top"
      ? "width: 2px; height: 5px; top: -4px; left: 50%; transform: translateX(-50%);"
      : ""}
  ${({ $position }) =>
    $position === "right"
      ? "width: 5px; height: 2px; right: -4px; top: 50%; transform: translateY(-50%);"
      : ""}
  ${({ $position }) =>
    $position === "bottom"
      ? "width: 2px; height: 5px; bottom: -4px; left: 50%; transform: translateX(-50%);"
      : ""}
  ${({ $position }) =>
    $position === "left"
      ? "width: 5px; height: 2px; left: -4px; top: 50%; transform: translateY(-50%);"
      : ""}
`;
