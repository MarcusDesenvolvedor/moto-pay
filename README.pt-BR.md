# MotoPay

**Gestão para motoristas e motociclistas — controle de receitas, despesas, veículos e relatórios financeiros.**

Aplicativo mobile full-stack voltado a motociclistas e motoristas que geram renda com o veículo. Suporta contexto multi-empresas (MEI, PJ, frotas pequenas), cadastro de veículos e quilometragem, lançamentos financeiros (receita/despesa) e relatórios — tudo escopado por empresa, com acesso por perfis de usuário.

> **Documentation in English:** [README.md](README.md)

---

## Tecnologias

| Camada | Stack |
|--------|--------|
| **Mobile** | React Native, Expo 54, TypeScript |
| **Estado e dados** | Zustand (auth), TanStack React Query, React Hook Form + Zod |
| **Navegação** | React Navigation (stack + bottom tabs) |
| **Backend** | NestJS 10, TypeScript |
| **Dados** | Prisma ORM, PostgreSQL |
| **Auth** | JWT (access + refresh), Passport, bcrypt |
| **Armazenamento** | Expo Secure Store (tokens) |
| **Mídia** | Cloudinary (upload de avatar) |
| **Build** | EAS (Expo Application Services) para Android/iOS |

---

## Arquitetura e estrutura do projeto

Monorepo: um único repositório com a API backend, o app Expo e código compartilhado.

```
moto-pay/
├── App.tsx                    # Entrada do app, gate de auth, QueryClient + Navigation
├── navigation/                 # Navegador principal, abas, stack de perfil, fluxo de auth
├── shared/                     # Transversal: cliente API, tema, componentes, storage
│   ├── api/                    # Cliente Axios, anexar JWT, fila de refresh em 401
│   ├── theme/                  # Cores, tipografia, espaçamento
│   ├── components/            # UI reutilizável (Button, Input, Loading, modais, animados)
│   ├── storage/                # Armazenamento de tokens (Secure Store)
│   ├── animations/             # Transições, tokens
│   └── infrastructure/         # Prisma service, Cloudinary service
├── docs/mhp/
│   ├── business-logic.md      # Regras de negócio (fonte única de verdade)
│   ├── data-model.md
│   └── features/               # Módulos por feature (backend + frontend)
│       ├── authentication/    # Login, signup, refresh, guards JWT
│       ├── companies/          # Criar empresa, listar, excluir
│       ├── vehicles/           # CRUD de veículos (listar, adicionar, excluir)
│       ├── add-transaction/    # Criar receita/despesa (empresa + veículo)
│       ├── reports/            # Resumo diário, resumo de relatórios (por data)
│       ├── profile/            # Tela de perfil, editar perfil, avatar
│       └── security/           # Alterar senha, sessões
├── src/                        # Entrada do backend NestJS
│   ├── main.ts                 # Bootstrap, ValidationPipe, CORS
│   ├── app.module.ts           # Módulos de features, PrismaService
│   └── ...
├── prisma/
│   ├── schema.prisma           # User, Company, CompanyUser, Vehicle, MileageRecord, FinancialRecord, RefreshToken
│   └── migrations/
├── android/                    # Android nativo (Expo)
├── app.config.js              # Config do app Expo (MotoPay, slug, env)
├── eas.json                    # Perfis de build EAS
└── package.json               # Pacote único: deps Nest + Expo + scripts
```

**Backend (NestJS):** Módulos por feature em `docs/mhp/features/*/backend/` com separação de `domain` (entidades, interfaces de repositório), `application` (services), `infrastructure` (repositórios), `controllers`, `dto`, `guards`, `strategies`. `PrismaService` compartilhado e infra opcional (ex.: Cloudinary) em `shared/infrastructure/`.

**Frontend (Expo):** UI por feature em `docs/mhp/features/*/frontend/` (screens, hooks, api, types, components). O `App.tsx` na raiz conecta estado de auth (Zustand), React Query e navegação (auth vs abas do app).

---

## Principais funcionalidades

- **Autenticação** — Cadastro e login com e-mail/senha; JWT access + refresh; tokens no Secure Store; estado de auth (Zustand) e inicialização na abertura do app.
- **Empresas** — Criar empresa, listar empresas, excluir empresa; vínculo usuário–empresa com papéis (OWNER/MEMBER); todos os dados escopados por empresa.
- **Veículos** — Listar veículos, adicionar veículo (nome, tipo, placa, modelo, ano, observação), excluir veículo; veículos pertencem a uma empresa.
- **Transações** — Adicionar receita/despesa por empresa e veículo (valor, pago, data, observação); validação e checagem de vínculo com a empresa.
- **Relatórios** — Resumo diário (receita/despesa do dia); resumo de relatórios por período; dados agregados dos registros financeiros, escopados por empresa.
- **Perfil** — Visualizar perfil, editar perfil (ex.: nome), upload de avatar (Cloudinary).
- **Segurança** — Alterar senha; listar/revogar sessões (DTOs no backend e feature de segurança).

