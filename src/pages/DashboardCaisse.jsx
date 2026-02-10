import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { formatFCFA } from '../utils/currency'
import ReceiptPrint from '../components/ReceiptPrint'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const STATUS_LABELS = {
  en_cours: 'En cours',
  lancee: 'Lancée',
  en_preparation: 'En préparation',
  servie: 'Servie',
  payee: 'Payée',
  annulee: 'Annulée',
}

export default function DashboardCaisse() {
  const { auth } = useAuth()
  const [menu, setMenu] = useState([])
  const [orders, setOrders] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [error, setError] = useState('')
  const [itemsSelection, setItemsSelection] = useState([])
  const [serveuseName, setServeuseName] = useState('')
  const [tableNumber, setTableNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderToPrint, setOrderToPrint] = useState(null)
  const [menuCategory, setMenuCategory] = useState('') // '' = tous, 'entrees', 'plats', 'desserts'

  const CATEGORIES = [
    { value: '', label: 'Tous' },
    { value: 'entrees', label: 'Entrées' },
    { value: 'plats', label: 'Plats' },
    { value: 'desserts', label: 'Desserts' },
  ]

  const menuByCategory = useMemo(() => {
    const filtered = menuCategory
      ? menu.filter((m) => m.category === menuCategory)
      : menu
    const order = ['entrees', 'plats', 'desserts']
    const grouped = { entrees: [], plats: [], desserts: [] }
    filtered.forEach((m) => {
      if (grouped[m.category]) grouped[m.category].push(m)
    })
    return menuCategory ? grouped[menuCategory] : order.flatMap((cat) => grouped[cat])
  }, [menu, menuCategory])

  const getMenuImage = (item) => {
    if (item.imageUrl) return item.imageUrl
    const placeholders = {
      entrees: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
      plats: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
      desserts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    }
    return placeholders[item.category] || placeholders.plats
  }

  const getAuthHeaders = () => ({ Authorization: `Bearer ${auth.token}` })

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_URL}/menu`)
        setMenu(res.data)
      } catch (err) {
        setError(err.message || 'Erreur chargement menu')
      } finally {
        setLoadingMenu(false)
      }
    }
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/orders`, { headers: getAuthHeaders() })
        setOrders(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingOrders(false)
      }
    }
    if (auth?.token) {
      fetchMenu()
      fetchOrders()
    }
  }, [auth?.token])

  const addItem = (menuItemId) => {
    const existing = itemsSelection.find((i) => i.menuItemId === menuItemId)
    if (existing) {
      setItemsSelection(itemsSelection.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      setItemsSelection([...itemsSelection, { menuItemId, quantity: 1 }])
    }
  }

  const updateQuantity = (menuItemId, quantity) => {
    const q = Number(quantity) || 0
    if (q <= 0) {
      setItemsSelection(itemsSelection.filter((i) => i.menuItemId !== menuItemId))
    } else {
      setItemsSelection(itemsSelection.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity: q } : i
      ))
    }
  }

  const removeItem = (menuItemId) => {
    setItemsSelection(itemsSelection.filter((i) => i.menuItemId !== menuItemId))
  }

  const incrementQuantity = (menuItemId) => {
    const existing = itemsSelection.find((i) => i.menuItemId === menuItemId)
    if (existing) {
      updateQuantity(menuItemId, existing.quantity + 1)
    }
  }

  const decrementQuantity = (menuItemId) => {
    const existing = itemsSelection.find((i) => i.menuItemId === menuItemId)
    if (existing) {
      if (existing.quantity <= 1) {
        removeItem(menuItemId)
      } else {
        updateQuantity(menuItemId, existing.quantity - 1)
      }
    }
  }

  const currentOrderDetailed = useMemo(() => {
    return itemsSelection.map((sel) => {
      const item = menu.find((m) => m._id === sel.menuItemId)
      const price = item?.price ?? 0
      const subtotal = price * sel.quantity
      return { ...sel, name: item?.name || 'Article', price, subtotal }
    })
  }, [itemsSelection, menu])

  const total = currentOrderDetailed.reduce((sum, i) => sum + i.subtotal, 0)

  const handleSubmitOrder = async (e) => {
    e.preventDefault()
    if (currentOrderDetailed.length === 0) {
      setError('Ajoutez au moins un article à la commande.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        serveuse: serveuseName || undefined,
        tableNumber: tableNumber || undefined,
        items: currentOrderDetailed.map((i) => ({
          menuItemId: i.menuItemId,
          quantity: i.quantity,
        })),
      }
      const res = await axios.post(`${API_URL}/orders`, payload, { headers: getAuthHeaders() })
      // Reset commande
      setItemsSelection([])
      setServeuseName('')
      setTableNumber('')
      // Rafraîchir la liste
      setOrders([res.data, ...orders])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de la création de la commande')
    } finally {
      setSubmitting(false)
    }
  }

  const markPaid = async (orderId) => {
    try {
      const res = await axios.patch(
        `${API_URL}/orders/${orderId}/status`,
        { status: 'payee' },
        { headers: getAuthHeaders() }
      )
      setOrders(orders.map((o) => (o._id === orderId ? res.data : o)))
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur mise à jour commande')
    }
  }

  const printReceipt = (order) => {
    setOrderToPrint(order)
  }

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
    <div className="page dashboard-page caisse-page">
      <div className="dashboard-inner">
        <h1>Espace Caisse</h1>
        <p className="dashboard-welcome">Bienvenue, {auth?.user?.name}.</p>

        <section className="dashboard-section">
          <h2>Nouvelle commande</h2>
          {error && <p className="dashboard-error">{error}</p>}
          {loadingMenu ? (
            <p>Chargement du menu…</p>
          ) : menu.length === 0 ? (
            <p>Aucun article au menu. Demandez au gestionnaire d&apos;ajouter des plats.</p>
          ) : (
            <>
              <form className="order-form caisse-order-form" onSubmit={handleSubmitOrder}>
                <div className="caisse-split">
                  <div className="caisse-col-left">
                    <div className="order-form-row">
                      <label>
                        <span>Serveuse</span>
                        <input
                          type="text"
                          value={serveuseName}
                          onChange={(e) => setServeuseName(e.target.value)}
                          placeholder="Nom de la serveuse (optionnel)"
                        />
                      </label>
                      <label>
                        <span>Table</span>
                        <input
                          type="text"
                          value={tableNumber}
                          onChange={(e) => setTableNumber(e.target.value)}
                          placeholder="Numéro de table (optionnel)"
                        />
                      </label>
                    </div>
                    <div className="order-summary">
                      <h3>Commande en cours</h3>
                      {currentOrderDetailed.length === 0 ? (
                        <p className="dashboard-placeholder">Aucun article pour le moment.</p>
                      ) : (
                        <table className="order-table">
                          <thead>
                            <tr>
                              <th>Article</th>
                              <th>Prix</th>
                              <th>Qté</th>
                              <th>Sous-total</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentOrderDetailed.map((row) => (
                              <tr key={row.menuItemId}>
                                <td>{row.name}</td>
                                <td>{formatFCFA(row.price)}</td>
                                <td>
                                  <div className="order-qty-controls">
                                    <button
                                      type="button"
                                      className="order-qty-btn"
                                      onClick={() => decrementQuantity(row.menuItemId)}
                                      aria-label="Diminuer"
                                    >
                                      −
                                    </button>
                                    <input
                                      type="number"
                                      min="1"
                                      value={row.quantity}
                                      onChange={(e) => {
                                        const v = e.target.value
                                        if (v === '' || v === '0') {
                                          removeItem(row.menuItemId)
                                          return
                                        }
                                        updateQuantity(row.menuItemId, v)
                                      }}
                                      className="order-qty-input"
                                    />
                                    <button
                                      type="button"
                                      className="order-qty-btn"
                                      onClick={() => incrementQuantity(row.menuItemId)}
                                      aria-label="Augmenter"
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td>{formatFCFA(row.subtotal)}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-small btn-danger"
                                    onClick={() => removeItem(row.menuItemId)}
                                    title="Supprimer l'article"
                                  >
                                    Supprimer
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={4} className="order-total-label">Total</td>
                              <td className="order-total-value">{formatFCFA(total)}</td>
                            </tr>
                          </tfoot>
                        </table>
                      )}
                    </div>
                    <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                      {submitting ? 'Enregistrement…' : 'Valider la commande'}
                    </button>
                  </div>
                  <div className="caisse-col-right">
                    <div className="order-menu">
                      <p className="order-menu-title">Choisir par type de menu</p>
                      <div className="order-menu-tabs">
                        {CATEGORIES.map((cat) => (
                          <button
                            key={cat.value || 'all'}
                            type="button"
                            className={`order-menu-tab ${menuCategory === cat.value ? 'active' : ''}`}
                            onClick={() => setMenuCategory(cat.value)}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>
                      <div className="order-menu-cards">
                        {menuByCategory.map((item) => {
                          const qty = itemsSelection.find((i) => i.menuItemId === item._id)?.quantity || 0
                          return (
                            <button
                              key={item._id}
                              type="button"
                              className={`order-menu-card ${qty > 0 ? 'selected' : ''}`}
                              onClick={() => addItem(item._id)}
                            >
                              <div className="order-menu-card-image">
                                <img src={getMenuImage(item)} alt="" />
                                {qty > 0 && <span className="order-menu-card-qty">{qty}</span>}
                              </div>
                              <div className="order-menu-card-info">
                                <span className="order-menu-card-name">{item.name}</span>
                                <span className="order-menu-card-price">{formatFCFA(item.price)}</span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </section>

        <section className="dashboard-section">
          <h2>Dernières commandes</h2>
          {loadingOrders ? (
            <p>Chargement…</p>
          ) : orders.length === 0 ? (
            <p className="dashboard-placeholder">Aucune commande enregistrée pour le moment.</p>
          ) : (
            <div className="order-list-by-line">
              {orders.map((order) => (
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
                  <span className="order-line-actions">
                    <button
                      type="button"
                      className="btn btn-small btn-print"
                      onClick={() => printReceipt(order)}
                      title="Imprimer l'addition (format 80mm)"
                    >
                      Imprimer
                    </button>
                    {order.status !== 'payee' && order.status !== 'annulee' && (
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => markPaid(order._id)}
                      >
                        Marquer payée
                      </button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Zone d'impression addition 80mm (masquée, utilisée à l'impression) */}
      {orderToPrint && (
        <div className="receipt-80mm receipt-visible">
          <ReceiptPrint order={orderToPrint} />
        </div>
      )}
    </div>
  )
}
