import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout, TopBarButton } from '../components/Layout'
import { useProject } from '../components/projectContextBase'
import { UnitCard, UnitDetailModal } from '../components/UnitDetail'
import { fetchSvgSource, statusColor } from '../data'
import type { Level, UnitContext } from '../types'
import { IconImages } from '../components/Icons'
import { asset } from '../data'

/** Cursor anchor (relative to the plan container) for the hover/pinned card. */
interface Anchor {
  unitId: number
  x: number
  y: number
}

/** Ignore a new hover target for this long after anchoring, so the card stays
 *  reachable while the pointer travels down towards it. */
const HOVER_SETTLE_MS = 400
const CARD_GAP = 20
const CARD_MARGIN = 12
const TOPBAR_RESERVE = 80
const SCRUBBER_RESERVE = 88

/**
 * Topview ("Plantas"): scrub between building levels, render the level's
 * interactive SVG floor plan with availability colours and open unit popups.
 */
export function TopviewPage() {
  const { project, availabilityMap } = useProject()
  const navigate = useNavigate()

  const levels: Level[] = useMemo(() => {
    const towers = project.projectStructure.cluster?.towers ?? []
    return towers.flatMap((t) => t.cluster?.levels ?? [])
  }, [project.projectStructure])

  const [levelIndex, setLevelIndex] = useState(() => {
    const idx = levels.findIndex((l) => /^\d+$/.test(l.levelSlug))
    return idx >= 0 ? idx : 0
  })
  // SVG source cached per level slug; missing key = still loading.
  const [svgByLevel, setSvgByLevel] = useState<Record<string, string>>({})
  const [hoverAnchor, setHoverAnchor] = useState<Anchor | null>(null)
  const [pinnedAnchor, setPinnedAnchor] = useState<Anchor | null>(null)
  const [detailUnitId, setDetailUnitId] = useState<number | null>(null)
  // Measured card placement for the current anchor (keeps it inside the view).
  const [cardPos, setCardPos] = useState<{ key: string; left: number; top: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const settleAtRef = useRef(0)

  const level = levels[levelIndex]
  const svgSource = level ? (svgByLevel[level.levelSlug] ?? '') : ''

  const unitBySvgId = useMemo(() => {
    const map = new Map<string, UnitContext>()
    if (!level) return map
    const tower = project.projectStructure.cluster?.towers?.[0]
    if (!tower) return map
    for (const unit of level.cluster?.units ?? []) {
      const key = unit.svgTargetElementId ?? unit.unitSlug
      map.set(key, {
        unit,
        level,
        tower,
        availability: availabilityMap.get(unit.unitId),
      })
    }
    return map
  }, [level, availabilityMap, project.projectStructure])

  const anchor = hoverAnchor ?? pinnedAnchor
  const anchorUnitId = anchor?.unitId ?? null
  const anchorKey = anchor ? `${anchor.unitId}:${anchor.x}:${anchor.y}` : ''
  const cardUnit = useMemo(
    () => findByUnitId(unitBySvgId, anchorUnitId),
    [unitBySvgId, anchorUnitId],
  )
  const detailUnit = useMemo(
    () => findByUnitId(unitBySvgId, detailUnitId),
    [unitBySvgId, detailUnitId],
  )
  const livePos = cardPos && cardPos.key === anchorKey ? cardPos : null

  // Load + colour the SVG whenever the level changes; cache per slug so the
  // effect never needs to clear state synchronously. (No in-flight guard:
  // React StrictMode double-invokes effects and a ref-based guard would
  // swallow the second run after the first one was cancelled.)
  useEffect(() => {
    if (!level?.swipeSvgUrl) return
    const slug = level.levelSlug
    if (svgByLevel[slug] !== undefined) return
    let alive = true
    const unitsAtLoad = unitBySvgId
    fetchSvgSource(level.swipeSvgUrl).then((src) => {
      if (alive) {
        setSvgByLevel((prev) => ({ ...prev, [slug]: colourSvg(src, unitsAtLoad) }))
      }
    })
    return () => {
      alive = false
    }
  }, [level, unitBySvgId, svgByLevel])

  // Keep the card inside the viewport: below-right of the cursor, flipping
  // above it near the bottom and clear of the top bar / level scrubber.
  useLayoutEffect(() => {
    const card = cardRef.current
    const box = containerRef.current
    if (!card || !box || !anchor) return
    const w = card.offsetWidth
    const h = card.offsetHeight
    const maxX = Math.max(CARD_MARGIN, box.clientWidth - w - CARD_MARGIN)
    const left = Math.round(Math.min(Math.max(anchor.x, CARD_MARGIN), maxX))
    const minTop = TOPBAR_RESERVE
    const maxTop = Math.max(minTop, box.clientHeight - SCRUBBER_RESERVE - h)
    let top = anchor.y + CARD_GAP
    if (top + h > box.clientHeight - SCRUBBER_RESERVE) top = anchor.y - h - CARD_GAP
    top = Math.round(Math.min(Math.max(top, minTop), maxTop))
    setCardPos((prev) =>
      prev && prev.key === anchorKey && prev.left === left && prev.top === top
        ? prev
        : { key: anchorKey, left, top },
    )
  }, [anchor, anchorKey])

  /** Resolve the unit polygon (or group) under the pointer, bounded to the plan. */
  const unitAt = (target: EventTarget | null): UnitContext | undefined => {
    const node = (target as Element | null)?.closest?.('[id]')
    const box = containerRef.current
    if (!node || !box || !box.contains(node)) return undefined
    return unitBySvgId.get(node.id)
  }

  const planCoords = (e: ReactMouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onPlanMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (cardRef.current?.contains(e.target as Node)) return
    const ctx = unitAt(e.target)
    if (!ctx) {
      setHoverAnchor(null)
      return
    }
    if (hoverAnchor?.unitId === ctx.unit.unitId) return
    const now = performance.now()
    if (hoverAnchor && now - settleAtRef.current < HOVER_SETTLE_MS) return
    settleAtRef.current = now
    setHoverAnchor({ unitId: ctx.unit.unitId, ...planCoords(e) })
  }

  const onPlanClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (cardRef.current?.contains(e.target as Node)) return
    const ctx = unitAt(e.target)
    if (!ctx) return
    const coords = planCoords(e)
    // Click pins the card under the cursor; clicking the same unit unpins it.
    setPinnedAnchor((prev) =>
      prev?.unitId === ctx.unit.unitId ? null : { unitId: ctx.unit.unitId, ...coords },
    )
  }

  const closeCard = () => {
    setHoverAnchor(null)
    setPinnedAnchor(null)
  }

  if (!level) return <Layout title="Plantas" />

  return (
    <Layout
      title={`Planta ${level.displayName}`}
      topbarRight={
        <TopBarButton label="Galería" onClick={() => navigate('/gallery')}>
          <IconImages />
        </TopBarButton>
      }
    >
      {level.swipeImgUrl && (
        <img
          src={asset(level.swipeImgUrl)}
          alt=""
          draggable={false}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {svgSource && (
        <div
          ref={containerRef}
          style={{ position: 'absolute', inset: 0 }}
          onMouseMove={onPlanMove}
          onMouseLeave={() => setHoverAnchor(null)}
          onClick={onPlanClick}
        >
          <div
            style={{ position: 'absolute', inset: 0 }}
            dangerouslySetInnerHTML={{
              __html: svgSource.replace(
                /<svg([^>]*)>/i,
                '<svg$1 preserveAspectRatio="xMidYMid slice" style="width:100%;height:100%;display:block"',
              ),
            }}
          />
          {anchor && cardUnit && (
            <UnitCard
              ref={cardRef}
              ctx={cardUnit}
              style={{
                left: livePos?.left ?? anchor.x,
                top: livePos?.top ?? anchor.y + CARD_GAP,
                bottom: 'auto',
                right: 'auto',
                maxWidth: 'min(320px, calc(100vw - 24px))',
                visibility: livePos ? 'visible' : 'hidden',
              }}
              onClose={closeCard}
              onDetail={() => setDetailUnitId(cardUnit.unit.unitId)}
            />
          )}
        </div>
      )}

      <nav className="level-scrubber" aria-label="Selector de planta">
        <div className="level-scrubber__list">
          {levels.map((l, i) => (
            <button
              key={l.levelId}
              type="button"
              className={`level-chip${i === levelIndex ? ' is-active' : ''}${
                !/^\d+$/.test(l.levelSlug) ? ' is-amenities' : ''
              }`}
              aria-current={i === levelIndex}
              onClick={() => {
                setLevelIndex(i)
                closeCard()
                setDetailUnitId(null)
              }}
            >
              {l.displayName}
            </button>
          ))}
        </div>
      </nav>

      {detailUnit && <UnitDetailModal ctx={detailUnit} onClose={() => setDetailUnitId(null)} />}
    </Layout>
  )
}

function findByUnitId(
  map: Map<string, UnitContext>,
  unitId: number | null,
): UnitContext | undefined {
  if (unitId == null) return undefined
  for (const ctx of map.values()) {
    if (ctx.unit.unitId === unitId) return ctx
  }
  return undefined
}

/** Apply availability colours to unit polygons inside the level SVG. */
function colourSvg(src: string, units: Map<string, UnitContext>): string {
  let out = src
  units.forEach((ctx, key) => {
    const fill = ctx.availability
      ? statusColor(ctx.availability.availabilityStatus)
      : '#3159ff'
    const re = new RegExp(
      `(<(polygon|polyline|path|rect|circle)[^>]*\\sid="${escapeRegExp(key)}"[^>]*>)`,
      'g',
    )
    out = out.replace(re, (tag) => {
      // Inline style wins over the SVG stylesheet rules (e.g. .cls-2{fill:#3159ff}).
      if (/\sstyle=/.test(tag)) {
        return tag.replace(/style="([^"]*)"/, (_m, s: string) => `style="${s};fill:${fill}"`)
      }
      return tag.replace(/(\s*\/?>)$/, ` style="fill:${fill}"$1`)
    })
  })
  return out
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
