import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { formatFCFA } from '../utils/currency'
import './MenuManager.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const CATEGORIES = [
  { value: 'entrees', label: 'Entrées' },
  { value: 'plats', label: 'Plats' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'bar', label: 'Bar & boissons' },
]

function groupByCategory(items) {
  const order = ['entrees', 'plats', 'desserts', 'bar']
  const grouped = {}
  order.forEach((cat) => { grouped[cat] = [] })
  items.forEach((item) => {
    if (grouped[item.category]) grouped[item.category].push(item)
  })
  return order.map((cat) => ({ category: cat, items: grouped[cat] }))
}

export default function MenuManager() {
  const { auth } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', price: '', imageUrl: '', category: 'entrees', order: 0 })
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${API_URL}/menu`)
      setItems(res.data)
    } catch (err) {
      setError(err.message || 'Erreur chargement')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (auth?.token) fetchMenu()
  }, [auth?.token])

  const getAuthHeaders = () => ({ Authorization: `Bearer ${auth.token}` })

  const openAdd = () => {
    setEditingId(null)
    setShowForm(true)
    setForm({ name: '', description: '', price: '', imageUrl: '', category: 'entrees', order: 0 })
    setError('')
    setUploadError('')
  }

  const openEdit = (item) => {
    setEditingId(item._id)
    setShowForm(true)
    setForm({
      name: item.name,
      description: item.description || '',
      price: String(item.price),
      imageUrl: item.imageUrl || '',
      category: item.category,
      order: item.order ?? 0,
    })
    setError('')
    setUploadError('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setShowForm(false)
    setForm({ name: '', description: '', price: '', imageUrl: '', category: 'entrees', order: 0 })
    setError('')
    setUploadError('')
  }

  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      setUploadError("Cloudinary n'est pas configuré (variables VITE_CLOUDINARY_...).")
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: data,
      })
      const json = await res.json()
      if (json.secure_url) {
        setForm((prev) => ({ ...prev, imageUrl: json.secure_url }))
      } else if (json.error) {
        setUploadError(json.error.message || "Cloudinary a renvoyé une erreur.")
      } else {
        setUploadError("Impossible de téléverser l'image.")
      }
    } catch (err) {
      setUploadError(err.message || "Erreur lors de l'upload.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      imageUrl: (form.imageUrl || '').trim(),
      category: form.category,
      order: Number(form.order) || 0,
    }
    if (!payload.name || isNaN(payload.price)) {
      setError('Nom et prix obligatoires.')
      return
    }
    try {
      if (editingId) {
        await axios.put(`${API_URL}/menu/${editingId}`, payload, { headers: getAuthHeaders() })
      } else {
        await axios.post(`${API_URL}/menu`, payload, { headers: getAuthHeaders() })
      }
      setShowForm(false)
      setEditingId(null)
      setForm({ name: '', description: '', price: '', imageUrl: '', category: 'entrees', order: 0 })
      setError('')
      fetchMenu()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet élément du menu ?')) return
    try {
      await axios.delete(`${API_URL}/menu/${id}`, { headers: getAuthHeaders() })
      fetchMenu()
      if (editingId === id) cancelEdit()
      setShowForm(false)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur')
    }
  }

  const grouped = groupByCategory(items)

  if (loading) {
    return <p className="menu-manager-loading">Chargement du menu…</p>
  }

  return (
    <div className="menu-manager">
      <div className="menu-manager-header">
        <h2>Gestion du menu</h2>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          Ajouter un plat
        </button>
      </div>

      {showForm && (
        <form className="menu-manager-form" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Modifier l\'élément' : 'Nouvel élément'}</h3>
          {error && <p className="menu-manager-error">{error}</p>}
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
              <span>Prix (FCFA)</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </label>
          </div>
          <label>
            <span>Description</span>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optionnel"
            />
          </label>
          <label>
            <span>Photo</span>
            <div className="menu-manager-photo-row">
              <div className="menu-manager-photo-inputs">
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="Coller une URL (optionnel, sinon image par défaut)"
                />
                <div className="menu-manager-upload-row">
                  <input
                    type="file"
                    accept="image/*"
                    id="menu-photo-file"
                    onChange={handleUploadImage}
                  />
                  <span className="menu-manager-upload-help">
                    Vous pouvez téléverser une image (Cloudinary) ou laisser vide.
                  </span>
                </div>
                {uploadError && <p className="menu-manager-upload-error">{uploadError}</p>}
                {uploading && <p className="menu-manager-uploading">Téléversement en cours…</p>}
              </div>
              {form.imageUrl && (
                <div className="menu-manager-photo-preview">
                  <img src={form.imageUrl} alt={form.name || 'Aperçu du plat'} />
                </div>
              )}
            </div>
          </label>
          <div className="form-row">
            <label>
              <span>Catégorie</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
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
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Enregistrer' : 'Ajouter'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="menu-manager-list">
        {grouped.map(({ category, items: catItems }) => (
          <div key={category} className="menu-manager-category">
            <h4>{CATEGORIES.find((c) => c.value === category)?.label || category}</h4>
            {catItems.length === 0 ? (
              <p className="menu-manager-empty">Aucun élément</p>
            ) : (
              <ul>
                {catItems.map((item) => (
                  <li key={item._id} className="menu-manager-item">
                    <span className="menu-manager-item-name">{item.name}</span>
                    {item.description && (
                      <span className="menu-manager-item-desc">{item.description}</span>
                    )}
                    <span className="menu-manager-item-price">{formatFCFA(item.price)}</span>
                    <div className="menu-manager-item-actions">
                      <button
                        type="button"
                        className="btn btn-small"
                        onClick={() => openEdit(item)}
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        className="btn btn-small btn-danger"
                        onClick={() => handleDelete(item._id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
