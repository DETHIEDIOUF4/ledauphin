import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import dauphinLogo from '../images/dauphinlogo.jpg'
import './Navbar.css'

export default function Navbar() {
  const { auth, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/a-propos', label: 'À propos' },
    { to: '/menu', label: 'Menu' },
    { to: '/bar', label: 'Bar' },
    { to: '/galerie', label: 'Galerie' },
    { to: '/evenements', label: 'Événements' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
          <img src={dauphinLogo} alt="Le Restaurant Dauphin" className="logo-image" />
        </Link>
        <button
          className="menu-toggle"
          aria-label="Menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>
        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          <ul>
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) => (isActive ? 'active' : '')}
                  onClick={() => setMenuOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            {auth && (
              <>
                {auth.user.role === 'gestionnaire' && (
                  <li>
                    <Link to="/gestion" onClick={() => setMenuOpen(false)}>Gestion</Link>
                  </li>
                )}
                {auth.user.role === 'agent_caisse' && (
                  <li>
                    <Link to="/caisse" onClick={() => setMenuOpen(false)}>Caisse</Link>
                  </li>
                )}
                <li>
                  <button type="button" className="btn-logout" onClick={logout}>
                    Déconnexion
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
