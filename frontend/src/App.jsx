import { useMemo, useState } from 'react'
import Navbar from './components/common/Navbar'
import Sidebar from './components/common/Sidebar'
import './App.css'

function App() {
  const [activeUserId, setActiveUserId] = useState('all')

  const users = [
    { id: 'u1', name: 'User 1' },
    { id: 'u2', name: 'User 2' },
    { id: 'u3', name: 'User 3' },
    { id: 'u4', name: 'User 4' },
  ]

  const portfolioByUser = {
    u1: { cash: 120000, stocks: 540000, bonds: 180000 },
    u2: { cash: 70000, stocks: 430000, bonds: 220000 },
    u3: { cash: 95000, stocks: 370000, bonds: 260000 },
    u4: { cash: 88000, stocks: 295000, bonds: 175000 },
  }

  const metrics = useMemo(() => {
    if (activeUserId === 'all') {
      return Object.values(portfolioByUser).reduce(
        (totals, current) => ({
          cash: totals.cash + current.cash,
          stocks: totals.stocks + current.stocks,
          bonds: totals.bonds + current.bonds,
        }),
        { cash: 0, stocks: 0, bonds: 0 },
      )
    }

    return portfolioByUser[activeUserId]
  }, [activeUserId])

  const totalValue = metrics.cash + metrics.stocks + metrics.bonds

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value)

  return (
    <div className="app-shell">
      <Sidebar />

      <div className="app-main">
        <Navbar
          pageTitle="Dashboard"
          users={users}
          activeUserId={activeUserId}
          onUserChange={setActiveUserId}
        />

        <main className="dashboard-grid">
          <section className="summary-card summary-card--wide">
            <p className="summary-card__label">Total Portfolio Value</p>
            <h2>{formatCurrency(totalValue)}</h2>
            <p className="summary-card__hint">Combined cash, stocks and bonds</p>
          </section>

          <section className="summary-card">
            <p className="summary-card__label">Cash</p>
            <h3>{formatCurrency(metrics.cash)}</h3>
          </section>

          <section className="summary-card">
            <p className="summary-card__label">Stocks</p>
            <h3>{formatCurrency(metrics.stocks)}</h3>
          </section>

          <section className="summary-card">
            <p className="summary-card__label">Bonds</p>
            <h3>{formatCurrency(metrics.bonds)}</h3>
          </section>
        </main>
      </div>
    </div>
  )
}

export default App
