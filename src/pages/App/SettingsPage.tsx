import { useState } from "react";
import HeartRateLoader from "../../components/HeartRateLoader";
import AppLayout from "./AppLayout";
import { useAuth } from "../../contexts/useAuth";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../theme/theme-context";
import {
  ActionsRow,
  Card,
  CardTitle,
  Content,
  GhostButton,
  PageTitle,
  PrimaryButton,
  SegmentButton,
  SegmentedControl,
  StatusBanner,
  SubtleText,
} from "./styles";

type FeedbackMessage = {
  type: "error" | "success";
  text: string;
} | null;

export default function SettingsPage() {
  const { session } = useAuth();
  const { resolvedTheme, themePreference, setThemePreference } = useTheme();
  const [message, setMessage] = useState<FeedbackMessage>(null);
  const [loading, setLoading] = useState(false);

  const user = session?.user;
  const email = user?.email ?? "Email não disponível";
  const fullName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : "Nome não informado";

  async function handlePasswordReset() {
    if (!user?.email) return;

    try {
      setLoading(true);
      setMessage(null);

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }

      setMessage({
        type: "success",
        text: "Enviamos um link de redefinição de senha para seu email.",
      });
    } catch {
      setMessage({
        type: "error",
        text: "Não foi possível enviar o email de redefinição agora.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout>
      <Content>
        <div style={{ marginBottom: 18 }}>
          <PageTitle>Configurações</PageTitle>
          <SubtleText>Dados da conta e ações de acesso.</SubtleText>
        </div>

        <Card>
          <CardTitle>Aparência</CardTitle>
          <SubtleText>
            Escolha como o Evolua deve aparecer em todo o sistema. O modo automático usa a
            preferência do seu dispositivo.
          </SubtleText>

          <SegmentedControl>
            <SegmentButton
              type="button"
              $active={themePreference === "light"}
              onClick={() => setThemePreference("light")}
            >
              Claro
            </SegmentButton>
            <SegmentButton
              type="button"
              $active={themePreference === "dark"}
              onClick={() => setThemePreference("dark")}
            >
              Escuro
            </SegmentButton>
            <SegmentButton
              type="button"
              $active={themePreference === "system"}
              onClick={() => setThemePreference("system")}
            >
              Automático
            </SegmentButton>
          </SegmentedControl>

          <SubtleText style={{ marginTop: 14 }}>
            Tema ativo agora: <strong>{resolvedTheme === "dark" ? "escuro" : "claro"}</strong>.
          </SubtleText>
        </Card>

        <Card>
          <CardTitle>Conta</CardTitle>
          <SubtleText>
            Nome: {fullName}
            <br />
            Email: {email}
            <br />
            ID do usuário: {user?.id ?? "Não disponível"}
          </SubtleText>
        </Card>

        <Card>
          <CardTitle>Segurança</CardTitle>
          <SubtleText>
            Use as ações abaixo para recuperar o acesso ou atualizar sua senha pelo fluxo do
            Supabase.
          </SubtleText>

          <ActionsRow>
            <PrimaryButton onClick={handlePasswordReset} disabled={loading || !user?.email}>
              {loading ? (
                <HeartRateLoader size="button" tone="inverse" />
              ) : (
                "Enviar redefinição de senha"
              )}
            </PrimaryButton>
            <GhostButton onClick={() => setMessage(null)} disabled={!message}>
              Limpar aviso
            </GhostButton>
          </ActionsRow>

          {message ? (
            <StatusBanner $tone={message.type}>
              {message.text}
            </StatusBanner>
          ) : null}
        </Card>
      </Content>
    </AppLayout>
  );
}
