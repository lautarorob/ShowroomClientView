import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Layout } from '../components/Layout'
import { useProject } from '../components/projectContextBase'
import { asset, parseLatLng } from '../data'
import { IconCopy } from '../components/Icons'

/**
 * Location: interactive map (Leaflet) with project marker + POI list,
 * address copy action and the long-form location details.
 */
export function LocationPage() {
  const { project } = useProject()
  const location = project.location
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerRefs = useRef<Record<number, L.Marker>>({})
  const [copied, setCopied] = useState(false)

  const center = parseLatLng(location.latLng || '9.0, -79.5')
  const pois = (location.interactiveMapReferencePoints ?? []).filter((p) => p.isActive)
  const address = location.infoWindowContentLines?.join(', ') ?? ''

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center,
      zoom: 15,
      scrollWheelZoom: false,
    })
    mapInstance.current = map

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    const markerIcon = L.icon({
      iconUrl: location.mapMarkerImgUrl
        ? asset(location.mapMarkerImgUrl)
        : 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconSize: [38, 48],
      iconAnchor: [19, 44],
      popupAnchor: [0, -40],
    })

    L.marker(center, { icon: markerIcon })
      .addTo(map)
      .bindPopup(address || 'PH Balcony')

    for (const poi of pois) {
      const lat = Number(poi.latitude)
      const lng = Number(poi.longitude)
      if (Number.isNaN(lat) || Number.isNaN(lng)) continue
      const m = L.circleMarker([lat, lng], {
        radius: 7,
        color: '#fff',
        weight: 2,
        fillColor: '#996633',
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup(poi.displayName)
      markerRefs.current[poi.id] = m as unknown as L.Marker
    }

    return () => {
      map.remove()
      mapInstance.current = null
      markerRefs.current = {}
    }
    // Mount once; POI/marker updates are handled imperatively below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const flyToPoi = (id: number) => {
    const poi = pois.find((p) => p.id === id)
    if (!poi || !mapInstance.current) return
    const lat = Number(poi.latitude)
    const lng = Number(poi.longitude)
    mapInstance.current.flyTo([lat, lng], 16, { duration: 0.8 })
    markerRefs.current[id]?.openPopup()
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <Layout title="Ubicación">
      <div className="location">
        <div className="location__map" ref={mapRef} role="application" aria-label="Mapa de ubicación" />

        <aside className="location__panel" aria-label="Detalles de ubicación">
          <div className="location__address">
            <h2>{address || 'Hato Pintado, Panamá'}</h2>
            <button
              type="button"
              className="location__copy"
              aria-label="Copiar dirección"
              title={copied ? 'La dirección fue copiada al portapapeles' : 'Copiar dirección'}
              onClick={copyAddress}
            >
              <IconCopy />
            </button>
          </div>

          {pois.length > 0 && (
            <>
              <span className="filter-group__label">Puntos de interés</span>
              <ul className="poi-list">
                {pois.map((poi) => (
                  <li key={poi.id}>
                    <button type="button" onClick={() => flyToPoi(poi.id)}>
                      <span className="poi-list__marker" />
                      {poi.displayName}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {location.additionalDetails?.longRichText && (
            <div
              className="location__details"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(location.additionalDetails.longRichText),
              }}
            />
          )}
        </aside>
      </div>

      {copied && <div className="toast">La dirección fue copiada al portapapeles</div>}
    </Layout>
  )
}

/** Strip scripts/event handlers from the CMS-provided rich text. */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/\son\w+='[^']*'/gi, '')
}
