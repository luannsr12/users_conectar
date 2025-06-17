## 📘 Documentação Técnica - Backend NestJS + MySQL/PostgreSQL

## Visão Geral

API backend modular, usando **NestJS**, **TypeORM**, **MySQL/PostgreSQL**, estruturada por domínio: módulos de segurança, autenticação, perfis de usuário, administração e internacionalização, com interceptores e filtros globais padronizados.

## 📁 Estrutura

```
backend/
 ├── src/
 │   ├── modules/
 │   │   ├── security/      # JWT Strategy e Guard globais
 │   │   ├── auth/          # AuthController, AuthService, DTOs
 │   │   ├── users/         # UsersController, UsersService, DTOs, Entity
 │   │   ├── admin/         # AdminUsersController (rotas restritas admin)
 │   │   ├── seeder/        # SeederService
 │   ├── common/            # Entities, interceptors, filters globais
 │   ├── __tests__/         # Testes unitários de controllers e services
 ├── test/                  # Testes E2E
 ├── .env                   # Config de ambiente
```
---

## 📎 Módulos

### 🦄 SecurityModule

* `jwt.strategy.ts` + `jwt-auth.guard.ts` aplicados globalmente para proteger rotas.

### 🦄 AuthModule

* `auth.controller.ts` ➝ `/auth/register`, `/auth/login`
* `auth.service.ts` ➝ valida credenciais, gera JWT, login social.
* `dto/` ➝ `RegisterAuthDto`, `LoginAuthDto` (baseados em `createZodDto`).

### 🦄 UsersModule

* `users.controller.ts` ➝ `/users/me` (perfil próprio)
* `users.service.ts` ➝ CRUD pessoal, update com hash.
* `user.entity.ts` ➝ Campos: `name`, `email`, `password`, `role`, `social_login` JSON.

### 🦄 AdminModule

* `admin-users.controller.ts` ➝ `/admin/users` (listar, criar, deletar usuários) acessível só para `role=admin`.

### 🦄 SeederModule

* `seeder.service.ts` ➝ cria admin default em `dev`.

  * Email: `admin@admin.com`
  * Senha: `admin`

---

## 📚 Bibliotecas Utilizadas 

| Lib                              | Por que usar?         | Função                                                 |
| -------------------------------- | --------------------- | ------------------------------------------------------ |
| **@nestjs/core, @nestjs/common** | Core do NestJS        | Estrutura modular, decorators, injeção de dependências |
| **@nestjs/typeorm**              | ORM oficial do NestJS | Mapeia entidades, queries flexíveis com repositórios   |
| **typeorm**                      | ORM SQL de alto nível | Suporta MySQL e PostgreSQL, migrations, relations      |
| **@nestjs/jwt**                  | JWT nativo Nest       | Gera e valida tokens, integrado ao Guard               |
| **bcrypt**                       | Hash de senhas seguro | Criptografa senha antes de persistir                   |
| **nestjs-zod**                   | Validação moderna     | Usa Zod para DTOs, tipagem e Swagger coerente          |
| **zod**                          | Validador TS/JS       | Schemas declarativos, tipagem forte                    |
| **@nestjs/swagger**              | Docs automática       | Gera Swagger usando decorators Nest                    |
| **@nestjs/config**               | Configuração via .env | Injeta variáveis de ambiente de forma tipada           |
| **jest**                         | Testes unitários      | Framework padrão de testes do NestJS                   |
| **supertest**                    | Teste E2E de rotas    | Simula requests HTTP reais para E2E                    |
| **cross-env**                    | Compatibilidade env   | Define variáveis ambiente multiplataforma              |

### Motivos de escolha

* **NestJS:** arquitetura escalável, modular, ideal para APIs REST.
* **TypeORM:** ORM maduro, fácil migração, abstrai SQL sem perder controle.
* **Zod + nestjs-zod:** Validação declarativa, forte tipagem, docs automáticas coerentes.
* **JWT + bcrypt:** Autenticação robusta, padrão de mercado.
* **ConfigModule:** Centraliza .env sem poluir o código.
* **Swagger:** Documentação viva para devs e integração com frontend.

Tudo escolhido visando **manutenção limpa**, **boas práticas** e **escalabilidade**.

---

## 🔥 Configuração

* `.env` com `DB_TYPE`, `JWT_SECRET`, `MODE` (`dev` vs `prod`)
* `TypeOrmModule.forRootAsync` carrega dinamicamente do `ConfigService`.
* `synchronize` = `true` só em `dev`.

## 🧪 Testes

```bash
npm run test       # Unit
npm run test:e2e   # E2E
npm run test:cov   # Coverage
```

## 🔒 Autenticação

* **Register:** Cria usuário com senha criptografada (`bcrypt`).
* **Login:** Valida credenciais, gera JWT.
* **Social Login:** Registra ou atualiza `social_login` JSON, retorna JWT.

## 🚀 Observações

* Padrão limpo: Guards, Strategies e Pipes globais.
* Swagger com JWT `Authorize` global ([http://localhost:3000/api](http://localhost:3000/api)).
* DTOs validados com Zod via `nestjs-zod`.

## ☕ Autor

Luan Alves
Jun, 2025
