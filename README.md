# Bizarre GameStore

Uma plataforma completa de distribuição digital de jogos (*E-commerce*), desenvolvida para oferecer uma experiência fluida de compra, gerenciamento de biblioteca e interação da comunidade através de avaliações.

![Status do Projeto](https://img.shields.io/badge/status-concluído-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat\&logo=typescript\&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat\&logo=react\&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat\&logo=node.js\&logoColor=white)

---

## 🌐 Demonstração Online

Acesse o projeto rodando em produção:

* **Frontend (Site):** 🔗 *https://bizarregamesstore.vercel.app/*
* **API (Swagger Docs):** 🔗 *https://game-store-api-ykwm.onrender.com/api-docs/*

---

## Tecnologias Utilizadas

Stack **PERN** (Postgres, Express, React, Node), com foco em performance e tipagem estática.

### **Frontend**

* React (Vite)
* TypeScript
* React Router Dom
* Context API (Auth + Carrinho)
* Axios
* CSS Modules / Styled Components

### **Backend**

* Node.js + Express
* Prisma ORM
* PostgreSQL (NeonDB)
* Swagger
* JWT para autenticação

### **Infraestrutura & DevOps**

* Vercel (Frontend)
* Render (Backend)
* NeonDB (Serverless PostgreSQL)

---

## Funcionalidades Principais

* **Autenticação:** Login e cadastro com senhas criptografadas.
* **Catálogo de Jogos:** Filtros, busca, paginação.
* **Sistema de Avaliações:**

  * Notas (1–5)
  * Comentários
  * Média ao vivo
*  **Carrinho:** Adicionar/remover jogos, resumo do pedido.
*  **Checkout Simulado:** Fluxo seguro.
*  **Minha Biblioteca:** Jogos adquiridos pelo usuário.
*  **Perfil:** Atualização de dados.

---

## Como rodar localmente

### **Pré-requisitos**

* Node.js (v18+)
* Git
* Conta no [NeonDB](https://neon.tech) ou Postgres local

---

## **1. Clone o repositório**

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd GameStore
```

---

## **2. Configurando o Backend (API)**

```bash
# Entre na pasta da API
cd backend/API_GameStore

# Instale as dependências
npm install

# Crie um arquivo .env com as variáveis abaixo

# Gere o client do Prisma
npx prisma generate

# Crie as tabelas
npx prisma db push

# Popule o banco
npx prisma db seed

# Inicie o servidor
npm run dev
```

**Backend rodará em:** [http://localhost:3000](http://localhost:3000)

---

## **3. Configurando o Frontend (UI)**

```bash
# Em outro terminal, volte para a raiz
cd frontend/game-store-ui

# Instale dependências
npm install

# Crie o .env
# VITE_API_URL="http://localhost:3000/api"

# Inicie o projeto
npm run dev
```

**Frontend rodará em:** [http://localhost:5173](http://localhost:5173)

---

## Variáveis de Ambiente

### **Backend (`backend/API_GameStore/.env`)**

```env
DATABASE_URL="postgres://usuario:senha@endpoint.neon.tech/neondb?sslmode=require"
PORT=3000
JWT_SECRET="sua_chave_super_secreta_aqui"
RENDER_EXTERNAL_URL="http://localhost:3000"
```

### **Frontend (`frontend/game-store-ui/.env`)**

```env
VITE_API_URL="http://localhost:3000/api"
```

---

## Estrutura do Projeto

```
GameStore/
├── backend/
│   └── API_GameStore/
│       ├── src/
│       │   ├── controllers/     # Controladores das rotas
│       │   ├── routes/          # Endpoints (Games, Reviews, Auth)
│       │   ├── services/        # Lógica + Prisma
│       │   └── index.ts         # Entrada da API
│       └── prisma/              # Schema e Seed
│
└── frontend/
    └── game-store-ui/
        ├── src/
        │   ├── components/      # Componentes reutilizáveis
        │   ├── context/         # AuthContext e CartContext
        │   ├── pages/           # Telas (Home, Login, Profile...)
        │   ├── api/             # Axios configurado
        │   └── App.tsx          # Rotas
        └── vercel.json          # Rewrite para SPA
```

---

## Licença

Distribuído sob a licença **MIT**.
