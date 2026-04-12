import styled, { css, keyframes } from "styled-components";

type HeartRateLoaderProps = {
  className?: string;
  label?: string;
  size?: "page" | "inline" | "compact" | "button";
  tone?: "default" | "inverse";
};

export default function HeartRateLoader({
  className,
  label,
  size = "inline",
  tone = "default",
}: HeartRateLoaderProps) {
  return (
    <LoaderShell className={className} $size={size} role="status" aria-live="polite">
      <LoaderCanvas $size={size} $tone={tone} aria-hidden="true">
        <HeartRateTrack $size={size}>
          <TrackLine />
          <GlowSweep />
          <svg viewBox="0 0 150 73" xmlns="http://www.w3.org/2000/svg">
            <polyline
              points="0,45.486 38.514,45.486 44.595,33.324 50.676,45.486 57.771,45.486 62.838,55.622 71.959,9 80.067,63.729 84.122,45.486 97.297,45.486 103.379,40.419 110.473,45.486 150,45.486"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeMiterlimit="10"
            />
          </svg>
        </HeartRateTrack>
      </LoaderCanvas>
      {label ? <ScreenReaderText>{label}</ScreenReaderText> : null}
    </LoaderShell>
  );
}

const lineMove = keyframes`
  0% {
    stroke-dashoffset: 220;
    opacity: 0.4;
  }

  20% {
    opacity: 1;
  }

  100% {
    stroke-dashoffset: 0;
    opacity: 1;
  }
`;

const sweepMove = keyframes`
  0% {
    transform: translateX(-165%);
    opacity: 0;
  }

  18% {
    opacity: 0.16;
  }

  45% {
    opacity: 0.7;
  }

  100% {
    transform: translateX(165%);
    opacity: 0;
  }
`;

const beatPulse = keyframes`
  0%,
  100% {
    transform: scale(0.985);
  }

  45% {
    transform: scale(1);
  }
`;

const fullPageShell = css`
  min-height: 100vh;
  width: 100%;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--shell-background);
`;

const LoaderShell = styled.div<{ $size: "page" | "inline" | "compact" | "button" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  ${({ $size }) => ($size === "page" ? fullPageShell : "")}
`;

const LoaderCanvas = styled.div<{
  $size: "page" | "inline" | "compact" | "button";
  $tone: "default" | "inverse";
}>`
  --loader-stroke: ${({ $tone }) =>
    $tone === "inverse" ? "rgba(248, 251, 255, 0.96)" : "rgb(var(--accent-rgb))"};
  --loader-glow: ${({ $tone }) =>
    $tone === "inverse" ? "rgba(255, 255, 255, 0.32)" : "rgba(34, 183, 167, 0.34)"};
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const HeartRateTrack = styled.div<{ $size: "page" | "inline" | "compact" | "button" }>`
  position: relative;
  width: ${({ $size }) => {
    if ($size === "page") return "150px";
    if ($size === "button") return "88px";
    if ($size === "compact") return "96px";
    return "126px";
  }};
  height: ${({ $size }) => {
    if ($size === "page") return "73px";
    if ($size === "button") return "32px";
    if ($size === "compact") return "38px";
    return "54px";
  }};
  color: var(--loader-stroke);
  overflow: hidden;
  animation: ${beatPulse} 1.55s ease-in-out infinite;

  svg {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: block;
  }

  polyline {
    stroke-dasharray: 220;
    stroke-dashoffset: 220;
    animation: ${lineMove} 1.35s linear infinite;
    filter: drop-shadow(0 0 7px var(--loader-glow));
  }
`;

const TrackLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 62%;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0)
  );
  z-index: 1;
`;

const GlowSweep = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    var(--loader-glow) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  transform: translateX(-165%);
  animation: ${sweepMove} 1.35s linear infinite;
`;

const ScreenReaderText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;
