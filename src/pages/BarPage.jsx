import { useEffect, useState } from 'react'
import axios from 'axios'
import { formatFCFA } from '../utils/currency'
import './BarPage.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function groupBarItems(items) {
  const sections = {
    cocktails: { title: 'Cocktails signature', items: [] },
    vins: { title: 'Vins & bulles', items: [] },
    sansAlcool: { title: 'Sans alcool', items: [] },
    autres: { title: 'Autres', items: [] },
  }

  items
    .filter((item) => item.category === 'bar')
    .forEach((item) => {
      const name = item.name.toLowerCase()
      if (name.includes('spritz') || name.includes('mojito') || name.includes('almadies')) {
        sections.cocktails.items.push(item)
      } else if (
        name.includes('champagne') ||
        name.includes('vin blanc') ||
        name.includes('vin rouge') ||
        name.includes('rosé')
      ) {
        sections.vins.items.push(item)
      } else if (
        name.includes('jus de fruits') ||
        name.includes('citronnade') ||
        name.includes('café & thés') ||
        name.includes('café et thés')
      ) {
        sections.sansAlcool.items.push(item)
      } else {
        sections.autres.items.push(item)
      }
    })

  return Object.values(sections).filter((section) => section.items.length > 0)
}

export default function BarPage() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBar = async () => {
      try {
        const res = await axios.get(`${API_URL}/menu`)
        setSections(groupBarItems(res.data))
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement de la carte du bar')
      } finally {
        setLoading(false)
      }
    }
    fetchBar()
  }, [])

  return (
    <div className="page bar-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-tagline">Notre bar</p>
          <h1>Bar</h1>
          <p className="page-hero-sub">Un moment de détente en bord de mer</p>
        </div>
      </section>
      <section className="bar-content">
        <div className="container">
          {loading && <p className="bar-loading">Chargement de la carte du bar…</p>}
          {error && !loading && <p className="bar-error">{error}</p>}
          {!loading &&
            !error &&
            sections.map((cat) => (
              <div key={cat.title} className="bar-section">
                <h2>{cat.title}</h2>
                <ul className="bar-list">
                  {cat.items.map((item) => (
                    <li key={item._id} className="bar-item">
                      <div className="bar-item-info">
                        <span className="bar-item-name">{item.name}</span>
                        {item.description && (
                          <span className="bar-item-desc">{item.description}</span>
                        )}
                      </div>
                      <span className="bar-item-price">{formatFCFA(item.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
