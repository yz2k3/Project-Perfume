import { useState } from 'react'
import { GMAIL, NAV_LINKS } from './constants'
import './Checkout.css'

const TAX_RATE = 0.085
const CART_KEY = 'ecommerce-cart'

// ─── card number formatter: "1234 5678 9012 3456" ────────────────────────────
function formatCard(val) {
    return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
// ─── expiry formatter: "MM / YY" ─────────────────────────────────────────────
function formatExpiry(val) {
    const digits = val.replace(/\D/g, '').slice(0, 4)
    return digits.length >= 3 ? digits.slice(0, 2) + ' / ' + digits.slice(2) : digits
}

// ─── load cart and group duplicates into lines: [{ product, qty }] ───────────
function loadLines() {
    try {
        const raw = localStorage.getItem(CART_KEY)
        const items = raw ? JSON.parse(raw) : []
        const map = {}
        items.forEach(item => {
            if (map[item.id]) map[item.id].qty += 1
            else map[item.id] = { product: item, qty: 1 }
        })
        return Object.values(map)
    } catch {
        return []
    }
}
function saveLines(lines) {
    const flat = lines.flatMap(({ product, qty }) =>
        Array.from({ length: qty }, () => product)
    )
    localStorage.setItem(CART_KEY, JSON.stringify(flat))
}

export default function Checkout({ onBackToSite }) {
    const [lines, setLines] = useState(loadLines)
    const [step, setStep] = useState('information') // information | shipping | payment | complete  
    const [form, setForm] = useState({
        email: '', emailOffers: false,
        firstName: '', lastName: '',
        address: '', apartment: '',
        city: '', zip: '',
        country: 'United States', phone: '',
    })
    const [pay, setPay] = useState({
        cardNumber: '', expiry: '', cvv: '', nameOnCard: '',
    })

    const [cardError, setCardError] = useState('')

    const subtotal = lines.reduceRight((s, { product, qty }) => s + product.price * qty, 0)
    const tax = +(subtotal * TAX_RATE).toFixed(2)
    const total = + (subtotal + tax).toFixed(2)
    const totalQty = lines.reduce((s, l) => s + l.qty, 0)

    function changeQty(id, delta) {
        setLines(prev => {
            const next = prev
                .map(l => l.product.id === id ? { ...l, qty: l.qty + delta } : l)
                .filter(l => l.qty > 0)
            saveLines(next)
            return next
        })
    }
    function handleForm(e) {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    function handlePay(e) {
        const { name, value } = e.target
        let v = value
        if (name === 'cardNumber') v = formatCard(value)
        if (name === 'expiry') v = formatExpiry(value)
        if (name === 'cvv') v = value.replace(/\D/g, '').slice(0, 4)
        setPay(prev => ({ ...prev, [name]: v }))
        setCardError('')
    }

    function handleInfoSubmit(e) {
        e.preventDefault()
        setStep('payment')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handlePaySubmit(e) {
        e.preventDefault()
        const digits = pay.cardNumber.replace(/\s/g, '')
        if (digits.length < 16) { setCardError('Please enter a valid 16-digit card number.'); return }
        if (pay.expiry.replace(/\s/g, '').length < 5) { setCardError('Please enter a valid expiry date.'); return }
        if (pay.cvv.length < 3) { setCardError('Please enter your CVV.'); return }
        if (!pay.nameOnCard.trim()) { setCardError('Please enter the name on your card.'); return }
        setStep('confirmed')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const [orderNum] = useState(() => Math.floor(Math.random() * 900000 + 100000))

    if (step === 'confirmed') {
        return (
            <div className="checkout-page">
                <CheckoutNav onBackToSite={onBackToSite} totalQty={totalQty} />
                <div className="checkout-confirmed">
                    <div className="confirmed-check">✓</div>
                    <p className="checkout-confirmed__eyebrow">Order confirmed</p>
                    <h1 className="checkout-confirmed__title">Thank you, {form.firstName}.</h1>
                    <p className="checkout-confirmed__body">
                        A confirmation will be sent to <strong>{form.email}</strong>.<br />
                        Your order is being prepared with care.
                    </p>
                    <p className="confirmed-note">
                        Payment processed securely · Order #{orderNum}
                    </p>
                    <button className="btn-primary" onClick={onBackToSite}>
                        Return to Maison Yanis
                    </button>
                </div>
                <CheckoutFooter />
            </div>
        )
    }
    return (
        <div className="checkout-page">
            <CheckoutNav onBackToSite={onBackToSite} totalQty={totalQty} />

            <main className="checkout-main">

                {/* ══ LEFT COLUMN ══════════════════════════════════════════ */}
                <div className="checkout-left">
                    <h1 className="checkout-title">Checkout</h1>

                    {/* Breadcrumb */}
                    <div className="checkout-breadcrumb">
                        <span className="checkout-breadcrumb__link" onClick={onBackToSite}>Cart</span>
                        <span className="checkout-breadcrumb__sep">›</span>
                        <span
                            className={`checkout-breadcrumb__link ${step === 'information' ? 'checkout-breadcrumb__current' : 'checkout-breadcrumb__done'}`}
                            onClick={() => step === 'payment' && setStep('information')}
                        >
                            Information
                        </span>
                        <span className="checkout-breadcrumb__sep">›</span>
                        <span className={`checkout-breadcrumb__link ${step === 'payment' ? 'checkout-breadcrumb__current' : ''}`}>
                            Payment
                        </span>
                    </div>

                    {/* ── STEP 1: Information ────────────────────────────── */}
                    {step === 'information' && (
                        <form className="checkout-form" onSubmit={handleInfoSubmit}>
                            <fieldset className="checkout-fieldset">
                                <legend className="checkout-fieldset__legend">Contact Information</legend>
                                <input className="checkout-input" type="email" name="email" placeholder="Email address" required value={form.email} onChange={handleForm} />
                                <label className="checkout-checkbox">
                                    <input type="checkbox" name="emailOffers" checked={form.emailOffers} onChange={handleForm} />
                                    <span>Email me with news and offers</span>
                                </label>
                            </fieldset>

                            <fieldset className="checkout-fieldset">
                                <legend className="checkout-fieldset__legend">Shipping Address</legend>
                                <div className="checkout-row">
                                    <input className="checkout-input" type="text" name="firstName" placeholder="First name" required value={form.firstName} onChange={handleForm} />
                                    <input className="checkout-input" type="text" name="lastName" placeholder="Last name" required value={form.lastName} onChange={handleForm} />
                                </div>
                                <input className="checkout-input" type="text" name="address" placeholder="Address" required value={form.address} onChange={handleForm} />
                                <input className="checkout-input" type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" value={form.apartment} onChange={handleForm} />
                                <div className="checkout-row">
                                    <input className="checkout-input" type="text" name="city" placeholder="City" required value={form.city} onChange={handleForm} />
                                    <input className="checkout-input" type="text" name="zip" placeholder="ZIP code" required value={form.zip} onChange={handleForm} />
                                </div>
                                <select className="checkout-input checkout-select" name="country" value={form.country} onChange={handleForm}>
                                    <option>United States</option>
                                    <option>Canada</option>
                                    <option>United Kingdom</option>
                                    <option>France</option>
                                    <option>Norway</option>
                                    <option>Sweden</option>
                                    <option>Vietnam</option>
                                    <option>Other</option>
                                </select>
                                <input className="checkout-input" type="tel" name="phone" placeholder="Phone (optional)" value={form.phone} onChange={handleForm} />
                            </fieldset>

                            <div className="checkout-actions">
                                <button type="button" className="checkout-back-link" onClick={onBackToSite}>← Return to cart</button>
                                <button type="submit" className="btn-primary checkout-submit">Continue to Payment</button>
                            </div>
                        </form>
                    )}

                    {/* ── STEP 2: Payment ───────────────────────────────── */}
                    {step === 'payment' && (
                        <form className="checkout-form" onSubmit={handlePaySubmit}>
                            <fieldset className="checkout-fieldset">
                                <legend className="checkout-fieldset__legend">Payment Details</legend>

                                <div className="payment-secure-note">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    All transactions are secured and encrypted
                                </div>

                                <div className="payment-field">
                                    <label className="checkout-field-label">Card number</label>
                                    <div className="payment-input-wrap">
                                        <input
                                            className="checkout-input payment-card-input"
                                            type="text"
                                            name="cardNumber"
                                            placeholder="1234 5678 9012 3456"
                                            value={pay.cardNumber}
                                            onChange={handlePay}
                                            autoComplete="cc-number"
                                            inputMode="numeric"
                                        />
                                        <div className="payment-card-icons">
                                            <span className="card-icon card-icon--visa">VISA</span>
                                            <span className="card-icon card-icon--mc">MC</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="checkout-row">
                                    <div className="payment-field">
                                        <label className="checkout-field-label">Expiry date</label>
                                        <input
                                            className="checkout-input"
                                            type="text"
                                            name="expiry"
                                            placeholder="MM / YY"
                                            value={pay.expiry}
                                            onChange={handlePay}
                                            autoComplete="cc-exp"
                                            inputMode="numeric"
                                        />
                                    </div>
                                    <div className="payment-field">
                                        <label className="checkout-field-label">
                                            Security code <span className="cvv-hint">CVV</span>
                                        </label>
                                        <input
                                            className="checkout-input"
                                            type="text"
                                            name="cvv"
                                            placeholder="123"
                                            value={pay.cvv}
                                            onChange={handlePay}
                                            autoComplete="cc-csc"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                <div className="payment-field">
                                    <label className="checkout-field-label">Name on card</label>
                                    <input
                                        className="checkout-input"
                                        type="text"
                                        name="nameOnCard"
                                        placeholder="As it appears on your card"
                                        value={pay.nameOnCard}
                                        onChange={handlePay}
                                        autoComplete="cc-name"
                                    />
                                </div>

                                {cardError && <p className="payment-error">{cardError}</p>}
                            </fieldset>

                            {/* Shipping recap */}
                            <div className="shipping-recap">
                                <p className="shipping-recap__label">Shipping to</p>
                                <p className="shipping-recap__value">
                                    {form.firstName} {form.lastName} · {form.address}
                                    {form.apartment ? `, ${form.apartment}` : ''}, {form.city} {form.zip}, {form.country}
                                </p>
                                <button type="button" className="shipping-recap__change" onClick={() => setStep('information')}>
                                    Change
                                </button>
                            </div>

                            <div className="checkout-actions">
                                <button type="button" className="checkout-back-link" onClick={() => setStep('information')}>← Back to information</button>
                                <button type="submit" className="btn-primary checkout-submit">
                                    Pay ${total.toFixed(2)}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* ══ RIGHT COLUMN — ORDER SUMMARY ══════════════════════════ */}
                <aside className="checkout-right">
                    <div className="order-summary">
                        <h2 className="order-summary__title">Your Order</h2>

                        {lines.length === 0 ? (
                            <p className="order-summary__empty">Your cart is empty.</p>
                        ) : (
                            <ul className="order-summary__list">
                                {lines.map(({ product: p, qty }) => (
                                    <li key={p.id} className="order-item">
                                        <div className="order-item__img-wrap">
                                            {p.img
                                                ? <img src={p.img} alt={p.name} className="order-item__img" />
                                                : <div className="order-item__img-placeholder" style={{ background: p.bg }} />
                                            }
                                        </div>

                                        <div className="order-item__info">
                                            <p className="order-item__name">{p.name}</p>
                                            <p className="order-item__meta">{p.category} · 50ml</p>
                                            <p className="order-item__scent">{p.scent}</p>

                                            {/* quantity controls */}
                                            <div className="qty-control">
                                                <button className="qty-btn" onClick={() => changeQty(p.id, -1)} aria-label="Decrease">−</button>
                                                <span className="qty-num">{qty}</span>
                                                <button className="qty-btn" onClick={() => changeQty(p.id, +1)} aria-label="Increase">+</button>
                                                <button className="qty-remove" onClick={() => changeQty(p.id, -qty)} aria-label="Remove">Remove</button>
                                            </div>
                                        </div>

                                        <p className="order-item__price">${(p.price * qty).toFixed(2)}</p>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="order-summary__divider" />

                        <div className="order-totals">
                            <div className="order-totals__row">
                                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="order-totals__row order-totals__row--muted">
                                <span>Shipping</span><span>Calculated at next step</span>
                            </div>
                            <div className="order-totals__row">
                                <span>Taxes</span><span>${tax.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="order-summary__divider" />

                        <div className="order-total-final">
                            <span className="order-total-final__label">Total</span>
                            <span className="order-total-final__currency">USD</span>
                            <span className="order-total-final__amount">${total.toFixed(2)}</span>
                        </div>

                        <div className="order-badges">
                            <div className="order-badge">
                                <div className="order-badge__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                                        <path d="M8 12s1 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="order-badge__title">Natural Ingredients</p>
                                    <p className="order-badge__sub">Crafted with 100% natural botanicals.</p>
                                </div>
                            </div>
                            <div className="order-badge">
                                <div className="order-badge__icon">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                                        <path d="M8 12l2 2 4-4" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="order-badge__title">Sustainable Packaging</p>
                                    <p className="order-badge__sub">Eco-conscious and fully recyclable.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

            </main>
            <CheckoutFooter />
        </div>
    )


}
function CheckoutNav({ onBackToSite, totalQty }) {
    return (
        <nav className="nav">
            <div className="nav-logo" onClick={onBackToSite}>Maison Yanis</div>
            <div className="nav-links">
                <span className="nav-link" onClick={onBackToSite}>Collection</span>
                <span className="nav-link" onClick={onBackToSite}>About</span>
                <a className="nav-link" href={`mailto:${GMAIL}`}>Contact</a>
            </div>
            <span className="nav-link nav-cart">
                Cart
                {totalQty > 0 && <span className="cart-pill">{totalQty}</span>}
            </span>
        </nav>
    )
}

function CheckoutFooter() {
    return (
        <footer className="footer">
            <span className="footer__logo">Maison Yanis</span>
            <div className="footer__links">
                {NAV_LINKS.map(l => <span key={l} className="nav-link">{l}</span>)}
            </div>
            <span className="footer__copy">© 2026 Maison Yanis Fragrance</span>
            <p className="footer__note">This project is non-commercial. All images are used for learning purposes only.</p>
        </footer>
    )
}