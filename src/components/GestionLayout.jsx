import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './GestionLayout.css'

export default function GestionLayout() {
  const { auth } = useAuth()

  const navItems = [
    { to: '/gestion', end: true, label: 'Dashboard' },
    { to: '/gestion/commandes', end: false, label: 'Commandes' },
    { to: '/gestion/caisse', end: true, label: 'Caisse' },
    { to: '/gestion/utilisateurs', end: false, label: 'Utilisateurs' },
    { to: '/gestion/menu', end: false, label: 'Menu' },
    { to: '/gestion/evenements', end: false, label: 'Événements' },
  ]

  return (
    <div className="gestion-layout">
      <aside className="gestion-sidebar">
        <div className="gestion-sidebar-header">
          <h2>Espace Gestionnaire</h2>
          <p className="gestion-user">{auth?.user?.name}</p>
        </div>
        <nav className="gestion-nav">
          {navItems.map(({ to, end, label }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => (isActive ? 'gestion-nav-link active' : 'gestion-nav-link')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="gestion-main">
        <Outlet />
      </div>
    </div>
  )
}
