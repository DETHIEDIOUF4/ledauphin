import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './GestionLayout.css'

export default function CaisseLayout() {
  const { auth } = useAuth()

  const navItems = [
    { to: '/caisse', end: true, label: 'Caisse' },
    { to: '/caisse/commandes', end: false, label: 'Commandes' },
  ]

  return (
    <div className="gestion-layout">
      <aside className="gestion-sidebar">
        <div className="gestion-sidebar-header">
          <h2>Espace Caisse</h2>
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
