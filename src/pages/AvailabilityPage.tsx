import { useMemo, useState } from 'react'
import { Layout, TopBarButton } from '../components/Layout'
import { useProject } from '../components/projectContextBase'
import { UnitDetailModal } from '../components/UnitDetail'
import {
  allUnitContexts,
  asset,
  formatPrice,
  statusColor,
  statusLabel,
} from '../data'
import type { UnitContext } from '../types'
import { IconQuote } from '../components/Icons'
import { useNavigate } from 'react-router-dom'

type StatusFilter = 'ALL' | 'AVAILABLE' | 'RESERVED' | 'SOLD'

/**
 * Availability: filterable unit list (bedrooms / area / status) with
 * a stage preview and the shared unit detail dialog.
 */
export function AvailabilityPage() {
  const { project, availability } = useProject()
  const navigate = useNavigate()

  const contexts = useMemo(
    () => allUnitContexts(project.projectStructure.cluster?.towers ?? [], availability),
    [project.projectStructure, availability],
  )

  const [beds, setBeds] = useState<number | null>(null)
  const [status, setStatus] = useState<StatusFilter>('ALL')
  const [minArea, setMinArea] = useState('')
  const [maxArea, setMaxArea] = useState('')
  const [selected, setSelected] = useState<UnitContext | null>(null)

  // Collect available bedroom options from data.
  const bedOptions = useMemo(() => {
    const set = new Set<number>()
    for (const ctx of contexts) {
      const b = ctx.unit.filterCriteria?.find((f) => f.type === 'BEDROOMS')
      if (b) set.add(Number(b.value))
    }
    return [...set].sort((a, b) => a - b)
  }, [contexts])

  const filtered = useMemo(() => {
    return contexts.filter((ctx) => {
      if (ctx.unit.unitType !== 'APARTMENT') return false
      if (status !== 'ALL' && ctx.availability?.availabilityStatus !== status) return false
      if (beds != null) {
        const b = ctx.unit.filterCriteria?.find((f) => f.type === 'BEDROOMS')
        if (Number(b?.value) !== beds) return false
      }
      const area = Number(
        ctx.unit.filterCriteria?.find((f) => f.type === 'AREA')?.value ?? NaN,
      )
      if (minArea && !(area >= Number(minArea))) return false
      if (maxArea && !(area <= Number(maxArea))) return false
      return true
    }).sort((a, b) => {
      // Available first, then reserved, then sold; floor descending.
      const rank = { AVAILABLE: 0, RESERVED: 1, SOLD: 2 } as const
      const ra = a.availability ? rank[a.availability.availabilityStatus] : 3
      const rb = b.availability ? rank[b.availability.availabilityStatus] : 3
      if (ra !== rb) return ra - rb
      return b.level.order - a.level.order
    })
  }, [contexts, status, beds, minArea, maxArea])

  const availableCount = useMemo(
    () => contexts.filter((c) => c.availability?.availabilityStatus === 'AVAILABLE').length,
    [contexts],
  )

  const stageImage =
    project.projectStructure.cluster?.towers?.[0]?.cluster?.levels?.find((l) =>
      /^\d+$/.test(l.levelSlug),
    )?.swipeImgUrl ?? project.backgroundTree?.home?.imgUrl

  return (
    <Layout
      title="Disponibilidad"
      topbarRight={
        <TopBarButton label="Cotizar" onClick={() => navigate('/quote')}>
          <IconQuote />
        </TopBarButton>
      }
    >
      <div className="availability">
        <section className="availability__panel" aria-label="Lista de unidades">
          <div className="availability__header">
            <h1 className="availability__title">Disponibilidad</h1>
            <p className="availability__count">
              {availableCount} disponibles · {filtered.length} unidades mostradas
            </p>

            <div className="filters">
              <div>
                <span className="filter-group__label">Recámaras</span>
                <div className="filter-chips">
                  <button
                    type="button"
                    className={`filter-chip${beds == null ? ' is-active' : ''}`}
                    onClick={() => setBeds(null)}
                  >
                    Todas
                  </button>
                  {bedOptions.map((b) => (
                    <button
                      key={b}
                      type="button"
                      className={`filter-chip${beds === b ? ' is-active' : ''}`}
                      onClick={() => setBeds(beds === b ? null : b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="filter-group__label">Estado de disponibilidad</span>
                <div className="filter-chips">
                  {(
                    [
                      ['ALL', 'Todos'],
                      ['AVAILABLE', 'Disponible'],
                      ['RESERVED', 'Reservado'],
                      ['SOLD', 'Vendido'],
                    ] as [StatusFilter, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      className={`filter-chip${status === value ? ' is-active' : ''}`}
                      onClick={() => setStatus(value)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="filter-group__label">Rango de área (m²)</span>
                <div className="filter-range">
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="Mínimo"
                    value={minArea}
                    min={0}
                    onChange={(e) => setMinArea(e.target.value)}
                    aria-label="Área mínima"
                  />
                  <span aria-hidden="true">–</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="Máximo"
                    value={maxArea}
                    min={0}
                    onChange={(e) => setMaxArea(e.target.value)}
                    aria-label="Área máxima"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="availability__list">
            {filtered.length === 0 && (
              <p style={{ padding: '24px 12px', color: '#98A2B3', fontSize: '.875rem' }}>
                Sin coincidencias. Ajusta los filtros para ver unidades.
              </p>
            )}
            {filtered.map((ctx) => {
              const status_ = ctx.availability?.availabilityStatus
              const area = ctx.unit.filterCriteria?.find((f) => f.type === 'AREA')?.value
              const beds_ = ctx.unit.filterCriteria?.find((f) => f.type === 'BEDROOMS')?.value
              return (
                <button
                  key={ctx.unit.unitId}
                  type="button"
                  className="availability-row"
                  onClick={() => setSelected(ctx)}
                >
                  <span
                    className="availability-row__stripe"
                    style={{ background: statusColor(status_) }}
                  />
                  <span className="availability-row__main">
                    <span className="availability-row__name">
                      {ctx.unit.displayName}
                      {ctx.availability?.externalSKU ? ` · ${ctx.availability.externalSKU}` : ''}
                    </span>
                    <span className="availability-row__meta">
                      {ctx.unit.typology} · {beds_ ?? '—'} rec · {area ?? '—'} m²
                    </span>
                  </span>
                  <span className="availability-row__side">
                    {ctx.availability?.price ? (
                      <span className="availability-row__price">
                        {formatPrice(
                          ctx.availability.price.amount,
                          ctx.availability.price.currencyCode,
                        )}
                      </span>
                    ) : (
                      <span className="availability-row__price" style={{ color: '#98A2B3' }}>
                        Consulta de precio
                      </span>
                    )}
                    <span className="status-badge">
                      <span
                        className="status-badge__dot"
                        style={{ background: statusColor(status_) }}
                      />
                      {statusLabel(status_)}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="availability__stage" aria-hidden="true">
          {stageImage && <img src={asset(stageImage)} alt="" />}
          <span className="availability__stage-label">
            Selecciona una unidad de la lista para ver el detalle
          </span>
        </div>
      </div>

      {selected && <UnitDetailModal ctx={selected} onClose={() => setSelected(null)} />}
    </Layout>
  )
}
