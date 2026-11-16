import { useState } from 'react'
import { Layout } from '../components/Layout'
import { useProject } from '../components/projectContextBase'
import type { Tour360Item } from '../types'

/**
 * General 360° tours: a selector plus a fullscreen iframe player,
 * matching the original "/tour360" experience.
 */
export function Tour360Page() {
  const { project } = useProject()

  const tours: Tour360Item[] = project.projectStructure.generalTour360Gallery ?? []
  const exterior = project.projectStructure.exteriorTour360
  const all: Tour360Item[] = exterior
    ? [{ tour360Url: exterior.tour360Url, labelText: 'Tour exterior' }, ...tours]
    : tours

  const [selected, setSelected] = useState(0)
  const current = all[selected]

  if (!current) {
    return (
      <Layout title="Recorridos">
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <p style={{ color: '#98A2B3' }}>No hay recorridos disponibles.</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Recorridos 360°">
      <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
        <iframe
          key={current.tour360Url}
          className="tour-frame"
          src={`https://www.phbalcony.com${current.tour360Url}`}
          title={current.labelText}
          allow="fullscreen; gyroscope; accelerometer"
          allowFullScreen
        />

        {all.length > 1 && (
          <div className="tour-selector">
            <select
              value={selected}
              onChange={(e) => setSelected(Number(e.target.value))}
              aria-label="Seleccionar recorrido"
            >
              {all.map((t, i) => (
                <option key={t.tour360Url} value={i}>
                  {t.labelText}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </Layout>
  )
}
