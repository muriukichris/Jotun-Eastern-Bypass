import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const UserHome = () => {
  const { user, token, logout } = useAuth();
  const categories = ["Interior", "Exterior", "Colorants", "Filler", "Made to order"];
  const madeToOrderSubcategories = ["Interior", "Exterior"];
  const guestCartKey = "guest_cart";
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        const data = await apiFetch("/api/products");
        setProducts(data);
        setStatus("ready");
      } catch (err) {
        setError(err.message || "Failed to load products");
        setStatus("error");
      }
    };
    load();
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(guestCartKey);
    if (!raw) return;
    try {
      const guestCart = JSON.parse(raw);
      if (guestCart && Object.keys(guestCart).length > 0) {
        setCart((prev) => {
          const next = { ...prev };
          Object.values(guestCart).forEach((item) => {
            if (!item?.product?._id) return;
            const id = item.product._id;
            const existing = next[id];
            next[id] = {
              product: item.product,
              quantity: existing ? existing.quantity + item.quantity : item.quantity
            };
          });
          return next;
        });
      }
    } catch (_) {
      // ignore invalid guest cart
    } finally {
      localStorage.removeItem(guestCartKey);
    }
  }, []);

  const refreshOrders = async () => {
    try {
      const data = await apiFetch("/api/orders/mine", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    }
  };

  useEffect(() => {
    if (!token) return undefined;
    refreshOrders();
    const id = setInterval(refreshOrders, 30000);
    return () => clearInterval(id);
  }, [token]);

  const addToCart = (product) => {
    setCart((prev) => {
      const next = { ...prev };
      const existing = next[product._id];
      next[product._id] = {
        product,
        quantity: existing ? existing.quantity + 1 : 1
      };
      return next;
    });
  };

  const updateQty = (productId, quantity) => {
    setCart((prev) => {
      const next = { ...prev };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = { ...next[productId], quantity };
      }
      return next;
    });
  };

  const placeOrder = async () => {
    setError("");
    try {
      const items = Object.values(cart).map((item) => ({
        productId: item.product._id,
        quantity: item.quantity
      }));
      if (items.length === 0) {
        setError("Your cart is empty");
        return;
      }
      await apiFetch("/api/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items })
      });
      setCart({});
      await refreshOrders();
    } catch (err) {
      setError(err.message || "Order failed");
    }
  };

  const total = Object.values(cart).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const filteredProducts = products.filter((product) => {
    const normalizedCategory = product.category === "paint" ? "Interior" : product.category;
    if (!showCategories || !selectedCategory) return true;
    if (selectedCategory === "Made to order") {
      return (
        normalizedCategory === "Made to order" && product.subcategory === selectedSubcategory
      );
    }
    return normalizedCategory === selectedCategory;
  });

  const statusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Received (waiting for admin approval)";
      case "confirmed":
        return "Approved (products confirmed)";
      case "ready":
        return "Ready for pickup";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <div className="page">
      {!selectedCategory && (
        <header className="hero hero-no-image">
          <nav className="hero-nav sticky-nav user-hero-nav">
            <div className="brand">
              <span className="brand-mark" />
              <span className="brand-text">
                <span className="brand-title">Jotun Eastern Bypass Shop</span>
                <span className="brand-welcome">Welcome back, {user?.name || "there"}.</span>
              </span>
            </div>
            <div className="user-nav-actions">
              <button
                className="menu-btn"
                type="button"
                aria-expanded={menuOpen}
                aria-controls="user-nav"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                Menu
              </button>
              <button className="btn ghost tiny nav-signout" type="button" onClick={logout}>
                Sign out
              </button>
            </div>
            <div className={`nav-links nav-links--menu ${menuOpen ? "open" : ""}`} id="user-nav">
              <Link to="/user">Home</Link>
              <a href="#collections">Collections</a>
              <a href="#story">Our Story</a>
            </div>
          </nav>

          <div className="hero-content user-hero-content">
            <div>
              <p className="eyebrow">Premium finishes for modern spaces</p>
              <h1>Color that feels crafted, not manufactured.</h1>
              <p className="lead">
                Explore curated paint collections, delivered with care and backed by a smooth ordering
                experience.
              </p>
              <div className="hero-actions">
                <a
                  className="btn primary"
                  href="#collections"
                  onClick={() => {
                    setShowCategories(true);
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                  }}
                >
                  Browse products
                </a>
                <button className="btn secondary" type="button">
                  Talk to a specialist
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <section id="collections" className="section">
        <div className="section-head">
          <div>
            <h2>Latest collections</h2>
            <p>Hand-picked finishes with durability and depth.</p>
          </div>
          <button className="btn ghost" type="button">
            View catalog
          </button>
        </div>

        {status === "loading" && <div className="status">Loading products...</div>}
        {status === "error" && <div className="form-error">{error}</div>}

        {showCategories && !selectedCategory ? (
          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category}
                className="category-card"
                type="button"
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedSubcategory("");
                }}
              >
                <strong>{category}</strong>
                <span>Browse products</span>
              </button>
            ))}
          </div>
        ) : selectedCategory === "Made to order" && !selectedSubcategory ? (
          <div className="category-grid">
            {madeToOrderSubcategories.map((subcategory) => (
              <button
                key={subcategory}
                className="category-card"
                type="button"
                onClick={() => setSelectedSubcategory(subcategory)}
              >
                <strong>Made to order</strong>
                <span>{subcategory}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            {showCategories && (
              <div className="category-actions">
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedSubcategory("");
                  }}
                >
                  Back to categories
                </button>
                {selectedCategory && (
                  <span className="category-tag">
                    {selectedCategory}
                    {selectedSubcategory ? ` / ${selectedSubcategory}` : ""}
                  </span>
                )}
              </div>
            )}
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product._id} className="product-card">
                  <div className="product-media">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} />
                    ) : (
                      <div className="placeholder" />
                    )}
                  </div>
                  <div className="product-body">
                    <h3>{product.name}</h3>
                    <p>{product.description || "Refined finish with balanced tone and coverage."}</p>
                    <div className="product-meta">
                      <span className="price">Ksh {Number(product.price).toFixed(2)}</span>
                      <button className="btn primary small" onClick={() => addToCart(product)}>
                        Add to cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {showCategories && filteredProducts.length === 0 && (
              <div className="status">No products found in this category yet.</div>
            )}
          </>
        )}
      </section>

      <section className="section alt">
        <div className="section-head">
          <div>
            <h2>Your cart</h2>
            <p>Review items before sending the order for admin approval.</p>
          </div>
        </div>

        <div className="cart-list">
          {Object.values(cart).length === 0 && <div className="status">No items yet.</div>}
          {Object.values(cart).map((item) => (
            <div key={item.product._id} className="cart-row">
              <div>
                <h3>{item.product.name}</h3>
                <p>Ksh {Number(item.product.price).toFixed(2)}</p>
              </div>
              <div className="cart-actions">
                <button
                  className="btn ghost"
                  onClick={() => updateQty(item.product._id, item.quantity - 1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="btn ghost"
                  onClick={() => updateQty(item.product._id, item.quantity + 1)}
                >
                  +
                </button>
                <strong>Ksh {(item.product.price * item.quantity).toFixed(2)}</strong>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <span>Total</span>
            <strong>Ksh {total.toFixed(2)}</strong>
          </div>
          <div className="cart-submit">
            <button className="btn primary" type="button" onClick={placeOrder}>
              Send order
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Order updates</h2>
            <p>Admins will confirm availability and notify you when orders are ready.</p>
          </div>
        </div>
        <div className="order-list">
          {orders.length === 0 && <div className="status">No orders yet.</div>}
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div>
                <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                <p>Status: {statusLabel(order.status)}</p>
                {order.adminNote && <p className="order-note">{order.adminNote}</p>}
              </div>
              <div className="order-meta">
                <span>Total: Ksh {Number(order.total).toFixed(2)}</span>
                <span>Items: {order.items?.length || 0}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="story" className="section alt">
        <div className="story-grid">
          <div>
            <h2>Designed for modern living</h2>
            <p>
              Jotun Eastern Bypass Shop blends craftsmanship with modern efficiency. Every finish is tested for color
              fidelity and resilience so your spaces stay vibrant longer.
            </p>
          </div>
          <ul className="story-list">
            <li>Low-odor, low-VOC formulations</li>
            <li>Professional color matching</li>
            <li>Trusted by designers and builders</li>
          </ul>
        </div>
      </section>

      <section className="section cta-band">
        <div>
          <h2>Need bulk orders or custom palettes?</h2>
          <p>Our advisors help you spec, schedule, and deliver on time.</p>
        </div>
        <button className="btn primary">Schedule consultation</button>
      </section>

      <footer className="footer">
        <span>&copy; 2026 Jotun Eastern Bypass Shop. All rights reserved.</span>
        <span>Crafted for color-forward homes.</span>
      </footer>
    </div>
  );
};

export default UserHome;

