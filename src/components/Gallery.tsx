import { useState } from 'react'
import type { GalleryItem } from '../types'
import { asset } from '../data'
import { IconChevronLeft, IconChevronRight } from './Icons'

interface GalleryProps {
  items: GalleryItem[]
  initialIndex?: number
  onClose?: () => void
  counter?: boolean
}

export function Gallery({ items, initialIndex = 0, onClose, counter = true }: GalleryProps) {
  const [index, setIndex] = useState(initialIndex)

  if (items.length === 0) {
    return (
      <div className="gallery">
        <div className="gallery__stage">
          <p style={{ color: '#98A2B3' }}>Esta galería todavía no tiene contenido</p>
        </div>
        {onClose && (
          <div style={{ position: 'absolute', top: 16, right: 16 }}>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar">
              ✕
            </button>
          </div>
        )}
      </div>
    )
  }

  const item = items[index]
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length)
  const next = () => setIndex((i) => (i + 1) % items.length)

  return (
    <div className="gallery" role="region" aria-label="Galería de imágenes">
      <div className="gallery__stage">
        <img key={item.imgUrl} className="gallery__img" src={asset(item.imgUrl)} alt={item.labelText ?? ''} />
        {items.length > 1 && (
          <>
            <button
              type="button"
              className="gallery__arrow gallery__arrow--prev"
              aria-label="Anterior"
              onClick={prev}
            >
              <IconChevronLeft />
            </button>
            <button
              type="button"
              className="gallery__arrow gallery__arrow--next"
              aria-label="Siguiente"
              onClick={next}
            >
              <IconChevronRight />
            </button>
          </>
        )}
        {item.labelText && <div className="gallery__caption">{item.labelText}</div>}
        {counter && items.length > 1 && (
          <div className="gallery__counter">
            {index + 1} / {items.length}
          </div>
        )}
        {onClose && (
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 6 }}>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar galería">
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
