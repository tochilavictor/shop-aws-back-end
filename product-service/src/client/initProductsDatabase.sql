create extension if not exists "uuid-ossp"

create table products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price integer
)

create table stocks (
    product_id uuid,
    foreign key ("product_id") references "products" ("id"),
    count integer
)

insert into products (title, description, price) values
    ('Billy', 'Billy Herrington t-shirt', 300),
    ('Ricardo', 'Ricardo Millos t-shirt', 300),
    ('Van', 'Van Darkholme t-shirt', 300),
    ('Giga', 'Gigashad t-shirt', 999),
    ('Barbie', 'Ryan Gosling Barbie t-shirt', 20),
    ('Blade Runner', 'Ryan Gosling Blade Runner t-shirt', 20)

insert into stocks (product_id, count) values
    ('b5541fdf-1d6e-4f20-82b8-fc9e9660217e', 17),
    ('ec297666-f5b3-464c-a944-dd98aac4cc6f', 99),
    ('6ca6bfad-712a-47cd-a4cc-ef490a794804', 99),
    ('7d0eb803-16f5-46af-ab81-dcaf59c138eb', 1000),
    ('08b32796-7cd4-4350-82f9-e3d87b408e8c', 1),
    ('56124e29-9b93-4993-a882-d68bbd5866b4', 50)
