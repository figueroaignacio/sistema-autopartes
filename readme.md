## Parte tecnica

```sql
-- Crear la base de datos
CREATE DATABASE autopartes;

-- Crear la tabla de productos
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    stock INT NOT NULL CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla de productos vendidos
CREATE TABLE sold_products (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    sale_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_product_id ON sold_products(product_id);

-- Datos de ejemplo para products
INSERT INTO products (code, name, price, description, stock) VALUES
('A001', 'Filtro de aceite', 15.99, 'Filtro de aceite de alta calidad', 50),
('A002', 'Batería 12V', 120.50, 'Batería de automóvil de 12V', 20),
('A003', 'Pastillas de freno', 35.00, 'Juego de pastillas de freno', 30);

-- Datos de ejemplo para sold_products
INSERT INTO sold_products (product_id, quantity, sale_date) VALUES
(1, 3, '2023-08-01'),
(2, 1, '2023-08-15'),
(3, 5, '2023-08-20');
```

## Parte TeoricaPasos para levantar el proyecto

- 1: Prender la compu
- 2: Abrir Visual Estudio Code desde la barra de tareas, es el icono que esta al lado derecho de Edge.
- 3: Cuando abras el visual studio, apreta ctrl + ñ para abrir la terminal y pones pnpm dev.
- 4: De ahí, vas a ver los servidores tanto del client como del server, en este caso es solo abrir el client que esta en localhost:5173 (no hace falta que le pongas el http://)
- 5: De ahí, abris el navegador en este caso Edge, y pones la direccion del servidor del client que es el localhost:5173 en la url de del navegador para levantar el servidor y poder ver la aplicacion.
- 6: Para abrir la base de datos, apretas el elefante ese que esta al lado del visual studio code y esperas a que carguel, de ahi lo que practicamos. Apretas las flechitas desde Servers -> Databases -> autopartes -> Schemas -> Tables (ahí adentro te van a aparecer las tablas products y sold_products).
- 7: Para ver las tablas haces click derecho en cualquiera de las tablas, te va a aparecer el menu y de ahi apretas View/Edit data para ver los campos y los datos de la tabla en concreto.

La base de datos autopartes gestiona los productos y sus ventas con validaciones de integridad (CHECK, FOREIGN KEY), optimización mediante índices, y permite el seguimiento de las transacciones realizadas.

Creación de la base de datos:

Tablas principales:

products (Productos): Almacena la información de las autopartes disponibles.

Campos principales: tabla de products
id: Identificador único (clave primaria, SERIAL).
code: Código del producto (único, no nulo).
name: Nombre del producto (no nulo).
price: Precio (decimal con dos decimales, no nulo).
description: Descripción detallada (no nulo).
stock: Cantidad disponible (no negativo, validado con CHECK).
created_at: Fecha de creación (valor por defecto: CURRENT_TIMESTAMP).
sold_products (Productos vendidos): Registra las ventas de los productos.

Campos principales: tabla de productos vendidos
id: Identificador único (clave primaria, SERIAL).
product_id: Referencia al id de la tabla products (clave foránea con ON DELETE CASCADE para eliminar ventas si se elimina el producto).
quantity: Cantidad vendida (debe ser mayor a 0).
sale_date: Fecha de la venta (no nulo).
created_at: Fecha de registro de la venta (valor por defecto: CURRENT_TIMESTAMP).
Índices:

Se crea un índice (idx_product_id) en sold_products para mejorar la búsqueda por product_id.
Integridad referencial:

Clave foránea: product_id en la tabla productos vendidos está relacionado con id de la tabla products.
ON DELETE CASCADE: Si se elimina un producto, se eliminan automáticamente sus registros de venta.
