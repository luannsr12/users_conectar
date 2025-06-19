# Conéctar Panel

**Conéctar Panel** é um sistema fullstack (frontend React + backend Node/NestJS) desenvolvido com foco em performance, escalabilidade e arquitetura limpa. Utiliza Vite no frontend e integração JWT + OAuth2 (Google) na autenticação, com comunicação API REST entre front e back.

-   [Panel Demo live](https://fabulous-laughter-production-e256.up.railway.app)
    -  ✉️ admin@admin.com
    -  🔑 admin
-   [API Swagger Docs](https://usersconectar-production.up.railway.app/api)

--- 

## 🚀 Tecnologias utilizadas

### Frontend (React + Vite + TypeScript)

* [Vite](https://vitejs.dev/) - bundler moderno, super rápido.
* [React](https://react.dev/) - base da UI.
* [TypeScript](https://www.typescriptlang.org/) - tipagem estática.
* [Axios](https://axios-http.com/) - HTTP client para comunicação com backend.
* [Zod](https://github.com/colinhacks/zod) - validação de dados.
* [React Router DOM](https://reactrouter.com/) - roteamento SPA.
* [React Hook Form](https://react-hook-form.com/) - gerenciamento de formulários.
* [React Helmet](https://github.com/nfl/react-helmet) - controle de `<title>` e metadados.

### Backend (Node.js + NestJS + MySQL)

* [NestJS](https://nestjs.com/) - framework Node com arquitetura escalável.
* [TypeORM](https://typeorm.io/) - ORM para banco MySQL.
* [Passport + JWT + Google OAuth](https://docs.nestjs.com/security/authentication) - sistema de autenticação robusto.
* [dotenv](https://github.com/motdotla/dotenv) - gerenciamento de variáveis de ambiente.

🤓 Para nerds:

* [Documentação Técnica](/backend/docs/)
* [Swagger](http://localhost:3000/api)

---

<img src="/screenshots/login-google.png" width="400" alt="Painel">
<img src="/screenshots/admin-users.png" width="400" alt="Painel">

[Ver todas screenshots](/screenshots/)

# Checklist do Projeto

- [x] Gerenciamento de Usuários
- [x] Interface Amigável
- [x] Backend (NestJS + TypeScript)
- [x] JWT `/auth/register` e `/auth/login`
- [x] CRUD
- [x] Filtros e Ordenação 
- [x] Listagem de usuários inativos
- [x] Testes Automatizados
- [x] Tela de Login
- [x] Tela de Cadastro
- [x] Login com Google
- [x] Tela de Listagem de Usuários (admin)
- [x] Interface Responsiva
- [x] Escalabilidade
- [x] Segurança
- [x] Documentação
- [x] Arquitetura Limpa

---

## 📂 Estrutura do projeto

```
/users_conectar
├── backend
│   ├── src
│   │   ├── cli
│   │   ├── common          (entities, pipes, schema, guards)
│   │   ├── migrations      (Create table user)
│   │   ├── modules         (controllers, services, etc)
│   │   └── main.ts
│   └── .env
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── contexts
│   │   │   ├── (admin)     (pages admin)
│   │   │   ├── (auth)      (login and register)
│   |   |   └── (user)      (profile user)
│   │   ├── hooks
│   │   ├── pages
│   │   ├── stores
│   │   ├── types
│   │   └── utils
│   │   ├── routesConfig.ts
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── vite.config.ts
```

---

### 📦 Requisitos

* Node.js LTS >= v18.19.1
* MySQL ou PostgreSQL local ou Docker
* Café ☕ (opcional)

---

## 🚀 Instalação

```bash
git clone https://github.com/luannsr12/users_conectar.git
cd users_conectar

#instalar backend
cd backend && npm install && cd ../

#instalar frontend
cd frontend && npm install && cd ../
```
<br />
Crie seu banco de dados.

```bash
# Banco de dados
CREATE DATABASE conectar_db;
```

<br />

### Backend
backend/.env

```bash
# editar arquivo .env do backend
cd backend && cp .env.example .env && nano .env
```

```bash
# environment (.env)

# Porta e endereço backend
IP_ADDRESS=127.0.0.1 # api.backend.dev ou 127.0.0.1 (ip)
BACKEND_PORT=3000

FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://127.0.0.1:3000

# prod ou dev
MODE=dev

# Dados banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=panel_conectar
DB_TYPE=mysql

# Credenciais Google Auth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

JWT_SECRET=123
JWT_EXPIRATION=3600s

```
> Obs: Preencha as variáveis do Google Auth para login funcionar.

---
<br />

### Frontend
frontend/.env

No arquivo `vite.config.ts`, a URL da API é definida via `import.meta.env.VITE_API_URL`. Crie o `.env` na raiz do frontend:

```bash
# editar arquivo .env do frontend
cd ../                               # sai da pasta backend se estiver nela 
cd frontend                          # acessa a pasta frontend 
cp .env.example .env && nano .env    # inicia a edição do .env
```

```bash
# environment (.env)

# endpoint api (backend)
VITE_API_URL=http://127.0.0.1:3000

```

---


## 💡 Migrations
Rode os comandos abaixo para criar as tabelas no database
Gere também dados demo e login admin. (Lembre-se de ter criado o database já)
```bash
# acessa backend
cd backend

# cria a tabela
npm run migrate:run

# popula o banco de dados com users demo e admin
npm run db:setup

# se tudo ocorrer bem os dados do admin são:
#<email>: admin@admin.com
#<pass>: admin123

# será criado ao total 20 usuário demo, todos possuem a senha padrão:
#<email>: cada user possui um aleatorio
#<pass>: user123

```

---

## 🧪 Testes

```bash
npm run test
```
---

## 🦎 Running: Modo de teste

```bash
# start backend
cd backend
npm run start:dev


# start frontend
cd frontend
npm run dev
```

Panel: [http://localhost:8080/auth/login](http://localhost:8080/auth/login)
Swagger: [http://localhost:3000/api](http://localhost:3000/api)


---

## 🚀 Primeira execução completa

```bash
# Backend
cd backend
cp .env.example .env     # (se houver um exemplo)
npm install
npm run migrate:run
npm run db:setup
npm run start:dev

# Frontend
cd ../frontend
cp .env.example .env     # (se houver um exemplo)
npm install
npm run dev
```

---

## 🎉 Running: Produção

```bash
# start backend
cd backend
npm run start


# start frontend
cd frontend
npm run build
npm install -g serve
serve -s -p 8080 dist # rodando na porta 8080

```
>
>🚀 Panel: [http://localhost:8080/auth/login](http://localhost:8080/auth/login)
>📑 Swagger: [http://localhost:3000/api](http://localhost:3000/api)


---

## ✨ API Backend

| Rota                              | Descrição                  |
| --------------------------------- | -------------------------- |
| POST `/auth/register`             | Cadastro                   |
| POST `/auth/login`                | Login                      |
| POST `/auth/google`               | Redirect Login Google      |
| POST `/auth/google/callback`      | Callback Login Google      |
| GET `/admin/users/list`           | Listar usuários (admin)    |
| POST `/admin/users/create`        | Cadastrar usuários (admin) |
| PATCH `/admin/users/update/{id}`  | Atualizar usuário (admin)  |
| DELETE `/admin/users/delete/{id}` | Remover usuário (admin)    |
| GET `/users/me`                   | Ver perfil próprio         |
| PATCH `/users/me`                 | Atualizar perfil           |

---

## 📜 Notas

* Senhas com `bcrypt`
* JWT em `Authorization: Bearer <token>`
* Defina a URL API do backend em `.env` dentro de `frondend`
---

## 🎭 Layout e Design

* Interface responsiva e moderna.
* Componentização inteligente para reutilização de elementos.
* Navegação fluida com React Router.
* Integração com Google Auth para login seguro.

---

## ☕ Autor

Luan Alves
Jun, 2025
