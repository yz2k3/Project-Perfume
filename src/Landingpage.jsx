import { useState, useEffect } from 'react'
import { PRODUCTS, GMAIL, STATS, HIRE_ROLES, NAV_LINKS } from './constants'
import './Landingpage.css'
import hvit from './assets/hvit.jpg'

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const CART_KEY = 'ecommerce-cart'

export default function Landingpage({ onGoToCheckout }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])
  const [visible, setVisible] = useState(false)
  const [addedId, setAddedId] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  function addToCart(product) {
    setCart(prev => [...prev, product])
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  return (
    <div className="page">
      <nav className="nav">
        <div className="nav-logo"
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMenuOpen(false); }} >
          Maison Yanis
        </div>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <span className="nav-link" onClick={() => { scrollTo('collection'); setMenuOpen(false); }}>Collection</span>
          <span className="nav-link" onClick={() => { scrollTo('story'); setMenuOpen(false); }}>About</span>
          <a className="nav-link" href={`mailto:${GMAIL}`} onClick={() => setMenuOpen(false)}>Contact</a>
        </div>

        <div className="nav-right">
          <span className="nav-link nav-cart" onClick={() => { onGoToCheckout(); setMenuOpen(false); }}> Cart
            {cart.length > 0 && <span className="cart-pill">{cart.length}</span>}
          </span>
          
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>


      <section className="hero">
        <div className={`fade-up ${visible ? 'in' : ''}`} style={{ transitionDelay: '0.1s' }}>
          <p className="eyebrow hero__eyebrow">New Collection — 2026</p>
          <h1 className="hero__headline">
            Scent the<br />
            <em>Nordic</em><br />
            silence
          </h1>
          <p className="hero__body">
            Nine fragrances inspired by the Nordic landscape.
            Crafted from natural ingredients, made to be worn — not just noticed.
          </p>
          <div className="hero__actions">
            <button className="btn-primary" onClick={() => scrollTo('collection')}>Shop Collection</button>
            <button className="btn-outline" onClick={() => scrollTo('story')}>Our Story</button>
          </div>
        </div>

        <div className={`fade-up ${visible ? 'in' : ''}`} style={{ transitionDelay: '0.3s' }}>
          <div className="">
            <img src={hvit} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Hvit Perfume" />
          </div>
        </div>


      </section>
      <div className="divider" />

      <section id="collection" className="collection">
        <div className={`fade-up ${visible ? 'in' : ''} collection__header`} style={{ transitionDelay: '0.4s' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 12 }}>Eau de Parfum</p>
            <h2 className="section-title">Our Collection</h2>
          </div>
          <span className="nav-link nav-link--underline">View All →</span>
        </div>

        <div className="collection__grid">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              className={`product-card fade-up ${visible ? 'in' : ''}`} style={{ transitionDelay: '0.2s' }}
            >

              <div className="product-card__image" style={{ background: p.bg }}>
                <img src={p.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.name} />
                {p.tag && <span className="tag-badge">{p.tag}</span>}
              </div>

              <div className="product-card__body">
                <p className="product-card__category">{p.category}</p>
                <div className="product-card__row">
                  <span className="product-card__name">{p.name}</span>
                  <span className="product-card__price">${p.price}</span>
                </div>
                <p className="product-card__scent">{p.scent}</p>
              </div>

              <button
                className={`card-add-btn ${addedId === p.id ? 'card-add-btn--added' : ''}`}
                onClick={() => addToCart(p)}
              >
                {addedId === p.id ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>

      </section>
      <div className="divider" />

      <section className="stats">
        {STATS.map(item => (
          <div key={item.num} className="stats__item">
            <p className="stats__number">{item.num}</p>
            <p className="stats__label">{item.label}</p>
          </div>
        ))}
      </section>
      <div className="divider" />

      <section id="story" className="story">

        <div>
          <p className="eyebrow story__eyebrow">Our Story</p>
          <blockquote className="story__quote">
            "Maison Yanis was born from a simple belief — that fragrance should feel like a memory."
          </blockquote>
        </div>

        <div>
          <p className="story__body">
            Each scent is crafted from natural ingredients, inspired by the Nordic landscape —
            pine forests, frozen coastlines, rain on birch bark. No noise, no excess.
            Just the quiet beauty of the everyday.
          </p>
          <p className="story__body story__body--last">
            We work with small-batch distilleries in Norway and Sweden, using only sustainably
            sourced botanicals. Every bottle is made to be lived with — not just owned.
          </p>
          <button className="btn-outline" onClick={() => scrollTo('collection')}>Explore the Collection</button>
        </div>

      </section>
      <div className="divider" />

      <section id="hire" className="hire">

        <div>
          <p className="eyebrow eyebrow--sand hire__eyebrow">Available for work</p>
          <h2 className="hire__headline">
            Let's build<br />
            something<br />
            <em>together</em>
          </h2>
          <p className="hire__body">
            I'm a frontend developer passionate about clean UI and purposeful design.
            Open to full-time roles, internships, and freelance projects.
          </p>
        </div>

        <div className="hire__right">

          <div className="hire-card">
            <p className="hire-card__label">Get in touch</p>
            <p className="hire-card__heading">Drop me an email and let's talk.</p>
            <a className="btn-sand" href={`mailto:${GMAIL}`}>{GMAIL} →</a>
          </div>

          <div className="hire__roles-grid">
            {HIRE_ROLES.map(item => (
              <div key={item.role} className="hire__role-card">
                <p className="hire__role-label">{item.role}</p>
                <p className="hire__role-detail">{item.detail}</p>
              </div>
            ))}
          </div>

        </div>

      </section>

      <footer className="footer">
        <span className="footer__logo">Maison Yanis</span>
        <div className="footer__links">
          {NAV_LINKS.map(l => (
            <span key={l} className="nav-link">{l}</span>
          ))}
        </div>
        <span className="footer__copy">© 2026 Maison Yanis Fragrance</span>
        <p className="footer__note">This project is non-commercial. All images are used for learning purposes only.</p>
      </footer>
    </div>
  )




}


