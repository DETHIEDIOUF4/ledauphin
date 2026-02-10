import { useEffect, useState } from 'react'
import './GalleryPage.css'
import dauphin2 from '../images/dauphin2.png'
import dauphin23 from '../images/dauphin23.png'
import dauphin3 from '../images/dauphin3.png'
import dauphin20 from '../images/dauphin20.png'
import dauphinaccueil from '../images/dauphinaccueil.png'
import dauphinphoto from '../images/dauphinphoto.jpg'

const images = [
  { src: dauphin2, alt: 'Vue du restaurant en bord de mer' },
  { src: dauphin23, alt: 'Ambiance en terrasse au Dauphin' },
  { src: dauphin3, alt: 'Dressage de plat gourmand' },
  { src: dauphin20, alt: 'Table dressée pour le service' },
  { src: dauphinaccueil, alt: 'Accueil du Restaurant Dauphin' },
  { src: dauphinphoto, alt: 'Moment de convivialité au Dauphin' },
]

export default function GalleryPage() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const goTo = (index) => {
    setCurrent(index)
  }

  const next = () => {
    setCurrent((prev) => (prev + 1) % images.length)
  }

  const prev = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="page gallery-page">
      <section className="page-hero gallery-hero">
        <div className="container">
          <p className="page-tagline">En images</p>
          <h1>Galerie</h1>
        </div>
      </section>
      <section className="gallery-content">
        <div className="container">
          <div className="gallery-slider">
            <button type="button" className="gallery-arrow gallery-arrow-left" onClick={prev} aria-label="Image précédente">
              ‹
            </button>
            <div className="gallery-main">
              {images.map((img, index) => (
                <figure
                  key={img.alt}
                  className={`gallery-main-item ${index === current ? 'is-active' : ''}`}
                >
                  <img src={img.src} alt={img.alt} />
                </figure>
              ))}
            </div>
            <button type="button" className="gallery-arrow gallery-arrow-right" onClick={next} aria-label="Image suivante">
              ›
            </button>
          </div>
          <div className="gallery-thumbs">
            {images.map((img, index) => (
              <button
                key={img.alt}
                type="button"
                className={`gallery-thumb ${index === current ? 'active' : ''}`}
                onClick={() => goTo(index)}
              >
                <img src={img.src} alt={img.alt} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}


