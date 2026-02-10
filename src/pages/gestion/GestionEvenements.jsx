import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import './GestionEvenements.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function GestionEvenements() {
  const { auth } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    when: '',
    isActive: true,
    order: 0,
  })

  const getAuthHeaders = () => ({ Authorization: `Bearer ${auth.token}` })

  const presetWhenOptions = [
    'Chaque vendredi et samedi soir',
    'Dimanche à partir de 10 h',
    'Sur réservation',
  ]

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`, { headers: getAuthHeaders() })
      setEvents(res.data)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur de chargement des événements')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth?.token) {
      fetchEvents()
    }
  }, [auth?.token])

  const openAdd = () => {
    setEditingId(null)
    setShowForm(true)
    setForm({
      title: '',
      description: '',
      when: '',
      isActive: true,
      order: 0,
    })
    setError('')
  }

  const openEdit = (event) => {
    setEditingId(event._id)
    setShowForm(true)
    setForm({
      title: event.title || '',
      description: event.description || '',
      when: event.when || '',
      isActive: event.isActive ?? true,
      order: event.order ?? 0,
    })
    setError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      when: form.when.trim(),
      isActive: !!form.isActive,
      order: Number(form.order) || 0,
    }

    if (!payload.title) {
      setError('Le titre est obligatoire.')
      return
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/events/${editingId}`, payload, { headers: getAuthHeaders() })
      } else {
        await axios.post(`${API_URL}/events`, payload, { headers: getAuthHeaders() })
      }
      setShowForm(false)
      setEditingId(null)
      await fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet événement ?')) return
    try {
      await axios.delete(`${API_URL}/events/${id}`, { headers: getAuthHeaders() })
      if (editingId === id) {
        cancelEdit()
      }
      await fetchEvents()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur lors de la suppression')
    }
  }

  if (loading) {
    return <p className="events-manager-loading">Chargement des événements…</p>
  }

  return (
    <div className="events-manager">
      <div className="events-manager-header">
        <h2>Gestion des événements</h2>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          Ajouter un événement
        </button>
      </div>

      <div className="events-manager-body">
        {showForm && (
          <div className="events-manager-form-wrapper">
            <form className="events-manager-form" onSubmit={handleSubmit}>
              <h3>{editingId ? 'Modifier l\'événement' : 'Nouvel événement'}</h3>
              {error && <p className="events-manager-error">{error}</p>}
              <div className="form-row">
                <label>
                  <span>Titre</span>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                  />
                </label>
              </div>
              <label>
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Détail de l'événement (optionnel)"
                />
              </label>
              <label>
                <span>Quand ?</span>
                <input
                  type="text"
                  value={form.when}
                  onChange={(e) => setForm({ ...form, when: e.target.value })}
                  placeholder="Ex: Chaque vendredi et samedi soir"
                />
              </label>
              <div className="events-manager-presets">
                <span className="events-manager-presets-label">Raccourcis :</span>
                {presetWhenOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className="events-manager-preset-chip"
                    onClick={() => setForm({ ...form, when: opt })}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              <div className="form-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  />
                  <span>Actif (affiché sur le site)</span>
                </label>
                <label>
                  <span>Ordre</span>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                  />
                </label>
              </div>

              <div className="events-manager-preview">
                <p className="events-manager-preview-title">Aperçu</p>
                <article className="event-card">
                  <h4>{form.title || 'Titre de l\'événement'}</h4>
                  {(form.description || form.when) && (
                    <>
                      {form.description && (
                        <p className="event-desc">{form.description}</p>
                      )}
                      {form.when && <p className="event-when">{form.when}</p>}
                    </>
                  )}
                  {!form.description && !form.when && (
                    <p className="event-desc event-desc-placeholder">
                      Ajoutez une description et un texte \"Quand ?\" pour voir l'aperçu ici.
                    </p>
                  )}
                </article>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Enregistrer' : 'Ajouter'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="events-manager-list">
          {events.length === 0 ? (
            <p className="events-manager-empty">Aucun événement pour le moment.</p>
          ) : (
            <ul>
              {events.map((event) => (
                <li key={event._id} className="events-manager-item">
                  <div className="events-manager-info">
                    <span className="events-manager-title">
                      {event.title}{' '}
                      {!event.isActive && <span className="events-manager-badge-inactive">Inactif</span>}
                    </span>
                    {event.when && <span className="events-manager-when">{event.when}</span>}
                    {event.description && (
                      <span className="events-manager-desc">{event.description}</span>
                    )}
                  </div>
                  <div className="events-manager-actions">
                    <button
                      type="button"
                      className="btn btn-small"
                      onClick={() => openEdit(event)}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="btn btn-small btn-danger"
                      onClick={() => handleDelete(event._id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

