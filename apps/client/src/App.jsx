import { useEffect, useState } from "react";
import styles from "./App.module.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    price: "",
    description: "",
    stock: "",
  });

  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:7777/api/products");
    const data = await res.json();
    setProducts(data);
  };

  const fetchSoldProducts = async () => {
    const res = await fetch("http://localhost:7777/api/sold-products");
    const data = await res.json();
    setSoldProducts(data);
  };

  const saveProduct = async () => {
    if (Object.values(newProduct).some((val) => !val)) {
      return alert("Completa todos los campos del producto");
    }

    if (editProduct) {
      await fetch(`http://localhost:7777/api/products/${editProduct.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      setEditProduct(null);
    } else {
      await fetch("http://localhost:7777/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
    }

    setNewProduct({
      code: "",
      name: "",
      price: "",
      description: "",
      stock: "",
    });
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await fetch(`http://localhost:7777/api/products/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  const deleteSoldProduct = async (id) => {
    await fetch(`http://localhost:7777/api/sold-products/${id}`, {
      method: "DELETE",
    });
    fetchSoldProducts();
  };

  // Nueva función para marcar un producto como vendido
  const markAsSold = async (product) => {
    const quantity = prompt("Ingrese la cantidad vendida:", "1");
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      return alert("Ingrese una cantidad válida");
    }

    const soldProduct = {
      product_id: product.id,
      quantity: quantity,
      sale_date: new Date().toISOString().split("T")[0],
    };

    const res = await fetch("http://localhost:7777/api/sold-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(soldProduct),
    });

    const data = await res.json();
    console.log("Producto vendido guardado:", data); // ✅ Agregado para depuración

    if (!res.ok) {
      return alert("Error al marcar como vendido");
    }

    // Actualizar stock
    const updatedProduct = {
      ...product,
      stock: parseInt(product.stock) - parseInt(quantity),
    };

    await fetch(`http://localhost:7777/api/products/${product.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    });

    fetchProducts();
    fetchSoldProducts();
  };

  useEffect(() => {
    fetchProducts();
    fetchSoldProducts();
  }, []);

  // Función para formatear moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const totalSales = soldProducts.reduce((acc, sold) => {
    const product = products.find((p) => p.id === sold.product_id);
    return acc + (product ? product.price * sold.quantity : 0);
  }, 0);

  const totalProductsInStock = products.reduce(
    (acc, product) => acc + parseInt(product.stock),
    0
  );

  const totalUnitsSold = soldProducts.reduce(
    (acc, sold) => acc + parseInt(sold.quantity),
    0
  );

  const lastSaleDate = soldProducts.length
    ? formatDate(soldProducts[soldProducts.length - 1].sale_date)
    : "N/A";

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Autopartes</h1>

      <div className={styles.summaryContainer}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total de Ingresos</div>
          <div className={`${styles.summaryValue} ${styles.salesValue}`}>
            {formatCurrency(totalSales)}
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Productos en Inventario</div>
          <div className={`${styles.summaryValue} ${styles.stockValue}`}>
            {totalProductsInStock}
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Unidades Vendidas</div>
          <div className={`${styles.summaryValue} ${styles.unitsValue}`}>
            {totalUnitsSold}
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Última Venta</div>
          <div className={`${styles.summaryValue} ${styles.dateValue}`}>
            {lastSaleDate}
          </div>
        </div>
      </div>
      <div className={styles.inputGroup}>
        <h2>Agregar Producto</h2>
        {Object.keys(newProduct).map((key) => (
          <input
            key={key}
            className={styles.input}
            value={newProduct[key]}
            onChange={(e) =>
              setNewProduct({ ...newProduct, [key]: e.target.value })
            }
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
          />
        ))}
        <button className={styles.button} onClick={saveProduct}>
          {editProduct ? "Actualizar" : "Crear"}
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <h2>Productos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.code}</td>
                <td>{product.name}</td>
                <td>{formatCurrency(product.price)}</td>
                <td>{product.description}</td>
                <td>{product.stock}</td>
                <td>
                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteProduct(product.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className={styles.sellButton}
                      onClick={() => markAsSold(product)}
                      disabled={parseInt(product.stock) <= 0}
                    >
                      Marcar como vendido
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.tableWrapper}>
        <h2>Productos Vendidos</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto ID</th>
              <th>Nombre del Producto</th>
              <th>Cantidad</th>
              <th>Fecha de Venta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {soldProducts.map((sold) => (
              <tr key={sold.id}>
                <td>{sold.id}</td>
                <td>{sold.product_id}</td>
                <td>{sold.product_name}</td>
                <td>{sold.quantity}</td>
                <td>{formatDate(sold.sale_date)}</td>
                <td>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteSoldProduct(sold.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
