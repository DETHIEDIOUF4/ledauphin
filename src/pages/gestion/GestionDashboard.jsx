import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { formatFCFA } from '../../utils/currency'
import '../../pages/Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const STATUS_LABELS = {
  en_cours: 'En cours',
  lancee: 'Lancée',
  en_preparation: 'En préparation',
  servie: 'Servie',
  payee: 'Payée',
  annulee: 'Annulée',
}

export default function GestionDashboard() {
  const { auth } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders/stats`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        setStats(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (auth?.token) fetchStats()
  }, [auth?.token])

  if (loading) return <div className="gestion-page"><p>Chargement…</p></div>
  if (!stats) return <div className="gestion-page"><p>Impossible de charger les statistiques.</p></div>

  const { solde, byStatus, topItems } = stats

  return (
    <div className="gestion-page">
      <h1>Dashboard</h1>
      <p className="gestion-page-desc">Vue d’ensemble des ventes et des plats les plus commandés.</p>

      <section className="dashboard-stats-grid">
        <div className="stat-card stat-card-solde">
          <h3>Solde (encaissé)</h3>
          <p className="stat-value">{formatFCFA(Number(solde))}</p>
          <p className="stat-hint">Total des commandes payées</p>
        </div>
        {byStatus && Object.keys(byStatus).length > 0 && (
          <div className="stat-card">
            <h3>Commandes par statut</h3>
            <ul className="stat-list">
              {Object.entries(byStatus).map(([status, count]) => (
                <li key={status}>
                  <span>{STATUS_LABELS[status] || status}</span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="dashboard-section top-items-section">
        <h2>Plats les plus commandés</h2>
        {!topItems || topItems.length === 0 ? (
          <p className="dashboard-placeholder">Aucune donnée pour le moment.</p>
        ) : (
          <table className="order-history-table">
            <thead>
              <tr>
                <th>Plat</th>
                <th>Quantité</th>
                <th>Chiffre d'affaires</th>
              </tr>
            </thead>
            <tbody>
              {topItems.map((item, i) => (
                <tr key={i}>
                  <td>{item._id}</td>
                  <td>{item.quantity}</td>
                  <td>{formatFCFA(Number(item.revenue || 0))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
