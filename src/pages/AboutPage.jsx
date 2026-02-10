import './AboutPage.css'

export default function AboutPage() {
  return (
    <div className="page about-page">
      <section className="page-hero">
        <div className="container">
          <p className="page-tagline">À propos</p>
          <h1>Notre histoire</h1>
        </div>
      </section>
      <section className="about-content">
        <div className="container about-grid">
          <div className="about-text">
            <h2>Le Restaurant Dauphin</h2>
            <p>
              Le Restaurant Dauphin, c'est une expérience où plaisir, partage et gourmandise se rencontrent.
              Idéalement situé en bord de mer, un havre de paix idéal pour vos moments de plaisir et de détente
              autour de recettes gourmandes et généreuses.
            </p>
            <p>
              Notre équipe met un point d'honneur à vous accueillir dans une atmosphère chaleureuse et raffinée.
              Chaque plat est préparé avec des produits soigneusement sélectionnés pour vous offrir le meilleur
              de la gastronomie dans un cadre unique.
            </p>
            <blockquote>
              « Le bonheur le plus doux est celui que l'on partage. »
            </blockquote>
            <p>
              Venez goûter à notre art de vivre — nous vous attendons du lundi au dimanche, à partir de 10 heures.
            </p>
          </div>
          <div className="about-image">
            <div className="about-image-placeholder" />
          </div>
        </div>
      </section>
    </div>
  )
}
