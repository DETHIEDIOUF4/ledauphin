import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import '../../pages/Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const ROLE_LABELS = { gestionnaire: 'Gestionnaire', agent_caisse: 'Agent de caisse' }

export default function GestionUtilisateurs() {
  const { auth } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'agent_caisse' })
  const [submitting, setSubmitting] = useState(false)

  const getAuthHeaders = () => ({ Authorization: `Bearer ${auth.token}` })

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`, { headers: getAuthHeaders() })
      setUsers(res.data)
    } catch (err) {
      setError(err.message || 'Erreur chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth?.token) fetchUsers()
  }, [auth?.token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await axios.post(`${API_URL}/users`, form, { headers: getAuthHeaders() })
      setForm({ name: '', email: '', password: '', role: 'agent_caisse' })
      fetchUsers()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="gestion-page">
      <h1>Gestion des utilisateurs</h1>
      <p className="gestion-page-desc">Ajoutez des caissiers ou des gestionnaires.</p>
      {error && <p className="dashboard-error">{error}</p>}

      <section className="dashboard-section">
        <h2>Ajouter un utilisateur</h2>
        <form className="user-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              <span>Nom</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              <span>Mot de passe</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </label>
            <label>
              <span>Rôle</span>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="agent_caisse">Agent de caisse</option>
                <option value="gestionnaire">Gestionnaire</option>
              </select>
            </label>
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Création…' : 'Ajouter'}
          </button>
        </form>
      </section>

      <section className="dashboard-section">
        <h2>Liste des utilisateurs</h2>
        {loading ? (
          <p>Chargement…</p>
        ) : users.length === 0 ? (
          <p className="dashboard-placeholder">Aucun utilisateur.</p>
        ) : (
          <table className="order-history-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{ROLE_LABELS[u.role] || u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
