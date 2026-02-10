import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import MenuPage from './pages/MenuPage'
import BarPage from './pages/BarPage'
import EventsPage from './pages/EventsPage'
import ContactPage from './pages/ContactPage'
import GalleryPage from './pages/GalleryPage'
import LoginPage from './pages/LoginPage'
import DashboardCaisse from './pages/DashboardCaisse'
import ProtectedRoute from './components/ProtectedRoute'
import GestionLayout from './components/GestionLayout'
import CaisseLayout from './components/CaisseLayout'
import GestionDashboard from './pages/gestion/GestionDashboard'
import GestionCommandes from './pages/gestion/GestionCommandes'
import GestionUtilisateurs from './pages/gestion/GestionUtilisateurs'
import GestionMenu from './pages/gestion/GestionMenu'
import GestionEvenements from './pages/gestion/GestionEvenements'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/bar" element={<BarPage />} />
          <Route path="/galerie" element={<GalleryPage />} />
          <Route path="/evenements" element={<EventsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/gestion"
            element={
              <ProtectedRoute allowedRoles={['gestionnaire']}>
                <GestionLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<GestionDashboard />} />
            <Route path="commandes" element={<GestionCommandes />} />
            <Route path="caisse" element={<DashboardCaisse />} />
            <Route path="utilisateurs" element={<GestionUtilisateurs />} />
            <Route path="menu" element={<GestionMenu />} />
            <Route path="evenements" element={<GestionEvenements />} />
          </Route>
          <Route
            path="/caisse"
            element={
              <ProtectedRoute allowedRoles={['agent_caisse', 'gestionnaire']}>
                <CaisseLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardCaisse />} />
            <Route path="commandes" element={<GestionCommandes />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
