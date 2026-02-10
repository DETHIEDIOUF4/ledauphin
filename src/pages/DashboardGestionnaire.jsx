import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import MenuManager from '../components/MenuManager'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function DashboardGestionnaire() {
  const { auth } = useAuth()
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/agents`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        setAgents(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        })
        setOrders(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setOrdersLoading(false)
      }
    }
    if (auth?.token) {
      fetchAgents()
      fetchOrders()
    }
  }, [auth?.token])

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.patch(
        `${API_URL}/orders/${orderId}/status`,
        { status: 'annulee' },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      setOrders(orders.map((o) => (o._id === orderId ? res.data : o)))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'annulation')
    }
  }

  return (
    <div className="page dashboard-page">
      <div className="dashboard-inner">
        <h1>Espace Gestionnaire</h1>
        <p className="dashboard-welcome">Bienvenue, {auth?.user?.name}.</p>
        {error && <p className="dashboard-error">{error}</p>}
        <section className="dashboard-section">
          <h2>Agents de caisse</h2>
          {loading ? (
            <p>Chargement…</p>
          ) : (
            <ul className="agent-list">
              {agents.length === 0 ? (
                <li className="agent-empty">Aucun agent enregistré.</li>
              ) : (
                agents.map((agent) => (
                  <li key={agent._id} className="agent-item">
                    <span className="agent-name">{agent.name}</span>
                    <span className="agent-email">{agent.email}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </section>

        <section className="dashboard-section">
          <MenuManager />
        </section>

        <section className="dashboard-section">
          <h2>Commandes récentes</h2>
          {ordersLoading ? (
            <p>Chargement…</p>
          ) : orders.length === 0 ? (
            <p className="dashboard-placeholder">Aucune commande enregistrée.</p>
          ) : (
            <table className="order-history-table">
              <thead>
                <tr>
                  <th>Heure</th>
                  <th>Client / Table</th>
                  <th>Total</th>
                  <th>Statut</th>
                  <th>Créée par</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{new Date(order.createdAt).toLocaleTimeString()}</td>
                    <td>
                      {order.serveuse ? `Serveuse: ${order.serveuse}` : '—'}{order.tableNumber ? ` · Table ${order.tableNumber}` : ''}{order.createdBy?.name ? ` · Pris par: ${order.createdBy.name}` : ''}
                    </td>
                    <td>{order.total.toFixed(2)} €</td>
                    <td>{order.status}</td>
                    <td>{order.createdBy?.name || '-'}</td>
                    <td>
                      {order.status === 'en_cours' && (
                        <button
                          type="button"
                          className="btn btn-small btn-danger"
                          onClick={() => cancelOrder(order._id)}
                        >
                          Annuler
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  )
}
