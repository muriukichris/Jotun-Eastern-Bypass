import { useEffect, useState } from "react";
import { apiFetch, API_BASE } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, token, logout } = useAuth();
  const categories = ["Interior", "Exterior", "Colorants", "Filler", "Made to order"];
  const madeToOrderSubcategories = ["Interior", "Exterior"];
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [orderNotes, setOrderNotes] = useState({});
  const [productTab, setProductTab] = useState("list");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "Interior",
    subcategory: ""
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const authHeaders = { Authorization: `Bearer ${token}` };

  const load = async () => {
    try {
      const [productData, orderData, userData, analyticsData] = await Promise.all([
        apiFetch("/api/products"),
        apiFetch("/api/orders/admin/all", { headers: authHeaders }),
        apiFetch("/api/admin/users", { headers: authHeaders }),
        apiFetch("/api/admin/analytics", { headers: authHeaders })
      ]);
      setProducts(productData);
      setOrders(orderData);
      setUsers(userData);
      setStats(analyticsData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "category" && value !== "Made to order") {
      setForm({ ...form, category: value, subcategory: "" });
      return;
    }
    setForm({ ...form, [name]: value });
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await apiFetch("/api/products", {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          ...form,
          price: Number(form.price)
        })
      });
      setForm({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: "Interior",
        subcategory: ""
      });
      await load();
    } catch (err) {
      setError(err.message || "Failed to add product");
    } finally {
      setBusy(false);
    }
  };

  const uploadImage = async (file) => {
    setUploadError("");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_BASE}/api/uploads`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id) => {
    setError("");
    try {
      await apiFetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: authHeaders
      });
      await load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  const updateOrderStatus = async (id, status) => {
    setError("");
    try {
      await apiFetch(`/api/orders/admin/${id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ status, adminNote: orderNotes[id] || "" })
      });
      await load();
    } catch (err) {
      setError(err.message || "Update failed");
    }
  };

  const updateUser = async (id, payload) => {
    setError("");
    try {
      await apiFetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify(payload)
      });
      await load();
    } catch (err) {
      setError(err.message || "User update failed");
    }
  };

  const daily = stats?.daily || [];
  const maxRevenue = daily.reduce((max, item) => Math.max(max, item.revenue || 0), 1);
  const maxOrders = daily.reduce((max, item) => Math.max(max, item.orders || 0), 1);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <button className="btn ghost" onClick={logout}>
          Sign out
        </button>
      </header>

      {error && <div className="form-error">{error}</div>}

      <section className="admin-section">
        <h2>Analytics</h2>
        <div className="admin-metrics">
          <div className="metric-card">
            <span>Total revenue</span>
            <strong>Ksh {Number(stats?.totalRevenue || 0).toFixed(2)}</strong>
            <small>Last 7 days: Ksh {Number(stats?.last7Days?.revenue || 0).toFixed(2)}</small>
          </div>
          <div className="metric-card">
            <span>Orders</span>
            <strong>{stats?.ordersCount || 0}</strong>
            <small>Last 7 days: {stats?.last7Days?.orders || 0}</small>
          </div>
          <div className="metric-card">
            <span>Products</span>
            <strong>{stats?.productsCount || 0}</strong>
            <small>Paint catalog items</small>
          </div>
          <div className="metric-card">
            <span>Users</span>
            <strong>{stats?.usersCount || 0}</strong>
            <small>Registered accounts</small>
          </div>
        </div>

      </section>

      <section className="admin-section">
        <h2>Orders</h2>
        {orders.filter((order) => order.status !== "completed").length === 0 ? (
          <div className="status">No open orders at the moment.</div>
        ) : (
          <div className="admin-grid">
            {orders
              .filter((order) => order.status !== "completed")
              .map((order) => (
              <div key={order._id} className="admin-card">
              <div>
                <h3>{order.user?.name || "User"}</h3>
                <p>Status: {order.status}</p>
                <p>Total: Ksh {Number(order.total).toFixed(2)}</p>
                <ul className="order-items">
                  {order.items?.map((item, index) => (
                    <li key={`${order._id}-${item.product?._id || index}`}>
                      {item.product?.name || "Product"} x {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="status-actions">
                <input
                  className="note-input"
                  placeholder="Admin note"
                  value={orderNotes[order._id] || ""}
                  onChange={(e) =>
                    setOrderNotes((prev) => ({ ...prev, [order._id]: e.target.value }))
                  }
                />
                <button className="btn ghost" onClick={() => updateOrderStatus(order._id, "confirmed")}>
                  Confirm
                </button>
                <button className="btn ghost" onClick={() => updateOrderStatus(order._id, "ready")}>
                  Ready
                </button>
                <button className="btn ghost" onClick={() => updateOrderStatus(order._id, "completed")}>
                  Completed
                </button>
                <button className="btn ghost" onClick={() => updateOrderStatus(order._id, "cancelled")}>
                  Cancel
                </button>
              </div>
            </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Products</h2>
        <div className="admin-tabs">
          <button
            className={`tab-btn ${productTab === "list" ? "active" : ""}`}
            onClick={() => setProductTab("list")}
          >
            Product list
          </button>
          <button
            className={`tab-btn ${productTab === "add" ? "active" : ""}`}
            onClick={() => setProductTab("add")}
          >
            Add product
          </button>
        </div>

        {productTab === "add" ? (
          <>
            <p className="admin-hint">Assign each product to a category for easy browsing.</p>
            <form className="admin-form" onSubmit={addProduct}>
              <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
              <label>
                Category
                <select name="category" value={form.category} onChange={onChange} required>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              {form.category === "Made to order" && (
                <label>
                  Subcategory
                  <select name="subcategory" value={form.subcategory} onChange={onChange} required>
                    <option value="" disabled>
                      Select a subcategory
                    </option>
                    {madeToOrderSubcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <input
                name="price"
                placeholder="Price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={onChange}
                required
              />
              <label className="file-field">
                Upload image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
                />
              </label>
              <input
                name="imageUrl"
                placeholder="Image URL (optional)"
                value={form.imageUrl}
                onChange={onChange}
              />
              <small className="status">
                Example: /products/interior/sample-interior.svg (public/products/&lt;category&gt;/...)
              </small>
              {uploading && <div className="status">Uploading image...</div>}
              {uploadError && <div className="form-error">{uploadError}</div>}
              <textarea
                name="description"
                placeholder="Description"
                rows="3"
                value={form.description}
                onChange={onChange}
              />
              <button className="btn primary" type="submit" disabled={busy}>
                {busy ? "Saving..." : "Add product"}
              </button>
            </form>
          </>
        ) : (
          <div className="admin-grid">
            {products.map((product) => (
              <div key={product._id} className="admin-card">
                <div>
                  <h3>{product.name}</h3>
                  <p>Ksh {Number(product.price).toFixed(2)}</p>
                  <p>
                    {product.category || "Interior"}
                    {product.subcategory ? ` / ${product.subcategory}` : ""}
                  </p>
                </div>
                <button className="btn ghost" onClick={() => deleteProduct(product._id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="admin-section">
        <h2>Performance</h2>
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Revenue (last 7 days)</h3>
            <div className="bar-chart">
              {daily.map((item) => (
                <div key={item.date} className="bar-col">
                  <div
                    className="bar-fill"
                    style={{
                      height: `${Math.max(8, (item.revenue / maxRevenue) * 100)}%`
                    }}
                  />
                  <span>{item.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>Orders (last 7 days)</h3>
            <div className="bar-chart">
              {daily.map((item) => (
                <div key={item.date} className="bar-col">
                  <div
                    className="bar-fill alt"
                    style={{
                      height: `${Math.max(8, (item.orders / maxOrders) * 100)}%`
                    }}
                  />
                  <span>{item.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <h2>Users</h2>
        <div className="admin-table">
          {users.map((item) => (
            <div key={item._id} className="admin-row">
              <div>
                <h3>{item.name}</h3>
                <p>{item.email}</p>
              </div>
              <div className="row-actions">
                <select
                  value={item.role}
                  onChange={(e) => updateUser(item._id, { role: e.target.value })}
                  disabled={item._id === user?.id}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  className="btn ghost"
                  onClick={() => updateUser(item._id, { isActive: !item.isActive })}
                  disabled={item._id === user?.id}
                >
                  {item.isActive ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
