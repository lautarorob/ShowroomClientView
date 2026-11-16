import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { StopPoint } from '../types'
import { asset, fetchSvgSource } from '../data'
import { IconChevronLeft, IconChevronRight } from './Icons'

interface SpinViewProps {
  stopPoints: StopPoint[]
  initialIndex?: number
  /** Called with the SVG source of the active stop point (for interactive overlays). */
  onSvgReady?: (svgSource: string, stopPoint: StopPoint) => void
  /** Called when the active stop point changes. */
  onIndexChange?: (index: number) => void
  /** Click handler bound by element id inside the SVG overlay. */
  onSvgElementClick?: (elementId: string) => void
  /** Hover handler bound by element id inside the SVG overlay (null when none). */
  onSvgElementHover?: (elementId: string | null) => void
  /** When false the SVG overlay is inert and the marker circle is hidden. */
  interactive?: boolean
  children?: ReactNode
}

/**
 * Full-viewport background that rotates between project stop points,
 * mimicking the original site's drag-to-rotate 360 intro/masterplan.
 */
export function SpinView({
  stopPoints,
  initialIndex = 0,
  onSvgReady,
  onIndexChange,
  onSvgElementClick,
  onSvgElementHover,
  interactive = true,
  children,
}: SpinViewProps) {
  const [index, setIndex] = useState(initialIndex)
  const [svgs, setSvgs] = useState<Record<string, string>>({})
  const dragStart = useRef<number | null>(null)
  const svgCallbacks = useRef(onSvgReady)

  useEffect(() => {
    svgCallbacks.current = onSvgReady
  }, [onSvgReady])

  const goTo = useCallback(
    (next: number) => {
      const clamped = (next + stopPoints.length) % stopPoints.length
      setIndex(clamped)
      onIndexChange?.(clamped)
    },
    [stopPoints.length, onIndexChange],
  )

  // Preload SVG overlays for all stop points.
  useEffect(() => {
    let cancelled = false
    stopPoints.forEach((sp) => {
      if (!sp.backgroundSvgUrl || svgs[sp.stopPointSlug]) return
      fetchSvgSource(sp.backgroundSvgUrl).then((src) => {
        if (!cancelled) setSvgs((prev) => ({ ...prev, [sp.stopPointSlug]: src }))
      })
    })
    return () => {
      cancelled = true
    }
  }, [stopPoints, svgs])

  // Notify parent when the active SVG becomes available.
  useEffect(() => {
    const sp = stopPoints[index]
    if (!sp) return
    const src = svgs[sp.stopPointSlug]
    if (src) svgCallbacks.current?.(src, sp)
  }, [index, svgs, stopPoints])

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = e.clientX
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStart.current == null) return
    const dx = e.clientX - dragStart.current
    dragStart.current = null
    if (Math.abs(dx) > 60) {
      goTo(index + (dx < 0 ? 1 : -1))
    }
  }

  const handleSvgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSvgElementClick) return
    const target = (e.target as Element).closest('[id]')
    if (target?.id) onSvgElementClick(target.id)
  }

  const svgIdOf = (node: EventTarget | null): string | null =>
    node instanceof Element ? (node.closest('[id]')?.id ?? null) : null

  const handleSvgOver = (e: React.MouseEvent<HTMLDivElement>) => {
    onSvgElementHover?.(svgIdOf(e.target))
  }

  const handleSvgOut = (e: React.MouseEvent<HTMLDivElement>) => {
    const from = svgIdOf(e.target)
    const to = svgIdOf(e.relatedTarget)
    if (from !== to) onSvgElementHover?.(to)
  }

  return (
    <div
      className={`spin-view${interactive ? '' : ' spin-view--static'}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') goTo(index + 1)
        if (e.key === 'ArrowLeft') goTo(index - 1)
      }}
      role="region"
      aria-label="Vista 360 del proyecto"
    >
      {stopPoints.map((sp, i) => (
        <div
          key={sp.stopPointSlug}
          className={`spin-view__layer${i === index ? ' is-active' : ''}`}
          aria-hidden={i !== index}
        >
          <img className="spin-view__img" src={asset(sp.backgroundImgUrl)} alt="" draggable={false} />
          {svgs[sp.stopPointSlug] && (
            <div
              className="spin-view__svg"
              onClick={handleSvgClick}
              onMouseOver={handleSvgOver}
              onMouseOut={handleSvgOut}
              dangerouslySetInnerHTML={{
                __html: svgs[sp.stopPointSlug].replace(
                  /<svg([^>]*)>/i,
                  '<svg$1 preserveAspectRatio="xMidYMid slice">',
                ),
              }}
            />
          )}
        </div>
      ))}

      {stopPoints.length > 1 && (
        <div className="spin-view__nav">
          <button
            type="button"
            className="spin-view__arrow"
            aria-label="Anterior"
            onClick={() => goTo(index - 1)}
          >
            <IconChevronLeft />
          </button>
          <div className="spin-view__dots">
            {stopPoints.map((sp, i) => (
              <button
                key={sp.stopPointSlug}
                type="button"
                className={`spin-view__dot${i === index ? ' is-active' : ''}`}
                aria-label={`Vista ${i + 1}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button
            type="button"
            className="spin-view__arrow"
            aria-label="Siguiente"
            onClick={() => goTo(index + 1)}
          >
            <IconChevronRight />
          </button>
        </div>
      )}

      {children}
    </div>
  )
}
