-- Estrutura do banco (Supabase / PostgreSQL)
-- Execute no SQL Editor do Supabase.
-- ATENÇÃO: se as tabelas já existem com outras colunas, ajuste com ALTER TABLE
-- (ou apague e recrie, caso ainda não tenham dados importantes).

create extension if not exists "pgcrypto";

create table if not exists categories (
    id            uuid primary key default gen_random_uuid(),
    name          varchar(100) not null,
    description   varchar(500),
    icon          varchar(100),
    display_order integer      not null default 0 check (display_order >= 0),
    active        boolean      not null default true,
    created_at    timestamptz  not null default now()
);

create table if not exists products (
    id          uuid primary key default gen_random_uuid(),
    category_id uuid not null references categories(id) on delete restrict,
    title       varchar(150) not null,
    description varchar(500),
    price       numeric(10, 2) not null check (price >= 0),
    image       varchar(500),
    available   boolean      not null default true,
    active      boolean      not null default true,
    created_at  timestamptz  default now(),
    updated_at  timestamptz  default now()
);

create index if not exists idx_products_category_id on products(category_id);
