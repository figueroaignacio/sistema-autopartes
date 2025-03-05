const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 7777;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "autopartes",
  password: "ultrajadomacradisimo",
  port: 5432,
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
  })
);

// Obtener todos los productos
app.get("/api/products", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear un producto
app.post("/api/products", async (req, res) => {
  const { code, name, price, description, stock } = req.body;
  if (!code || !name || !price || !description || stock == null) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO products (code, name, price, description, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [code, name, price, description, stock]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un producto
app.put("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const { code, name, price, description, stock } = req.body;
  if (!code || !name || !price || !description || stock == null) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE products SET code = $1, name = $2, price = $3, description = $4, stock = $5 WHERE id = $6 RETURNING *",
      [code, name, price, description, stock, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un producto
app.delete("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los productos vendidos
app.get("/api/sold-products", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT sp.*, p.name AS product_name
      FROM sold_products sp
      JOIN products p ON sp.product_id = p.id
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/sold-products", async (req, res) => {
  const { product_id, quantity, sale_date } = req.body;

  if (!product_id || !quantity || !sale_date) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO sold_products (product_id, quantity, sale_date) VALUES ($1, $2, $3) RETURNING *",
      [product_id, quantity, sale_date]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error al guardar el producto vendido:", err);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar un producto vendido
app.put("/api/sold-products/:id", async (req, res) => {
  const { id } = req.params;
  const { product_id, quantity, sale_date } = req.body;
  if (!product_id || !quantity || !sale_date) {
    return res.status(400).json({ error: "Todos los campos son requeridos" });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE sold_products SET product_id = $1, quantity = $2, sale_date = $3 WHERE id = $4 RETURNING *",
      [product_id, quantity, sale_date, id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar un producto vendido
app.delete("/api/sold-products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM sold_products WHERE id = $1", [id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Backend corriendo en http://localhost:${port}`);
});
