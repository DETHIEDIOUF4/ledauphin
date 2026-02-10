import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Le Restaurant Dauphin</Link>
          <p className="footer-tagline">Gourmand et raffiné</p>
        </div>
        <div className="footer-quote">
          <blockquote>
            « Le bonheur le plus doux est celui que l'on partage. »
          </blockquote>
        </div>
        <div className="footer-contact">
          <h3>Nous contacter</h3>
          <p className="footer-address">En bord de mer — Venez nous rendre visite</p>
          <p className="footer-hours">Ouvert en continu du lundi au dimanche, à partir de 10 heures</p>
          <Link to="/contact" className="footer-link">Contact & plan</Link>
          <div className="footer-social">
            <span>Réseaux sociaux :</span>
            <a href="https://www.instagram.com/lerestaurantdauphin" target="_blank" rel="noreferrer" className="footer-social-link footer-social-link--instagram">
              <span className="footer-social-icon footer-social-icon--instagram" aria-hidden="true" />
              <span>Instagram</span>
            </a>
            <a href="https://www.tiktok.com/@lerestaurantdauphin" target="_blank" rel="noreferrer" className="footer-social-link footer-social-link--tiktok">
              <span className="footer-social-icon footer-social-icon--tiktok" aria-hidden="true" />
              <span>TikTok</span>
            </a>
            <a href="https://www.youtube.com/@lerestaurantdauphin" target="_blank" rel="noreferrer" className="footer-social-link footer-social-link--youtube">
              <span className="footer-social-icon footer-social-icon--youtube" aria-hidden="true" />
              <span>YouTube</span>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Le Restaurant Dauphin</p>
          <p className="footer-credit">
            Designed by{' '}
            <a href="https://dioufdethie.netlify.app/" target="_blank" rel="noreferrer noopener">
              DDEv
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
