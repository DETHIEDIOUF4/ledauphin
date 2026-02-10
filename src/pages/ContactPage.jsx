import { useState } from 'react'
import './ContactPage.css'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="page contact-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-tagline">Rendez-nous visite</p>
          <h1>Nous contacter</h1>
        </div>
      </section>
      <section className="contact-content">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>Adresse & horaires</h2>
            <p className="contact-address">
              En bord de mer — Venez nous rendre visite
            </p>
            <p className="contact-hours">
              Ouvert en continu du lundi au dimanche, à partir de 10 heures.
            </p>
            <p className="contact-phone">
              Tél. : 33 820 43 00 / 78 146 41 41
            </p>
            <p className="contact-email">
              <a href="mailto:contact@lerestaurantdauphin.com">contact@lerestaurantdauphin.com</a>
            </p>
            <div className="contact-social">
              <h3>Réseaux sociaux</h3>
              <ul className="contact-social-list">
                <li>
                  <a href="https://www.instagram.com/lerestaurantdauphin" target="_blank" rel="noreferrer">
                    <span className="contact-social-icon contact-social-icon--instagram" aria-hidden="true" />
                    <span>Instagram</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.tiktok.com/@lerestaurantdauphin" target="_blank" rel="noreferrer">
                    <span className="contact-social-icon contact-social-icon--tiktok" aria-hidden="true" />
                    <span>TikTok</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@lerestaurantdauphin" target="_blank" rel="noreferrer">
                    <span className="contact-social-icon contact-social-icon--youtube" aria-hidden="true" />
                    <span>YouTube</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="contact-form-wrap">
            <h2>Envoyer un message</h2>
            {sent ? (
              <p className="form-success">Votre message a bien été envoyé. Nous vous recontacterons rapidement.</p>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  <span>Nom</span>
                  <input type="text" name="name" required />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" required />
                </label>
                <label>
                  <span>Message</span>
                  <textarea name="message" rows="5" required />
                </label>
                <button type="submit" className="btn btn-primary">Envoyer</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
