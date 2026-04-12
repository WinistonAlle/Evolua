# Evolua

Sistema web em React + Vite para fluxo clínico com landing page, autenticação via Supabase e área interna para gerenciamento rápido de pacientes.

## Stack

- React 19
- Vite 7
- React Router
- Styled Components
- Supabase Auth

## Como rodar

```bash
npm install
npm run dev
```

## Variáveis de ambiente

Crie um `.env` com:

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Fluxos atuais

- Landing pública com navegação para login
- Login com Supabase
- Rotas protegidas para a área interna
- Lista local de pacientes com criação rápida
- Página de paciente com links de exames e prontuário salvos no navegador
