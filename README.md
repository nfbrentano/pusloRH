# PulsoRH - SaaS de Gestão de Talentos e Clima Organizacional

PulsoRH é uma plataforma moderna de **SaaS (Software as a Service)** focada em medir o pulso da cultura organizacional e o engajamento dos colaboradores. Além de pesquisas intuitivas, o sistema oferece um ecossistema completo para gestão de talentos, departamentos e controle de acesso (RBAC).

## 🚀 Tecnologias

O projeto utiliza um stack moderno e robusto para garantir performance e escalabilidade:

### Frontend

- **React 19** & **Vite 8**: Base ultra-rápida para a interface.
- **TypeScript**: Segurança de tipos em todo o fluxo de dados.
- **Tailwind CSS v4**: Design system utilitário e responsivo.
- **TanStack Query (React Query)**: Sincronização de estado servidor/cliente.
- **Zustand**: Gerenciamento de estado global leve.
- **Lucide React**: Ícones premium e consistentes.

### Backend & Persistência

- **Node.js** com **Express**: Servidor API RESTful.
- **Prisma ORM**: Modelagem de dados e interface com o banco.
- **SQLite**: Banco de dados relacional local e eficiente.

## 🛠️ Funcionalidades Principais

### 📋 Gestão de Pesquisas

- **Construtor Intuitivo**: Criação de questionários com múltiplos tipos de métricas (Sentimento, Escala Likert, Dicotômica, Slider).
- **Preview em Tempo Real**: Visualização imediata da experiência do colaborador.
- **Multi-idioma**: Suporte nativo para Português (PT-BR) e Inglês (EN).

### 👥 Gestão de Talentos (Novo)

- **Controle de Colaboradores**: Cadastro completo, edição de perfis e status de atividade.
- **Hub de Departamentos**: Gestão centralizada de setores com personalização visual (cores dinâmicas).
- **Controle de Acesso (RBAC)**: Permissões distintas para `ADMIN`, `HR` e `USER`.

### 🎨 Experiência do Usuário (UX)

- **Layout Inteligente**: Sidebar retrátil (collapsible) para otimização de espaço.
- **Header Dinâmico**: Navegação limpa e sincronizada com o estado da aplicação.
- **Design Premium**: Foco em acessibilidade e estética moderna.

## 🏁 Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v18.0.0 ou superior)
- [npm](https://www.npmjs.com/)

## 💻 Como Rodar o Projeto

1. **Instale as dependências:**

   ```bash
   npm install
   ```

2. **Prepare o Banco de Dados (Prisma):**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

3. **Inicie o Servidor Backend:**

   ```bash
   npm run server
   ```

4. **Inicie o Frontend (em outro terminal):**

   ```bash
   npm run dev
   ```

5. **Acesse:** `http://localhost:5173`

## 📜 Scripts Disponíveis

- `npm run dev`: Servidor de desenvolvimento frontend.
- `npm run server`: Servidor API backend (ts-node).
- `npm run build`: Build de produção do frontend.
- `npm run lint`: Verificação de padrões de código.
- `npx prisma studio`: Interface visual para navegar nos dados do banco.

---

Desenvolvido para transformar a cultura organizacional através de dados e transparência.
