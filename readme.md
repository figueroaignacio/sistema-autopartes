```sql
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

https://git-scm.com/
https://code.visualstudio.com/
https://www.pgadmin.org/download/pgadmin-4-windows/
https://nodejs.org/es

```bash
git clone https://github.com/figueroaignacio/sistema-autopartes.git
npm i -g pnpm
```
