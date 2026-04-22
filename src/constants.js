// ─── COLOR PALETTE ────────────────────────────────────────────────────────────
//  --color-bg:        #F0EDE8   ← Linen        (page background)
//  --color-surface:   #FAFAF8   ← Snow White   (nav, cards, footer)
//  --color-birch:     #E4E0D8   ← Birch        (borders, dividers)
//  --color-stone:     #9E9B94   ← Stone        (muted text, labels)
//  --color-charcoal:  #2C2B28   ← Charcoal     (headings, buttons, body)
//  --color-sand:      #C4A882   ← Warm Sand    (accent, italic highlights)
//  --color-sand-lt:   #F5EFE6   ← Sand Light   (badge backgrounds)
// ─────────────────────────────────────────────────────────────────────────────
import hvit from './assets/hvit.jpg'
import skog from './assets/skog.jpg'
import hav from './assets/hav.jpg'
import eld from './assets/eld.jpg'
import blomst from './assets/blomst.jpg'
import natt from './assets/natt.jpg'
import regn from './assets/regn.jpg'
import is from './assets/is.jpg'
import sol from './assets/sol.jpg'
export const C = {
    bg: '#F0EDE8',
    surface: '#FAFAF8',
    birch: '#E4E0D8',
    stone: '#9E9B94',
    charcoal: '#2C2B28',
    sand: '#C4A882',
    sandLight: '#F5EFE6',
}

// ─── 9 PERFUME PRODUCTS (3×3 grid) ───────────────────────────────────────────
export const PRODUCTS = [
    { id: 1, name: 'Hvit', scent: 'White tea · Cedar', category: 'Eau de Parfum', price: 120, tag: 'Bestseller', bg: '#DDD8D0', img: hvit },
    { id: 2, name: 'Skog', scent: 'Pine · Moss · Birch', category: 'Eau de Parfum', price: 135, tag: 'New', bg: '#C8CFC4', img: skog },
    { id: 3, name: 'Hav', scent: 'Sea salt · Driftwood', category: 'Eau de Parfum', price: 115, tag: null, bg: '#C8D4D8', img: hav },
    { id: 4, name: 'Eld', scent: 'Smoke · Amber · Leather', category: 'Eau de Parfum', price: 145, tag: 'New', bg: '#C4B8A8', img: eld },
    { id: 5, name: 'Blomst', scent: 'Rose · Linen · Musk', category: 'Eau de Parfum', price: 125, tag: 'Bestseller', bg: '#D8C8C4', img: blomst },
    { id: 6, name: 'Natt', scent: 'Oud · Sandalwood · Pepper', category: 'Eau de Parfum', price: 155, tag: null, bg: '#B8B0A8', img: natt },
    { id: 7, name: 'Regn', scent: 'Rain · Petrichor · Vetiver', category: 'Eau de Parfum', price: 118, tag: 'New', bg: '#C4CCD4', img: regn },
    { id: 8, name: 'Is', scent: 'Frost · White musk · Iris', category: 'Eau de Parfum', price: 128, tag: null, bg: '#D0D8DC', img: is },
    { id: 9, name: 'Sol', scent: 'Warm wood · Vanilla · Neroli', category: 'Eau de Parfum', price: 138, tag: 'Bestseller', bg: '#D4C4A8', img: sol },
]

export const GMAIL = 'micaeankun8903@gmail.com'

export const STATS = [
    { num: '2026', label: 'Founded in 2026' },
    { num: '100%', label: 'Natural ingredients' },
    { num: '9', label: 'Unique fragrances' },
]

export const HIRE_ROLES = [
    { role: 'Full-time', detail: 'Frontend Developer' },
    { role: 'Internship', detail: 'React / UI' },
    { role: 'Freelance', detail: 'Web Projects' },
    { role: 'Status', detail: 'Remote-Ready/Time-zone friendly' },
]

export const NAV_LINKS = ['Privacy', 'Shipping', 'Returns']