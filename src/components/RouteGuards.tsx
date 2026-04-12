import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import HeartRateLoader from "./HeartRateLoader";
import { useAuth } from "../contexts/useAuth";
import {
  clearPostAuthLoading,
  getRemainingPostAuthLoadingMs,
} from "../lib/post-auth-loading";

function FullPageLoader() {
  return <HeartRateLoader size="page" />;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { loading, session } = useAuth();
  const [waitingPostAuth, setWaitingPostAuth] = useState(
    () => getRemainingPostAuthLoadingMs() > 0,
  );

  useEffect(() => {
    if (!session) {
      clearPostAuthLoading();
      return;
    }

    if (!waitingPostAuth) {
      clearPostAuthLoading();
      return;
    }

    const remaining = Math.max(getRemainingPostAuthLoadingMs(), 0);

    const timeoutId = window.setTimeout(() => {
      clearPostAuthLoading();
      setWaitingPostAuth(false);
    }, remaining);

    return () => window.clearTimeout(timeoutId);
  }, [session, waitingPostAuth]);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (waitingPostAuth) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { loading, session } = useAuth();

  if (loading) {
    return <FullPageLoader />;
  }

  if (session) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}
