import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import interiorPaints from "../../assets/interior-paints.svg";
import exteriorPaints from "../../assets/exterior-paints.svg";
import colorantsPaints from "../../assets/colorants.svg";
import madeToOrderPaints from "../../assets/made-to-order.svg";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredStories = useMemo(() => {
    const stories = [
      {
        name: "Leila M.",
        role: "Boutique owner",
        location: "Nairobi",
        story:
          "When I opened my first shop, I was terrified the color would flatten in the afternoon light. The team mapped the light in my space, mixed a custom batch, and the walls now glow from morning to close.",
        highlight: "Custom light-matched blend"
      },
      {
        name: "Joshua K.",
        role: "Residential architect",
        location: "Ruiru",
        story:
          "My client wanted calm without cold. We landed on a layered palette that shifts with the weather, and the finish still looks freshly rolled after a rainy season and a long, hot January.",
        highlight: "Weather-resilient finish"
      },
      {
        name: "Miriam A.",
        role: "Cafe founder",
        location: "Karen",
        story:
          "We painted overnight before our launch. The delivery was on time, the odor was barely there, and the color made our tiny space feel twice as warm. Customers ask about the paint weekly.",
        highlight: "Low-odor launch turnaround"
      },
      {
        name: "Daniel O.",
        role: "Interior stylist",
        location: "Westlands",
        story:
          "A client needed bold color with an easy refresh cycle. The pigments stayed true after months of sun, and the finish cleaned up without losing its texture.",
        highlight: "Color fidelity under sun"
      },
      {
        name: "Nora P.",
        role: "Homeowner",
        location: "Kiambu",
        story:
          "We finally tackled the kids' rooms. The matte finish hides fingerprints, and the mood in the house changed overnight. It feels calmer, not dull.",
        highlight: "Family-proof matte"
      },
      {
        name: "Tariq S.",
        role: "Project manager",
        location: "Thika",
        story:
          "Our contractor promised a fast handover. The coating system held up to tight timelines and still passed our quality walk without touch-ups.",
        highlight: "Fast handover reliability"
      }
    ];

    const shuffled = [...stories];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }, []);
  return (
    <div className="page landing-page">
      <header className="hero landing-hero">
        <nav className="hero-nav sticky-nav">
          <div className="brand">
            <span className="brand-mark" />
            Jotun Eastern Bypass Shop
          </div>
          <button
            className="menu-btn"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="landing-nav"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            Menu
          </button>
          <div className={`nav-links nav-links--menu ${menuOpen ? "open" : ""}`} id="landing-nav">
            <a href="#collections">Collections</a>
            <a href="#story">Our Story</a>
            <a href="#stories">Our Stories</a>
            <Link to="/account" className="btn ghost">
              Go to my account
            </Link>
          </div>
        </nav>

        <div className="hero-content">
          <div>
            <p className="eyebrow">Premium finishes for modern spaces</p>
            <h1>Color that feels crafted, not manufactured.</h1>
            <p className="lead">
              Explore curated paint collections, delivered with care and backed by a smooth ordering
              experience.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href="#collections">
                Browse products
              </a>
              <Link className="btn secondary" to="/register">
                Create account
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section id="collections" className="section">
        <div className="section-head">
          <div>
            <h2>Our Products</h2>
            <p>Browse by category to find the right finish for every space.</p>
          </div>
        </div>

        <div className="product-grid product-grid--categories">
          {[
            { name: "Interior", note: "Durable finishes for living spaces.", image: interiorPaints },
            { name: "Exterior", note: "Weather-ready protection.", image: exteriorPaints },
            {
              name: "Colorants",
              note: "Custom tints and pigment blends.",
              image: colorantsPaints
            },
            {
              name: "Made to order",
              note: "Special requests on demand.",
              image: madeToOrderPaints
            },
            {
              name: "Filler",
              note: "Surface preparation and crack repair solutions.",
              image: null
            }
          ].map((category) => (
            <article key={category.name} className="product-card">
              <div className="product-media">
                {category.image ? (
                  <img src={category.image} alt={`${category.name} paints`} />
                ) : (
                  <div className="placeholder" />
                )}
              </div>
              <div className="product-body">
                <h3>{category.name}</h3>
                <p>{category.note}</p>
                <div className="product-meta">
                  <span className="price">Category</span>
                  <Link
                    className="btn primary small"
                    to={`/catalog?category=${encodeURIComponent(category.name)}`}
                  >
                    View
                  </Link>
                </div>
              </div>
            </article>
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

      <section id="stories" className="section stories">
        <div className="section-head">
          <div>
            <h2>Our stories</h2>
            <p>Three voices, three spaces, one shared obsession with color that lasts.</p>
          </div>
          <span className="stories-note">Rotates on each visit</span>
        </div>

        <div className="stories-grid">
          {featuredStories.map((story) => (
            <article key={story.name} className="story-card">
              <div className="story-card-header">
                <div>
                  <h3>{story.name}</h3>
                  <p>
                    {story.role} • {story.location}
                  </p>
                </div>
                <span className="story-tag">{story.highlight}</span>
              </div>
              <p className="story-text">{story.story}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section cta-band">
        <div>
          <h2>Ready to manage your projects?</h2>
          <p>Sign in to access your account and order history.</p>
        </div>
      </section>

      <footer className="footer">
        <span>&copy; 2026 Jotun Eastern Bypass Shop. All rights reserved.</span>
        <span>Crafted for color-forward homes.</span>
      </footer>
    </div>
  );
};

export default Landing;
