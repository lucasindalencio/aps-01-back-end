# Restaurant Ordering System – API de autoatendimento para restaurante

## 1. Descrição

API REST para um sistema de autoatendimento de restaurante (pizzaria). Ela resolve o problema de manter o **cardápio digital** organizado: o cliente (ou o totem/aplicativo de autoatendimento) consulta categorias e produtos, e a equipe do restaurante pode cadastrar, alterar e remover itens.

O objetivo da API é expor, via HTTP e JSON, o CRUD das entidades **Categoria** e **Produto**, persistindo os dados no Supabase/PostgreSQL.

## 2. Identificação do estudante

- **Nome completo:** _<PREENCHER COM SEU NOME COMPLETO>_

## 3. Tecnologias utilizadas

- Node.js
- TypeScript
- Express 5
- Supabase (`@supabase/supabase-js`)
- PostgreSQL
- Git

## 4. Entidades e relacionamentos

### Category (categories)

| Atributo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| id | UUID | automático | Chave primária |
| name | texto (até 100) | sim | |
| description | texto (até 500) | não | |
| icon | texto (até 100) | não | |
| display_order | inteiro ≥ 0 | não (padrão 0) | Ordem de exibição |
| active | booleano | não (padrão true) | |

### Product (products)

| Atributo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| id | UUID | automático | Chave primária |
| category_id | UUID | sim | Chave estrangeira → `categories.id` |
| title | texto (até 150) | sim | Nome do produto |
| description | texto (até 500) | não | |
| price | decimal(10,2) ≥ 0 | sim | |
| image | texto (até 500) | não | URL da imagem |
| available | booleano | não (padrão true) | Disponível para pedido no momento |
| active | booleano | não (padrão true) | |
| created_at / updated_at | data e hora | automático | |

### Relacionamento

**Category 1 — N Product**: uma categoria possui vários produtos e cada produto pertence a exatamente uma categoria. A chave estrangeira usa `ON DELETE RESTRICT`: não é possível excluir uma categoria que ainda tenha produtos (a API responde `409`).

## 5. Estrutura do projeto

```
src/
├── config/         # Configuração do cliente do Supabase
├── controllers/    # Recebem a requisição HTTP, validam os dados e devolvem a resposta
├── models/         # Classes das entidades (atributos privados, construtor e métodos)
├── repositories/   # Acesso e persistência dos dados no Supabase
├── routes/         # Definição dos endpoints
├── app.ts          # Configuração do Express e das rotas
└── server.ts       # Inicialização do servidor
database/
└── schema.sql      # Script de criação das tabelas
```

Fluxo de uma requisição: **Route → Controller → Model → Repository → Supabase**.

## 6. Configuração e execução

```bash
git clone <url-do-repositorio>
cd restaurant-ordering-system-sjp-b
npm install
cp .env.example .env     # depois edite o .env com suas credenciais
npm run dev
```

A API sobe em `http://localhost:3000`.

## 7. Variáveis de ambiente

| Variável | Descrição |
|---|---|
| SUPABASE_URL | URL do projeto no Supabase |
| SUPABASE_SECRET_KEY | Chave secreta (server-side) do Supabase |

O arquivo `.env` **não** deve ser enviado ao Git (já está no `.gitignore`). Use o `.env.example` como modelo.

## 8. Banco de dados

Execute `database/schema.sql` no **SQL Editor** do Supabase para criar as tabelas `categories` e `products`.

## 9. Endpoints

### Categorias

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /categories | Lista todas as categorias |
| GET | /categories/search/:keyword | Pesquisa categorias por palavra-chave (nome ou descrição) |
| GET | /categories/:id | Consulta uma categoria pelo ID |
| POST | /categories | Cadastra uma categoria |
| PUT | /categories/:id | Atualiza uma categoria |
| DELETE | /categories/:id | Remove uma categoria |

### Produtos

| Método | Endpoint | Descrição |
|---|---|---|
| GET | /products | Lista todos os produtos |
| GET | /products/search/:keyword | Pesquisa produtos por palavra-chave (nome ou descrição) |
| GET | /products/:id | Consulta um produto pelo ID |
| POST | /products | Cadastra um produto |
| PUT | /products/:id | Atualiza um produto (envia todos os campos) |
| DELETE | /products/:id | Remove um produto |

### Códigos de resposta

| Código | Quando |
|---|---|
| 200 | Consulta, atualização ou remoção realizada |
| 201 | Registro criado |
| 400 | Dados inválidos (campo obrigatório ausente ou `category_id` inexistente) |
| 404 | Registro não encontrado |
| 409 | Conflito (ex.: remover categoria que possui produtos) |
| 500 | Erro interno |

Erros retornam JSON no formato `{ "message": "..." }`.

## 10. Exemplos de requisições

**POST /categories**

```json
{
  "name": "Pizzas",
  "description": "Pizzas tradicionais e especiais",
  "icon": "pizza",
  "display_order": 1,
  "active": true
}
```

**PUT /categories/:id**

```json
{
  "name": "Pizzas Salgadas",
  "description": "Pizzas tradicionais e especiais",
  "icon": "pizza",
  "display_order": 2,
  "active": true
}
```

**POST /products**

```json
{
  "category_id": "UUID-DA-CATEGORIA",
  "title": "Pizza Margherita",
  "description": "Molho de tomate, mussarela, tomate e manjericão fresco.",
  "price": 39.9,
  "image": "https://exemplo.com/margherita.jpg",
  "available": true,
  "active": true
}
```

**PUT /products/:id**

```json
{
  "category_id": "UUID-DA-CATEGORIA",
  "title": "Pizza Margherita Grande",
  "description": "Molho de tomate, mussarela, tomate e manjericão fresco.",
  "price": 49.9,
  "available": true,
  "active": true
}
```

**Resposta de erro (exemplo – 400)**

```json
{ "message": "O campo 'name' é obrigatório." }
```
