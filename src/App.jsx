import { useState } from 'react'
import Landingpage from './Landingpage.jsx'
import Checkout from './Checkout.jsx'

export default function App() {
    const [page, setPage] = useState('landing') // 'landing' | 'checkout'

    if (page === 'checkout') {
        return <Checkout onBackToSite={() => setPage('landing')} />
    }

    return <Landingpage onGoToCheckout={() => setPage('checkout')} />
}