## ☁️ Backend - User Management API (NestJS + MySQL)
---

### 🪧 Descrição

API robusta para gerenciamento de usuários com autenticação JWT, login social, filtros, ordenação e testes unitários & E2E. Construído com **NestJS** e **TypeORM** usando **MySQL** como banco de dados.
<br />
🤓 Para nerds:
* [Documentação Tecnica](/backend/docs/)
* [Documentação Postman]()
---

### 📦 Requisitos

* 🔗 Node.js LTS >= v18.19.1
* 🦭 MySQL rodando local ou via Docker
* ☕ Café (opcional)

---

## 🚀 Instalação

```bash
# Instale dependências
npm install

# Crie o banco de dados no MySQL
CREATE DATABASE desafio_conectar;

# Configure o .env (exemplo)
# Porta e endereço backend
BACKEND_ADDRESS=http://localhost
BACKEND_PORT=3000

# prod ou dev
MODE=dev

# Dados banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=desafio_conectar
DB_TYPE=mysql

JWT_SECRET=abcd1234
JWT_EXPIRATION=3600s # exemplo: 1h, 30m
```

---

## 🦎 Rodar em modo Dev

```bash
npm run start:dev
```

* Acesse o Swagger: [http://localhost:3000/api](http://localhost:3000/api)

---

## 🦎 Testes

```bash
# Testes unitários
npm run test

# Testes E2E
npm run test:e2e

# Cobertura
npm run test:cov
```

---

## 🎉 Iniciar API

```bash
npm run start
```
```bash
🚀 Server running on http://localhost:3000
📑 Swagger: http://localhost:3000/api
```
---

## ✨ Principais rotas

| Rota                  | Descrição                                                   |
| --------------------- | ----------------------------------------------------------- |
| POST `/auth/register` | Cadastro de usuário                                         |
| POST `/auth/login`    | Login com e-mail/senha                                      |
| POST `/auth/social`   | Login/Registro com social login                             |
| GET `/users`          | Listar usuários (admin) com filtros `?role=&sortBy=&order=` |
| GET `/users/me`       | Ver perfil próprio                                          |
| PATCH `/users/me`     | Atualizar perfil próprio                                    |
| DELETE `/users/:id`   | Deletar usuário (admin)                                     |

---

## 📜 Notas

* Senhas são criptografadas com `bcrypt`.
* JWT para autenticação via header: `Authorization: Bearer <token>`
* Estrutura multi-idioma via módulo `LangService`

---

## ☕ Autor

Luan Alves
Jun, 2025
