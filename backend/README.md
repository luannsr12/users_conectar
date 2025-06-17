## ☁️ Backend - User Management API (NestJS + MySQL/PostgreSQL)

### 🪧 Descrição

API robusta para gerenciamento de usuários com autenticação JWT, login social, filtros, ordenação e testes unitários & E2E. Construída com **NestJS** e **TypeORM** usando **MySQL/PostgreSQL**.

🤓 Para nerds:

* [Documentação Técnica](/backend/docs/)
* [Swagger](http://localhost:3000/api)

---

### 📦 Requisitos

* Node.js LTS >= v18.19.1
* MySQL ou PostgreSQL local ou Docker
* Café ☕ (opcional)

---

## 🚀 Instalação

```bash
npm install

# Banco de dados
CREATE DATABASE conectar_db;

# .env exemplo
BACKEND_ADDRESS=localhost
BACKEND_PORT=3000
MODE=dev
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=conectar_db
JWT_SECRET=abcd1234
JWT_EXPIRATION=3600s
```

---

## 🦎 Dev

```bash
npm run start:dev
```

Swagger: [http://localhost:3000/api](http://localhost:3000/api)

---

## 🧪 Testes

```bash
npm run test
npm run test:e2e
npm run test:cov
```

---

## 🎉 Produção

```bash
npm run start
```

```
🚀 Server running on http://localhost:3000
📑 Swagger: http://localhost:3000/api
```

---

## ✨ Principais rotas

| Rota                  | Descrição               |
| --------------------- | ----------------------- |
| POST `/auth/register` | Cadastro                |
| POST `/auth/login`    | Login                   |
| GET `/users`          | Listar usuários (admin) |
| GET `/users/me`       | Ver perfil próprio      |
| PATCH `/users/me`     | Atualizar perfil        |
| DELETE `/users/:id`   | Deletar usuário (admin) |

---

## 📜 Notas

* Senhas com `bcrypt`
* JWT em `Authorization: Bearer <token>`
---

## ☕ Autor

Luan Alves
Jun, 2025
