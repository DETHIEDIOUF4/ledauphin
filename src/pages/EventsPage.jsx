import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './EventsPage.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`)
        setEvents(res.data)
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des événements')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="page events-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-tagline">Agenda</p>
          <h1>Événements</h1>
          <p className="page-hero-sub">Vivre des moments uniques au Restaurant Dauphin</p>
        </div>
      </section>
      <section className="events-content">
        <div className="container">
          {loading && <p className="events-loading">Chargement des événements…</p>}
          {error && !loading && <p className="events-error">{error}</p>}
          {!loading && !error && (
            <>
              {events.length === 0 ? (
                <p className="events-empty">Aucun événement n'est prévu pour le moment.</p>
              ) : (
                <div className="events-grid">
                  {events.map((event) => (
                    <article key={event._id} className="event-card">
                      <h2>{event.title}</h2>
                      {event.description && <p className="event-desc">{event.description}</p>}
                      {event.when && <p className="event-when">{event.when}</p>}
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
          <p className="events-cta">
            Pour réserver ou organiser un événement, <Link to="/contact" className="link-inline">contactez-nous</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
