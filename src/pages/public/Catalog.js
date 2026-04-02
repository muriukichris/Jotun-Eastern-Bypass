import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

const categories = ["Interior", "Exterior", "Colorants", "Filler", "Made to order"];
const madeToOrderSubcategories = ["Interior", "Exterior"];
const cartKey = "guest_cart";

const Catalog = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(
    searchParams.get("subcategory") || ""
  );

  useEffect(() => {
    const raw = localStorage.getItem(cartKey);
    if (raw) {
      try {
        setCart(JSON.parse(raw));
      } catch (_) {
        localStorage.removeItem(cartKey);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart]);

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
    const next = {};
    if (selectedCategory) next.category = selectedCategory;
    if (selectedSubcategory) next.subcategory = selectedSubcategory;
    setSearchParams(next);
  }, [selectedCategory, selectedSubcategory, setSearchParams]);

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

  const total = useMemo(
    () =>
      Object.values(cart).reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      ),
    [cart]
  );

  const filteredProducts = products.filter((product) => {
    const normalizedCategory = product.category === "paint" ? "Interior" : product.category;
    if (!selectedCategory) return true;
    if (selectedCategory === "Made to order") {
      return (
        normalizedCategory === "Made to order" && product.subcategory === selectedSubcategory
      );
    }
    return normalizedCategory === selectedCategory;
  });

  const placeOrder = async () => {
    setError("");
    if (!user || !token) {
      setError("Please log in to send your order.");
      navigate("/login");
      return;
    }
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
      localStorage.removeItem(cartKey);
    } catch (err) {
      setError(err.message || "Order failed");
    }
  };

  return (
    <div className="page">
      {!selectedCategory && (
        <header className="hero hero-no-image">
          <nav className="hero-nav sticky-nav">
            <div className="brand">
              <span className="brand-mark" />
              <span className="brand-text">
                <span className="brand-title">Jotun Eastern Bypass Shop</span>
                <span className="brand-welcome">Our Products</span>
              </span>
            </div>
            <button
              className="menu-btn"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="catalog-nav"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              Menu
            </button>
            <div className={`nav-links nav-links--menu ${menuOpen ? "open" : ""}`} id="catalog-nav">
              <Link to="/">Home</Link>
              <Link to="/catalog">Catalog</Link>
            </div>
          </nav>

          <div className="hero-content">
            <div>
              <p className="eyebrow">Pick a category, then explore the products inside.</p>
              <h1>Browse by category</h1>
              <p className="lead">
                Add items to your cart freely. You will only need to log in when you are ready to send
                the order.
              </p>
              <div className="hero-actions">
                <a className="btn primary" href="#collections">
                  View categories
                </a>
              </div>
            </div>
          </div>
        </header>
      )}

      <section id="collections" className="section">
        <div className="section-head">
          <div>
            <h2>Our Products</h2>
            <p>Select a category to view the products.</p>
          </div>
        </div>

        {status === "loading" && <div className="status">Loading products...</div>}
        {status === "error" && <div className="form-error">{error}</div>}

        {!selectedCategory ? (
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
              <span className="category-tag">
                {selectedCategory}
                {selectedSubcategory ? ` / ${selectedSubcategory}` : ""}
              </span>
            </div>
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
            {filteredProducts.length === 0 && (
              <div className="status">No products found in this category yet.</div>
            )}
          </>
        )}
      </section>

      <section className="section alt">
        <div className="section-head">
          <div>
            <h2>Your cart</h2>
            <p>Add products freely. Log in only when you are ready to send the order.</p>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

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
            {!user && (
              <div className="status">You will be asked to log in before sending the order.</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Catalog;
