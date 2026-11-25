import { useState } from 'react'
import { Layout } from '../components/Layout'
import { useProject } from '../components/projectContextBase'
import { Gallery } from '../components/Gallery'
import type { GalleryItem } from '../types'
import { asset } from '../data'
import { IconRotate360 } from '../components/Icons'

/**
 * Amenities: photo grid of common areas plus the list of 360° tours.
 */
export function AmenitiesPage() {
  const { project } = useProject()
  const gallery: GalleryItem[] = project.amenitiesPage?.gallery ?? []
  const tours = project.amenitiesPage?.tours360 ?? []
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
  const [activeTour, setActiveTour] = useState<string | null>(null)

  if (activeTour) {
    return (
      <Layout title="Amenities">
        <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
          <iframe
            className="tour-frame"
            src={`https://www.phbalcony.com${activeTour}`}
            title="Tour 360"
            allow="fullscreen; gyroscope; accelerometer"
            allowFullScreen
          />
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 30 }}
            onClick={() => setActiveTour(null)}
          >
            Cerrar tour
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Amenities">
      <div className="page-scroll">
        <div className="page-scroll__inner">
          <h1 className="page-heading">Amenities</h1>
          <p className="page-subheading">
            Piscina, crossfit, pet garden, coworking y rooftops de Terrazy. Toca una
            foto para verla en pantalla completa.
          </p>

          <div className="card-grid">
            {gallery.map((item, i) => (
              <button
                key={item.imgUrl + i}
                type="button"
                className="media-card"
                onClick={() => setGalleryIndex(i)}
              >
                <img src={asset(item.imgUrl)} alt={item.labelText ?? ''} loading="lazy" />
                {item.labelText && (
                  <span className="media-card__label">{item.labelText}</span>
                )}
              </button>
            ))}
          </div>

          {tours.length > 0 && (
            <>
              <h2 className="page-heading" style={{ marginTop: 36, fontSize: '1.125rem' }}>
                Recorridos 360°
              </h2>
              <div className="card-grid" style={{ marginTop: 14 }}>
                {tours.map((tour) => (
                  <button
                    key={tour.tour360Url}
                    type="button"
                    className="media-card"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1D2939' }}
                    onClick={() => setActiveTour(tour.tour360Url)}
                  >
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 10,
                        color: '#fff',
                        padding: 16,
                        textAlign: 'center',
                      }}
                    >
                      <IconRotate360 width={34} height={34} />
                      {tour.labelText}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {galleryIndex != null && (
        <div className="modal-backdrop" role="presentation" onClick={() => setGalleryIndex(null)}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={(e) => e.stopPropagation()}>
            <Gallery
              items={gallery}
              initialIndex={galleryIndex}
              onClose={() => setGalleryIndex(null)}
            />
          </div>
        </div>
      )}
    </Layout>
  )
}
