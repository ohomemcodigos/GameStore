<div align="center">

# 🎮 Bizarre Store

### Plataforma Full-Stack de Venda de Jogos Digitais

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

**Uma loja moderna com API própria e sistema de chaves de licença, desenvolvida com foco em segurança, performance e UI profissional.**

[Frontend (Vercel)](#-frontend) • [Backend (Render)](#-api-rest) • [Instalação](#-instalação-rápida) • [Funcionalidades](#-características)

---

</div>

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Instalação Rápida](#-instalação-rápida)
- [Arquitetura](#-arquitetura)
- [API REST](#-api-rest)
- [Frontend](#-frontend)
- [Desenvolvimento](#-desenvolvimento)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

**Bizarre Store** é uma plataforma completa de comércio eletrônico para jogos digitais. Ela utiliza uma **API RESTful própria** para gerenciar o catálogo, autenticação, e o fluxo de compra/venda de **chaves de licença** exclusivas.

---

## 🌐 Demonstração Online

Acesse o projeto rodando em produção:

* **Frontend (Site):** 🔗 [bizarre-games-store.com](https://bizarre-games.vercel.app/)
* **API (Swagger Docs):** 🔗 [game-store-api/api-docs/](https://game-store-api-ykwm.onrender.com/api-docs/)

---

### 💡 Destaques

O projeto demonstra proficiência em:

- 💰 **Transações Seguras**: Simulação de pagamento com lógica de **Transação Atômica** (Prisma) para garantir a consistência dos dados.
- 🎨 **UX/UI Profissional**: Design moderno (Dark Mode) com notificação fluida (`Sonner`) e carrinho persistente (`localStorage`).
- 🔗 **SEO-Friendly**: Uso de **Slugs dinâmicos** (`/game/nome-do-jogo`) nas URLs.

---

## ✨ Características

### 🔥 Funcionalidades Principais

| Recurso | Descrição |
|---------|-----------|
| **CRUD Completo** | Gerenciamento total de **Jogos** via Painel Admin. |
| **Pagamento Simulado**| Processa pedidos e gera chaves de licença automaticamente. |
| **Biblioteca de Jogos** | Área do Usuário para armazenar e revelar chaves compradas. |
| **Rotas Dinâmicas** | Implementação de **Slugs** para URLs amigáveis. |
| **Gestão de Mídia** | Cadastro de Galeria de Imagens e Vídeos (YouTube) via Admin. |
| **Carrinho Persistente** | O carrinho armazena itens mesmo após o usuário recarregar a página. |
| **Validação Robusta** | Validação de dados (API/Admin) com **Zod**. |

### 🎨 Interface e Experiência

- **Design Estilizado**: Interface moderna em Dark Mode.
- **Performance**: Carregamento rápido com Vite.
- **Notificações**: Uso de Toasts (`Sonner`) para feedback não-invasivo.
- **Perfis**: Gestão de dados do usuário e rotas privadas (Admin, Biblioteca).

---

## 🛠️ Tecnologias

### Backend (API REST)

<div align="left">
  <img src="https://skillicons.dev/icons?i=nodejs,typescript,express,prisma,postgres" alt="Backend Tech Stack" />
</div>

**Principais dependências:**
- **Prisma** - ORM para interação segura com o banco de dados.
- **Zod** - Validação de esquemas TypeScript-first.
- **Express** - Criação da API REST.
- **JSON Web Token (JWT)** - Autenticação e autorização de rotas.

### Frontend (SPA)

<div align="left">
  <img src="https://skillicons.dev/icons?i=react,typescript,vite,css,html" alt="Frontend Tech Stack" />
</div>

**Principais dependências:**
- **React** & **Vite** - Construção da Single Page Application (SPA).
- **React Router DOM** - Roteamento.
- **Lucide React** - Biblioteca de ícones modernos.
- **Sonner** - Toasts e notificações.

---

## 🚀 Instalação Rápida

### Pré-requisitos

Antes de começar, certifique-se de ter em sua máquina:

- **Node.js** 20.0.0 ou superior ([Download](https://nodejs.org/))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/get-started))
- **Git** ([Download](https://git-scm.com/))

### ⚡ Setup Local

#### 1️⃣ Clone e Instale as Dependências

```bash
git clone https://github.com/ohomemcodigos/GameStore.git
cd PROJETO-GAME-STORE
```

### 2️⃣ Instale Dependências

``` bash
cd backend && npm install
cd ../frontend && npm install
```

### 3️⃣ Configure o Banco

Crie o arquivo:

    backend/.env

Conteúdo:

    DATABASE_URL="postgresql://user:password@localhost:5432/bizarre_db"
    JWT_SECRET="SUA_CHAVE_SECRETA_AQUI"

### 4️⃣ Migração + Seed

``` bash
npx prisma migrate dev
npx ts-node prisma/seed.ts
```

### 5️⃣ Inicie

``` bash
# Backend
npm run dev

# Frontend
npm run dev
```

------------------------------------------------------------------------

## 🏗️ Arquitetura

    PROJETO-GAME-STORE/
    ├── 📁 backend/
    │   ├── 📁 src/
    │   │   ├── 📁 controllers/     # Lógica de requisições e validação (Zod)
    │   │   ├── 📁 services/        # Lógica de negócio e acesso ao banco (Prisma)
    │   │   ├── 📁 validators/      # Schemas de validação Zod
    │   │   └── index.ts            # Servidor Express
    │   └── 📄 prisma/schema.prisma  # Definição do Banco
    │
    ├── 📁 frontend/
    │   ├── 📁 src/
    │   │   ├── 📁 api/             # Funções de comunicação com o Backend
    │   │   ├── 📁 components/      # Componentes reutilizáveis
    │   │   ├── 📁 context/         # Estados globais (Autenticação, Carrinho)
    │   │   └── 📁 pages/           # Telas da Aplicação
    │   └── 📄 package.json
------------------------------------------------------------------------

## 📡 API REST

  |**Recurso**|**Metodo**|**Endpoint**|**Auth**|**Descrição**|
  |---------|--------|--------------|---------|-----------------------
  |Jogos|`GET`|`/games`|`Público`|Lista catálogo|
  |Jogos|`GET`|`/games/:slug`|`Público`|Detalhes|
  |Jogos|`POST`|`/admin/games`|`ADMIN`|Criar jogo|
  |Pedidos|`POST`|`/orders`|`User`|Criar pedido + chaves|
  |Pedidos|`GET`|`/orders/my`|`User`|Biblioteca|
  |Auth|`POST`|`/auth/login`|`Público`|Login|

------------------------------------------------------------------------

## 💻 Desenvolvimento

-   **TypeScript Strict Mode**
-   **Zod para validação robusta**\
-   **Arquitetura escalável baseada em camadas**\
-   **Padrões de commit e branches recomendados**

### Acesso Admin

Um usuário deve ser criado manualmente no banco com `role = ADMIN`.

------------------------------------------------------------------------

## Suporte

### 💬 Precisa de Ajuda?

- **Documentação**: Leia o README completo
- **Bug Report**: [Abra uma issue](https://github.com/ohomemcodigos/GameStore/issues/new?template=bug_report.md)
- **Feature Request**: [Sugira melhorias](https://github.com/ohomemcodigos/GameStore/issues/new?template=feature_request.md)
- **Discussões**: [GitHub Discussions](https://github.com/ohomemcodigos/GameStore/discussions)

---

## 📄 Licença

Este projeto está sob a licença **MIT**.

Isso significa que você pode:
- Usar comercialmente
- Modificar
- Distribuir
- Uso privado

Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

------------------------------------------------------------------------

## 👤 Autores

### Desenvolvido por
**Equipe BizarreTeam**
- [@ohomemcodigos](https://github.com/ohomemcodigos)
- [@ZeusFontes](https://github.com/ZeusFontes)
- [@GabrielHo9](https://github.com/GabrielHo9)
- [@BrennoLucas12](https://github.com/BrennoLucas12)

<div align="center">

### ⭐ Se curtiu nosso projeto, considere deixar uma estrela! ⭐

[![GitHub stars](https://img.shields.io/github/stars/ohomemcodigos/GameStore?style=social)](https://github.com/ohomemcodigos/GameStore/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/ohomemcodigos/GameStore?style=social)](https://github.com/ohomemcodigos/GameStore/forks)
[![GitHub watchers](https://img.shields.io/github/watchers/ohomemcodigos/GameStore?style=social)](https://github.com/ohomemcodigos/GameStore/watchers)

---

**Powered by madrugadas mal dormidas**

[⬆ Voltar ao topo](#-bizarre-store)

</div>


