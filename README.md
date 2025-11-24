# README DESATUALIZADO
# 🎮 API de Loja de Jogos 🎮

> Uma API RESTful robusta para gerenciar uma plataforma de venda de jogos online, desenvolvida com Node.js, Express, TypeScript e Prisma.

## Sobre o Projeto

Este projeto consiste no desenvolvimento do backend para uma loja de jogos digitais. A API permite o gerenciamento completo de três recursos principais: Jogos, Usuários e Compras. A arquitetura foi estruturada para ser escalável e organizada, separando as responsabilidades em rotas, controllers e validadores de dados.

A aplicação inclui um sistema completo de CRUD para todos os recursos, validação de dados de entrada para garantir a integridade e uma documentação interativa gerada com Swagger para facilitar o teste e a visualização dos endpoints.

## Funcionalidades

-   **Gerenciamento de Jogos:** CRUD completo para adicionar, visualizar, atualizar e deletar jogos do catálogo.
-   **Gerenciamento de Usuários:** CRUD completo para usuários, incluindo endpoints para registro e login.
-   **Sistema de Compras:** Funcionalidade para criar, visualizar, atualizar e deletar registros de compras, relacionando um usuário a um jogo.
-   **Validação de Dados:** Utilização da biblioteca Zod para validar todos os dados de entrada, garantindo que apenas informações válidas e seguras sejam processadas.
-   **Documentação Interativa:** Geração automática de uma documentação completa e interativa com Swagger UI.

## Tecnologias Utilizadas

-   **Backend:** Node.js, Express.js
-   **Linguagem:** TypeScript
-   **Banco de Dados:** PostgreSQL
-   **ORM:** Prisma
-   **Validação:** Zod
-   **Documentação:** Swagger (swagger-jsdoc, swagger-ui-express)

## Começando (Getting Started)

Siga as instruções abaixo para configurar e rodar o projeto em seu ambiente local.

### Pré-requisitos

-   [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
-   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
-   [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose
-   [Git](https://git-scm.com/)

### Configurando o Banco de Dados com Docker

Para simplificar a configuração, este projeto utiliza Docker para rodar o banco de dados PostgreSQL.

1.  **Crie o arquivo `docker-compose.yml`:** Na raiz do projeto, crie um arquivo com este nome e cole o seguinte conteúdo:

    ```yaml
    version: '3.8'

    services:
      postgres:
        image: postgres:14-alpine
        container_name: game_store_db
        restart: always
        environment:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: mysecretpassword
          POSTGRES_DB: game_store
        ports:
          - "5432:5432"
        volumes:
          - postgres_data:/var/lib/postgresql/data

    volumes:
      postgres_data:
    ```

2.  **Inicie o Container:** No terminal, na raiz do projeto, execute:

    ```bash
    docker-compose up -d
    ```
    O banco de dados agora está rodando em segundo plano.

### Instalação da Aplicação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```

2.  **Navegue até o diretório do projeto:**
    ```bash
    cd seu-repositorio
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

4.  **Configure as variáveis de ambiente:**
    -   Crie uma cópia do arquivo `.env.example` e renomeie para `.env`.
    -   Abra o arquivo `.env` e preencha a `DATABASE_URL` para conectar ao banco no Docker.

    ```
    DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/game_store"
    ```

5.  **Aplique as migrações do Prisma:**
    -   Este comando irá criar as tabelas no seu banco de dados que está no Docker.
    ```bash
    npx prisma migrate dev
    ```

6.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

## Uso / Endpoints da API

A documentação completa e interativa dos endpoints está disponível via Swagger UI. Após iniciar o servidor, acesse o seguinte endereço no seu navegador:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

A partir dessa interface, é possível visualizar e testar todos os endpoints disponíveis na API.

## Schema do Banco de Dados

O schema do banco de dados é gerenciado pelo Prisma e pode ser visualizado no arquivo `prisma/schema.prisma`.

```prisma
// Cole aqui o conteúdo do seu arquivo prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Game {
  // ...
}

model User {
  // ...
}

model Purchase {
  // ...
}
```
# Licença
Este projeto está sob a licença MIT.



