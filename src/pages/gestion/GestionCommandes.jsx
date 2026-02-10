import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import { formatFCFA } from '../../utils/currency'
import ReceiptPrint from '../../components/ReceiptPrint'
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

const STATUS_FLOW = ['lancee', 'en_preparation', 'servie', 'payee']

export default function GestionCommandes() {
  const { auth } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [orderToPrint, setOrderToPrint] = useState(null)

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      setOrders(res.data)
    } catch (err) {
      setError(err.message || 'Erreur chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth?.token) fetchOrders()
  }, [auth?.token])

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.patch(
        `${API_URL}/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      setOrders(orders.map((o) => (o._id === orderId ? res.data : o)))
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur')
    }
  }

  const cancelOrder = async (orderId) => {
    if (!window.confirm('Annuler cette commande ?')) return
    await updateStatus(orderId, 'annulee')
  }

  const filtered = filterStatus
    ? orders.filter((o) => o.status === filterStatus)
    : orders

  useEffect(() => {
    if (!orderToPrint) return
    const onAfterPrint = () => setOrderToPrint(null)
    window.addEventListener('afterprint', onAfterPrint)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => window.print())
    })
    return () => window.removeEventListener('afterprint', onAfterPrint)
  }, [orderToPrint])

  return (
    <div className="gestion-page">
      <h1>Liste des commandes</h1>
      <p className="gestion-page-desc">Consultez les commandes et mettez à jour leur état. Seul le gestionnaire peut annuler une commande.</p>
      {error && <p className="dashboard-error">{error}</p>}
      <div className="gestion-filters">
        <label>
          <span>Filtrer par statut</span>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Toutes</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <p>Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="dashboard-placeholder">Aucune commande.</p>
      ) : (
        <div className="order-list-by-line order-list-gestion">
          {filtered.map((order) => (
            <div
              key={order._id}
              className={`order-line order-line--${order.status === 'payee' ? 'payee' : order.status === 'annulee' ? 'annulee' : 'unpaid'}`}
            >
              <span className="order-line-date">{new Date(order.createdAt).toLocaleString('fr-FR')}</span>
              <span className="order-line-client">
                {order.serveuse ? `Serveuse: ${order.serveuse}` : '—'}{order.tableNumber ? ` · Table ${order.tableNumber}` : ''}
                {order.createdBy?.name && ` · Pris par: ${order.createdBy.name}`}
              </span>
              <span className="order-line-total">{formatFCFA(order.total)}</span>
              <span className="order-line-status">{STATUS_LABELS[order.status] || order.status}</span>
              <span className="order-line-created">{order.createdBy?.name || '-'}</span>
              <span className="order-line-actions">
                <button
                  type="button"
                  className="btn btn-small btn-print"
                  onClick={() => setOrderToPrint(order)}
                  title="Imprimer l'addition (80mm)"
                >
                  Imprimer
                </button>
                {order.status !== 'payee' && order.status !== 'annulee' && (
                  <>
                    <select
                      value={order.status === 'en_cours' ? 'lancee' : order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="order-status-select"
                    >
                      {STATUS_FLOW.filter((s) => s !== 'annulee').map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => cancelOrder(order._id)}
                    >
                      Annuler
                    </button>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
      {orderToPrint && (
        <div className="receipt-80mm receipt-visible">
          <ReceiptPrint order={orderToPrint} />
        </div>
      )}
    </div>
  )
}
