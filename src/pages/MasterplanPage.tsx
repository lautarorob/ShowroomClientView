import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, TopBarButton } from '../components/Layout'
import { SpinView } from '../components/SpinView'
import { useProject } from '../components/projectContextBase'
import { IconExpand, IconImages, IconQuote } from '../components/Icons'
import type { StopPoint } from '../types'

type Mode = 'project' | 'availability'

/**
 * Masterplan: interactive building exterior with the 360 stop points,
 * project/availability mode switch, zoom and quick links.
 */
export function MasterplanPage() {
  const { project, availabilityMap } = useProject()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('project')
  const [zoom, setZoom] = useState(1)
  const [enterHint, setEnterHint] = useState(false)
  const hideHintTimer = useRef<number | null>(null)
  const layerRef = useRef<HTMLDivElement>(null)

  const stopPoints: StopPoint[] = useMemo(
    () => project.projectStructure.spin360?.stopPoints ?? [],
    [project.projectStructure.spin360],
  )

  const counts = useMemo(() => {
    let available = 0
    let reserved = 0
    let sold = 0
    availabilityMap.forEach((u) => {
      if (u.availabilityStatus === 'AVAILABLE') available++
      else if (u.availabilityStatus === 'RESERVED') reserved++
      else sold++
    })
    return { available, reserved, sold }
  }, [availabilityMap])

  const onSvgClick = (id: string) => {
    // Clicking the tower polygon or the marker jumps to the floors view.
    if (id === 'tower' || id === 'marker') navigate('/topview')
  }

  const showEnterHint = () => {
    if (hideHintTimer.current != null) {
      window.clearTimeout(hideHintTimer.current)
      hideHintTimer.current = null
    }
    setEnterHint(true)
  }

  const hideEnterHint = () => {
    if (hideHintTimer.current != null) window.clearTimeout(hideHintTimer.current)
    hideHintTimer.current = window.setTimeout(() => setEnterHint(false), 160)
  }

  const onSvgHover = (id: string | null) => {
    if (id === 'marker') showEnterHint()
    else hideEnterHint()
  }

  return (
    <Layout
      title="El edificio"
      topbarLeft={
        <div className="segmented" role="tablist" aria-label="Modo de vista">
          <button
            type="button"
            role="tab"
            className={mode === 'project' ? 'is-active' : ''}
            aria-selected={mode === 'project'}
            onClick={() => setMode('project')}
          >
            Proyecto
          </button>
          <button
            type="button"
            role="tab"
            className={mode === 'availability' ? 'is-active' : ''}
            aria-selected={mode === 'availability'}
            onClick={() => setMode('availability')}
          >
            Disponibilidad
          </button>
        </div>
      }
      topbarRight={
        <>
          <TopBarButton label="Galería" onClick={() => navigate('/gallery')}>
            <IconImages />
          </TopBarButton>
          <TopBarButton label="Cotizar" onClick={() => navigate('/quote')}>
            <IconQuote />
          </TopBarButton>
          <TopBarButton
            label="Pantalla completa"
            onClick={() => {
              if (document.fullscreenElement) document.exitFullscreen()
              else document.documentElement.requestFullscreen()
            }}
          >
            <IconExpand />
          </TopBarButton>
        </>
      }
    >
      <div
        ref={layerRef}
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.25s ease',
        }}
      >
        <SpinView
          stopPoints={stopPoints}
          onSvgElementClick={onSvgClick}
          onSvgElementHover={onSvgHover}
        />
      </div>

      {enterHint && (
        <button type="button" className="enter-hint" onClick={() => navigate('/topview')}>
          Ingresar al edificio
        </button>
      )}

      <div className="zoom-controls">
        <button type="button" aria-label="Acercar" onClick={() => setZoom((z) => Math.min(z + 0.2, 2.4))}>
          +
        </button>
        <button type="button" aria-label="Alejar" onClick={() => setZoom((z) => Math.max(z - 0.2, 1))}>
          −
        </button>
      </div>

      {mode === 'project' ? (
        <div className="masterplan-hint">Toca el edificio para ver las plantas</div>
      ) : (
        <div className="legend-panel" aria-label="Leyenda de disponibilidad">
          <h4>Disponibilidad</h4>
          <div className="legend-row">
            <span className="legend-row__dot" style={{ background: '#1ac366' }} />
            Disponible
            <strong>{counts.available}</strong>
          </div>
          <div className="legend-row">
            <span className="legend-row__dot" style={{ background: '#deca6e' }} />
            Reservado
            <strong>{counts.reserved}</strong>
          </div>
          <div className="legend-row">
            <span className="legend-row__dot" style={{ background: '#de7777' }} />
            Vendido
            <strong>{counts.sold}</strong>
          </div>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            style={{ width: '100%', marginTop: 10 }}
            onClick={() => navigate('/availability')}
          >
            Ver unidades
          </button>
        </div>
      )}
    </Layout>
  )
}
