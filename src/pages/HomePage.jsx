import { Link } from 'react-router-dom'
import dauphin2 from '../images/dauphin2.png'
import dauphin23 from '../images/dauphin23.png'
import dauphin3 from '../images/dauphin3.png'
import dauphin20 from '../images/dauphin20.png'
import dauphinLogo from '../images/dauphinlogo.jpg'
import './HomePage.css'

export default function HomePage() {
  return (
    <div className="page home-page">
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-inner">
          <div className="hero-content hero-left">
            <div className="hero-logo-wrap">
              <img src={dauphinLogo} alt="Logo Le Restaurant Dauphin" className="hero-logo" />
            </div>
            <p className="hero-tagline">Gourmand et raffiné</p>
            <h1 className="hero-title">Le Restaurant Dauphin</h1>
            <p className="hero-subtitle">
              En bord de mer — Ouvert en continu du lundi au dimanche à partir de 10 heures
            </p>
            <div className="hero-cta">
              <Link to="/menu" className="btn btn-primary">Découvrir le menu</Link>
              <Link to="/contact" className="btn btn-secondary">Nous contacter</Link>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-gallery">
              <div className="hero-gallery-main">
                <img src={dauphin2} alt="Vue du Restaurant Dauphin" />
              </div>
              <div className="hero-gallery-thumbs">
                <img src={dauphin23} alt="Ambiance du Restaurant Dauphin" />
                <img src={dauphin3} alt="Cuisine du Restaurant Dauphin" />
                <img src={dauphin20} alt="Terrasse du Restaurant Dauphin" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="intro">
        <div className="container">
          <h2>Un havre de paix</h2>
          <p className="intro-text">
            Le Restaurant Dauphin, c'est une expérience où plaisir, partage et gourmandise se rencontrent.
            Idéalement situé en bord de mer, un lieu idéal pour vos moments de plaisir et de détente
            autour de recettes gourmandes et généreuses. Venez goûter à notre art de vivre.
          </p>
          <Link to="/a-propos" className="link-arrow">À propos de nous</Link>
        </div>
      </section>
    </div>
  )
}
