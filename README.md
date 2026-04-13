# Evolua

O **Evolua** é um sistema web para clínicas e consultórios que centraliza pacientes, prontuário, exames e observações em uma interface rápida, leve e preparada para uso diário.

O projeto tem duas camadas principais:

- uma **landing page pública** para apresentação do produto
- uma **área interna autenticada** para gestão do fluxo clínico

## Visão Geral

Hoje o sistema já cobre a base operacional do produto:

- autenticação com Supabase
- cadastro e acompanhamento de pacientes
- ficha individual com prontuário, exames e observações
- múltiplos links de exames por paciente
- status de alta
- tema claro e escuro
- interface responsiva com foco em mobile

## Stack

- React 19
- TypeScript
- Vite 7
- React Router 7
- Styled Components
- Supabase (`@supabase/supabase-js`)
- ESLint

## Estrutura

```text
src/
  components/       Componentes reutilizáveis
  contexts/         Estado global de autenticação e pacientes
  hooks/            Hooks de acesso aos providers
  lib/              Integrações e regras de negócio
  pages/            Landing, login, app interna e pacientes
  theme/            Tokens e provider de tema
public/             Favicons e assets públicos
```

## Requisitos

- Node.js 20+ recomendado
- npm
- projeto Supabase configurado

## Como Rodar Localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie o arquivo `.env` a partir do exemplo:

```bash
cp .env.example .env
```

3. Preencha as variáveis do Supabase.

4. Rode o ambiente de desenvolvimento:

```bash
npm run dev
```

5. Abra:

```text
http://localhost:5173
```

## Variáveis de Ambiente

Use como base o arquivo `.env.example`.

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica-aqui
VITE_AUTH_REDIRECT_URL=http://localhost:5173/login
```

### O que cada variável faz

- `VITE_SUPABASE_URL`: URL do projeto no Supabase
- `VITE_SUPABASE_ANON_KEY`: chave pública usada no front-end
- `VITE_AUTH_REDIRECT_URL`: URL de retorno para fluxos de autenticação por email

## Scripts

```bash
npm run dev      # sobe o projeto em modo desenvolvimento
npm run build    # gera o build de produção
npm run preview  # sobe o build localmente para conferência
npm run lint     # valida o código com ESLint
```

## Build de Produção

Para gerar o build:

```bash
npm run build
```

Os arquivos finais serão gerados em:

```text
dist/
```

## Funcionalidades Atuais

### Landing page

- apresentação do sistema
- explicação de uso
- seção sobre o produto
- contato por email

### Autenticação

- login com email e senha
- cadastro com confirmação por email
- recuperação de senha
- loading pós-login
- proteção de rotas

### Área clínica

- painel inicial com busca rápida
- listagem de pacientes
- criação de novo paciente
- ficha individual com nome dinâmico no título
- cadastro de prontuário por link
- cadastro de exames por modal
- links clicáveis para prontuário e exames
- ocultação visual dos links com botão de olho
- alta de paciente com modal de confirmação
- observações e próximos passos

## Qualidade Atual do Projeto

O projeto já está em um ponto bom para evolução comercial:

- lint validado
- build validado
- assets principais otimizados
- rotas em lazy loading
- fallback global para erros de aplicação
- base visual consistente entre temas

## Próximos Passos Recomendados

Se a intenção for levar o Evolua para um SaaS mais maduro, os próximos blocos de trabalho são:

- testes E2E dos fluxos críticos
- controle de planos e billing
- auditoria de ações
- permissões por perfil
- onboarding inicial
- monitoramento e observabilidade
- backups e políticas operacionais

## Repositório

GitHub:

- [WinistonAlle/Evolua](https://github.com/WinistonAlle/Evolua)
