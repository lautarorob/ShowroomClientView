import { useState } from 'react'
import { Layout } from '../components/Layout'
import { useProject } from '../components/projectContextBase'
import { Gallery } from '../components/Gallery'
import type { GalleryItem } from '../types'

type Source = 'project' | 'availability'

/**
 * Gallery: switch between the project photo gallery and the
 * availability plan diagrams.
 */
export function GalleryPage() {
  const { project } = useProject()
  const [source, setSource] = useState<Source>('project')

  const projectGallery: GalleryItem[] = project.projectStructure.gallery ?? []
  const availabilityGallery: GalleryItem[] = project.projectStructure.availabilityGallery ?? []
  const items = source === 'project' ? projectGallery : availabilityGallery

  return (
    <Layout>
      <div style={{ position: 'absolute', inset: 0, background: '#101010' }}>
        <div
          className="segmented"
          style={{ position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 30 }}
          role="tablist"
          aria-label="Origen de galería"
        >
          <button
            type="button"
            role="tab"
            className={source === 'project' ? 'is-active' : ''}
            aria-selected={source === 'project'}
            onClick={() => setSource('project')}
          >
            Proyecto
          </button>
          <button
            type="button"
            role="tab"
            className={source === 'availability' ? 'is-active' : ''}
            aria-selected={source === 'availability'}
            onClick={() => setSource('availability')}
          >
            Disponibilidad
          </button>
        </div>
        <Gallery key={source} items={items} />
      </div>
    </Layout>
  )
}
