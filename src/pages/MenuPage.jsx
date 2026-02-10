import { useState, useEffect } from 'react'
import axios from 'axios'
import { formatFCFA } from '../utils/currency'
import './MenuPage.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

const CATEGORY_LABELS = {
  entrees: 'Entrées',
  plats: 'Plats',
  desserts: 'Desserts',
  bar: 'Bar & boissons',
}

function groupByCategory(items) {
  const order = ['entrees', 'plats', 'desserts', 'bar']
  const grouped = {}
  order.forEach((cat) => { grouped[cat] = [] })
  items.forEach((item) => {
    if (grouped[item.category]) grouped[item.category].push(item)
  })
  return order.map((cat) => ({ category: cat, title: CATEGORY_LABELS[cat], items: grouped[cat] }))
}

export default function MenuPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`${API_URL}/menu`)
        setSections(groupByCategory(res.data))
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement du menu')
      } finally {
        setLoading(false)
      }
    }
    fetchMenu()
  }, [])

  if (loading) {
    return (
      <div className="page menu-page">
        <section className="page-hero">
          <div className="container">
            <p className="page-tagline">Notre carte</p>
            <h1>Menu</h1>
          </div>
        </section>
        <section className="menu-content">
          <div className="container">
            <p className="menu-loading">Chargement du menu…</p>
          </div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page menu-page">
        <section className="page-hero">
          <div className="container">
            <p className="page-tagline">Notre carte</p>
            <h1>Menu</h1>
          </div>
        </section>
        <section className="menu-content">
          <div className="container">
            <p className="menu-error">{error}</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page menu-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-tagline">Notre carte</p>
          <h1>Menu</h1>
          <p className="page-hero-sub">Recettes gourmandes et généreuses</p>
        </div>
      </section>
      <section className="menu-content">
        <div className="container">
          {sections.map((section) => (
            <div key={section.category} className="menu-section">
              <h2>{section.title}</h2>
              {section.items.length === 0 ? (
                <p className="menu-empty">Aucun plat pour le moment.</p>
              ) : (
                <ul className="menu-list">
                  {section.items.map((item) => (
                    <li key={item._id} className="menu-item">
                      <div className="menu-item-info">
                        <span className="menu-item-name">{item.name}</span>
                        {item.description && (
                          <span className="menu-item-desc">{item.description}</span>
                        )}
                      </div>
                      <span className="menu-item-price">{formatFCFA(item.price)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <p className="menu-note">
            Menu susceptible d'évoluer selon le marché. N'hésitez pas à nous demander les suggestions du jour.
          </p>
        </div>
      </section>
    </div>
  )
}