As regras de negócio (multi-empresa, restrições de veículo e financeiro, sem mistura de dados entre empresas, imutabilidade financeira) estão em `docs/mhp/business-logic.md`.

---

## Como rodar o projeto localmente

### Pré-requisitos

- Node.js (LTS, ex.: 20+)
- PostgreSQL
- npm (ou equivalente)
- Expo Go (para dispositivo/simulador) ou Android Studio / Xcode para execução nativa

### 1. Clonar e instalar

```bash
git clone <url-do-repositorio>
cd moto-pay
npm install
```

### 2. Variáveis de ambiente

Copie `.env.example` para `.env` e configure:

- `DATABASE_URL` — String de conexão PostgreSQL (ex.: `postgresql://user:password@localhost:5432/moto_pay?schema=public`)
- `JWT_SECRET`, `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- `PORT` (padrão `3001`)
- Opcional: variáveis do Cloudinary para upload de avatar

No app, defina `EXPO_PUBLIC_API_URL` (ex.: IP da sua máquina ou URL de tunnel) para o dispositivo alcançar a API.

### 3. Banco de dados

```bash
npx prisma generate
npx prisma migrate deploy
```

### 4. Backend

```bash
npm run start:dev
```

A API sobe em `http://localhost:3001` (ou na `PORT` configurada).

### 5. App mobile

```bash
npx expo start
```

Use o Expo Go ou rode no simulador Android/iOS. Garanta que `EXPO_PUBLIC_API_URL` aponte para a máquina onde o backend está rodando (use tunnel em dispositivo físico, ex.: `npm run tunnel`).

### Build de produção (backend)

```bash
npm run build
npm run start
```

---

## Exemplos de uso

1. **Cadastro / login** — Criar conta ou entrar; os tokens são armazenados e usados em todas as chamadas à API.
2. **Criar empresa** — Pelo perfil, abra “Minhas Empresas” e crie uma empresa.
3. **Adicionar veículos** — Em “Meus Veículos”, cadastre veículos vinculados à empresa.
4. **Registrar transações** — Use a aba “Adicionar” para lançar receita ou despesa para uma empresa e veículo.
5. **Ver relatórios** — A aba Home exibe o resumo do dia e o gráfico de relatórios do período selecionado.
6. **Perfil e segurança** — Edite perfil/avatar e altere senha ou gerencie sessões a partir do stack de perfil.

---

## Boas práticas adotadas

- **Backend**
  - **Padrão Repository** — Interfaces de domínio (ex.: `ITransactionRepository`) e implementações com Prisma; services dependem de abstrações.
  - **DTOs e validação** — DTOs de request com `class-validator`; `ValidationPipe` global (whitelist, forbidNonWhitelisted, transform).
  - **Guards e strategies** — Guard JWT e estratégia Passport; `@UseGuards(JwtAuthGuard)` e decorator de usuário atual nas rotas protegidas.
  - **Módulos por feature** — Cada feature em seu próprio módulo (auth, companies, vehicles, transactions, reports) com limites claros.
- **Frontend**
  - **Estrutura por feature** — Pastas por feature com screens, hooks, api, types; UI e tema compartilhados em `shared/`.
  - **Cliente API centralizado** — Uma instância Axios; interceptor de request anexa o access token; interceptor de response trata 401 com refresh e fila de requisições para evitar múltiplos refreshes.
  - **Armazenamento seguro de tokens** — Access e refresh em Expo Secure Store; store de auth (Zustand) hidratado do storage na inicialização.
  - **Estado do servidor** — React Query para relatórios, listas e dados vindos da API; padrão consistente de loading e refetch.
- **Compartilhado**
  - **Design tokens** — Cores, tipografia e espaçamento centralizados em `shared/theme/`.
  - **Componentes reutilizáveis** — Botões, inputs, loading, modais e componentes animados da barra de abas usados nas telas.

---

## Possíveis melhorias futuras

- **Testes** — Testes unitários e de integração para services e repositórios do backend; E2E para fluxos críticos; testes de componentes/hooks no frontend.
- **Relatórios** — Filtros por empresa/veículo/categoria; exportação (ex.: CSV/PDF); custo por quilômetro usando dados de quilometragem.
- **Quilometragem** — UI e endpoints completos de registro de quilometragem (início/fim ou incremental); validação conforme regras de negócio (sem km negativo ou retroativo).
- **Integrações** — Bancos, plataformas de entrega (conforme business-logic).
- **Offline** — Cache local ou fila de transações offline e sincronização ao voltar online.
- **Notificações** — Lembretes ou alertas (ex.: despesa a vencer, resumo diário).
- **CI/CD** — Testes automatizados e builds EAS em push/PR.

---

## Status do projeto

**Ativo.** O app cobre autenticação, gestão multi-empresas e de veículos, transações financeiras, relatórios, perfil com avatar e segurança (alterar senha / sessões). Backend e mobile convivem no mesmo repositório com tipos e configuração compartilhados. Adequado para portfolio e para evolução de produto ou técnica (testes, relatórios, integrações) sem alterar a arquitetura central.

---

## Licença

Consulte o arquivo de licença do repositório (se houver).
