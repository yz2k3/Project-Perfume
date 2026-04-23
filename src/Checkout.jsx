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

}