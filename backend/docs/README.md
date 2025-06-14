# 📘 Documentação Técnica - Backend NestJS + MySQL

## Visão Geral

Este projeto é uma API backend construída com **NestJS** e **TypeORM**, usando **MySQL** como banco de dados. Essa API faz parte do projeto 'desafio_conectar'. 

O sistema oferece:

* Registro, login e autenticação JWT
* Login social com registro automático
* Gerenciamento de usuários com permissões (admin/user)
* Filtros, ordenação e controle de acesso
* Internacionalização básica com `LangService`
* Testes unitários e end-to-end

---

## 📁 Estrutura principal

```
backend/
 ├── src/
 │   ├── auth/           # Módulo de autenticação (register, login, social login)
 │   ├── users/          # Módulo de usuários (CRUD + filtros)
 │   ├── lang/           # Módulo de mensagens multi-idioma
 │   ├── seeder/         # Seeder para admin
 │   ├── __tests__/      # Testes unitários centralizados
 ├── test/               # Testes E2E
 ├── .env                # Configurações de ambiente
 ├── package.
```

## 📎 Módulos

### 🦄 **AuthModule (`src/auth/`)**

* `auth.controller.ts`
  * Define rotas:
    * `/auth/register`
    * `/auth/login`
    * `/auth/social`
* `auth.service.ts`
  * Lógica principal de autenticação, geração de JWT e registro social.
* `jwt.strategy.ts` & `jwt-auth.guard.ts`:
  * Protegem rotas usando tokens JWT.
* `dto/`
  * Objetos de transferência para validação de entrada:
    * `RegisterAuthDto`
    * `LoginAuthDto`
    * `SocialAuthDto`

**Explicação:**

```ts
@Post('register')
async register(@Body() data: RegisterAuthDto) {
  return this.authService.register(data);
}
```
> [!TIP]
> Recebe dados validados pelo DTO, passa para o service que criptografa a senha, verifica duplicidade de e-mail e salva no banco.

<br>

### 🦄 **UsersModule (`src/users/`)**

* `users.controller.ts`
  * Define rotas:
    * `/users` (admin)
    * `/users/me`
* `users.service.ts`
  * Regras de negócio, CRUD, filtros e ordenação.
* `user.entity.ts`
  * Define a tabela:
    * `user` (table)
      * `name`
      * `email`
      * `password`
      * `role`
      * `social_login`

**Destaque:**

```ts
@Column({ type: 'json', nullable: true, default: null })
social_login: { social: string; active: number } | null;
```

> [!TIP]
> Permite armazenar informações do provedor social de login.

<br>

### 🦄 **LangModule (`src/lang/`)**

* `lang.service.ts`:
  * Provê mensagens de retorno centralizadas.
* `locales/pt_BR.json`
  * Dicionário em português.

**Exemplo de uso:**

```ts
if (existingUser) {
  throw new BadRequestException(this.lang.get('auth.email_in_use'));
}
```

> [!TIP]
> Garante mensagens consistentes e fácil manutenção de textos.
 
<br>

### 🦄 **SeederModule (`src/seeder/`)**

* `seeder.service.ts`:
  * Crie um user admin ao instalar a API
* Se estiver em modo dev os dados do admin criado são:
  * Email: `admin@admin.com`
  * Password: `admin`

> [!TIP]
> Em MODE=dev cria automaticamente um user admin para facilitar testes


---

## 🔥 Configuração

* Variáveis de ambiente gerenciadas por `ConfigModule`.
* `TypeOrmModule.forRootAsync` usa `ConfigService` para conectar ao MySQL.
* `MODE` controla `synchronize` (dev vs prod).

**Trecho:**

```ts
synchronize: config.get('MODE') !== 'prod'
```

> [!TIP]
> Evita sincronizar o schema em produção.

---

## 🦎 Testes

* **Unitários:** isolam lógica de services e controllers com mocks (`src/__tests__/`).
* **E2E:** simulam requisições reais (`test/app.e2e-spec.ts`).

**Rodar:**

```bash
npm run test          # Unitários
npm run test:e2e      # End-to-end
npm run test:cov      # Cobertura
```

---

## 🍯 Fluxo de Autenticação

* **Register:**
  * Cria usuário novo com senha criptografada (`bcrypt`).
* **Login:**
  * Valida credenciais com hash, gera JWT assinado.
* **Social Login:**
  * Verifica e cria/atualiza usuário com `social_login` JSON e devolve JWT.

---

## 🚀 Observações Técnicas

* Organização modular → cada domínio isolado.
* DTO + `ValidationPipe` → entrada fortemente validada.
* Guards + Strategy → padrão NestJS para auth.
* Mensagens multilíngue simplificadas, fácil expansão.
* Swagger automático via decorators → [http://localhost:3000/api](http://localhost:3000/api)

---

## ☕ Autor

Luan Alves
Jun, 2025
