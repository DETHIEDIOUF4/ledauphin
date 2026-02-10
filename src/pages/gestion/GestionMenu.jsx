import MenuManager from '../../components/MenuManager'
import '../../pages/Dashboard.css'

export default function GestionMenu() {
  return (
    <div className="gestion-page">
      <h1>Gestion du menu</h1>
      <p className="gestion-page-desc">Ajoutez, modifiez ou supprimez les plats de la carte.</p>
      <MenuManager />
    </div>
  )
}