# AIQFome Node API

API REST desenvolvida com NestJS seguindo os princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**.

## Arquitetura

O projeto está organizado em camadas bem definidas:

- **Domain Layer**: Lógica de negócio e entidades
- **Infrastructure Layer**: Controllers, banco de dados e configurações
- **Application Layer**: Casos de uso e orquestração


## Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **Zod** - Validação de dados
- **Vitest** - Testes
- **Docker** - Containers

## Pré-requisitos

- Node.js (versão 18 ou superior)
- pnpm
- Docker e Docker Compose

## Instalação e Configuração

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://postgres:docker@localhost:5432/nest-store"
JWT_SECRET="your-secret-key"
```

### 3. Subir o banco de dados com Docker

```bash
docker-compose up -d
```

### 4. Executar migrações do Prisma

```bash
pnpm prisma migrate dev
```

### 5. Gerar cliente Prisma

```bash
pnpm prisma generate
```

## Comandos de Desenvolvimento

### Executar a aplicação

```bash
# Desenvolvimento
pnpm run start:dev
```

### Testes

```bash
# Testes em modo watch
pnpm run test:watch

# Testes E2E
pnpm run test:e2e
```

## Comandos do Prisma

```bash
# Gerar cliente Prisma
pnpm prisma generate

# Executar migrações
pnpm prisma migrate dev

# Reset do banco de dados
pnpm prisma migrate reset

# Visualizar banco de dados (Prisma Studio)
pnpm prisma studio

# Verificar schema
pnpm prisma validate
```

## Comandos do Docker

```bash
# Subir serviços
docker-compose up -d

# Parar serviços
docker-compose down

# Ver logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build
```

## Endpoints da API

### Autenticação
- `POST /auth/sessions` - Login de usuário

### Clientes
- `POST /customers` - Criar cliente
- `GET /customers` - Listar clientes
- `GET /customers/:id` - Buscar cliente por ID
- `GET /customers/:id/favorites` - Listar favoritos do cliente
- `PUT /customers/:id` - Atualizar cliente
- `DELETE /customers/:id` - Deletar cliente

### Favoritos
- `POST /favorites` - Adicionar favorito
- `DELETE /favorites/:id` - Remover favorito

