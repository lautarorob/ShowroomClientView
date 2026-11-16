import { useMemo, useState } from 'react'
import type { CSSProperties, Ref } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UnitContext } from '../types'
import { asset, formatPrice, statusColor, statusLabel, unitSpecs } from '../data'
import { Gallery } from './Gallery'
import { IconClose } from './Icons'

type Tab = 'plano' | 'medidas' | 'fotos' | 'vistas'

interface UnitDetailModalProps {
  ctx: UnitContext
  onClose: () => void
  /** Show the "Cotizar unidad" action (availability / topview flows). */
  quoteEnabled?: boolean
}

/**
 * Full unit detail dialog: floor plan, dimensions, photo galleries,
 * specs, tour 360 and quotation actions — mirroring the original popup.
 */
export function UnitDetailModal({ ctx, onClose, quoteEnabled = true }: UnitDetailModalProps) {
  const navigate = useNavigate()
  const unitLevel = ctx.unit.unitLevels?.[0]
  const specs = useMemo(() => unitSpecs(ctx), [ctx])
  const [tab, setTab] = useState<Tab>('plano')

  const images = [
    ...(unitLevel?.imagesGallery ?? []),
    ...(ctx.unit.viewsGallery ?? []),
  ]

  const hasPlano = Boolean(unitLevel?.floorPlans3dImgUrl)
  const hasMedidas = Boolean(unitLevel?.dimensionsImgUrl)

  const activeTab: Tab =
    tab === 'plano' && !hasPlano
      ? hasMedidas
        ? 'medidas'
        : images.length > 0
          ? 'fotos'
          : 'plano'
      : tab

  const availability = ctx.availability

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de unidad ${ctx.unit.displayName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__head">
          <div>
            <h3 className="modal__title">
              {ctx.unit.typology ?? ctx.unit.displayName} — {ctx.unit.displayName}
            </h3>
            <p className="modal__subtitle">
              {availability ? statusLabel(availability.availabilityStatus) : 'Apartamento'}
              {availability?.externalSKU ? ` · ${availability.externalSKU}` : ''}
              {availability?.price
                ? ` · ${formatPrice(availability.price.amount, availability.price.currencyCode)}`
                : ''}
            </p>
          </div>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">
            <IconClose width={18} height={18} />
          </button>
        </div>

        <div className="modal__body">
          {(hasPlano || hasMedidas || images.length > 0) && (
            <div className="tabs" role="tablist">
              {hasPlano && (
                <button
                  type="button"
                  role="tab"
                  className={`tab${activeTab === 'plano' ? ' is-active' : ''}`}
                  onClick={() => setTab('plano')}
                >
                  Plano 3D
                </button>
              )}
              {hasMedidas && (
                <button
                  type="button"
                  role="tab"
                  className={`tab${activeTab === 'medidas' ? ' is-active' : ''}`}
                  onClick={() => setTab('medidas')}
                >
                  Medidas
                </button>
              )}
              {(unitLevel?.imagesGallery?.length ?? 0) > 0 && (
                <button
                  type="button"
                  role="tab"
                  className={`tab${activeTab === 'fotos' ? ' is-active' : ''}`}
                  onClick={() => setTab('fotos')}
                >
                  Fotos
                </button>
              )}
              {(ctx.unit.viewsGallery?.length ?? 0) > 0 && (
                <button
                  type="button"
                  role="tab"
                  className={`tab${activeTab === 'vistas' ? ' is-active' : ''}`}
                  onClick={() => setTab('vistas')}
                >
                  Vistas
                </button>
              )}
            </div>
          )}

          {activeTab === 'plano' && unitLevel?.floorPlans3dImgUrl && (
            <img
              src={asset(unitLevel.floorPlans3dImgUrl)}
              alt="Plano 3D"
              style={{ width: '100%', borderRadius: 8, background: '#F9FAFB' }}
            />
          )}

          {activeTab === 'medidas' && unitLevel?.dimensionsImgUrl && (
            <img
              src={asset(unitLevel.dimensionsImgUrl)}
              alt="Medidas"
              style={{ width: '100%', borderRadius: 8, background: '#F9FAFB' }}
            />
          )}

          {activeTab === 'fotos' && (unitLevel?.imagesGallery?.length ?? 0) > 0 && (
            <Gallery items={unitLevel!.imagesGallery!} counter />
          )}

          {activeTab === 'vistas' && (ctx.unit.viewsGallery?.length ?? 0) > 0 && (
            <Gallery items={ctx.unit.viewsGallery!} counter />
          )}

          {specs.length > 0 && (
            <div className="unit-card__specs" style={{ marginTop: 18 }}>
              {specs.map((s) => (
                <span key={s.label} className="spec-chip">
                  {s.label}: <strong>{s.value}</strong>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="modal__footer">
          {unitLevel?.tour360Url && (
            <a
              className="btn btn--outline btn--sm"
              href={`https://www.phbalcony.com${unitLevel.tour360Url}`}
              target="_blank"
              rel="noreferrer"
            >
              Tour 360
            </a>
          )}
          {(ctx.unit.downloadableBrochureUrl || ctx.unit.unitLevels?.[0]?.floorPlans3dImgUrl) && (
            <a
              className="btn btn--outline btn--sm"
              href={
                ctx.unit.downloadableBrochureUrl
                  ? `https://www.phbalcony.com${ctx.unit.downloadableBrochureUrl}`
                  : asset(ctx.unit.unitLevels![0].floorPlans3dImgUrl!)
              }
              target="_blank"
              rel="noreferrer"
            >
              Descargar Brochure
            </a>
          )}
          {quoteEnabled && (
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={() => {
                onClose()
                navigate(`/quote/${ctx.unit.unitId}`)
              }}
            >
              Cotizar unidad
            </button>
          )}
          <button type="button" className="btn btn--outline btn--sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

/** Compact popup card shown when a unit polygon is hovered/clicked on a floor plan. */
export function UnitCard({
  ctx,
  onClose,
  onDetail,
  style,
  ref,
}: {
  ctx: UnitContext
  onClose: () => void
  onDetail: () => void
  /** Inline positioning override (e.g. anchored under the cursor). */
  style?: CSSProperties
  ref?: Ref<HTMLDivElement>
}) {
  const specs = unitSpecs(ctx)
    .filter((s) => /AREA|RECAMARA|BAÑO|BAÑO|PARKING/i.test(s.label))
    .slice(0, 4)
  const availability = ctx.availability

  return (
    <div
      className="unit-card"
      ref={ref}
      style={style}
      role="dialog"
      aria-label={`Unidad ${ctx.unit.displayName}`}
    >
      <div className="unit-card__head">
        <h3 className="unit-card__name">{ctx.unit.displayName}</h3>
        <button type="button" className="unit-card__close" onClick={onClose} aria-label="Cerrar">
          <IconClose width={16} height={16} />
        </button>
      </div>
      <p className="unit-card__typology">{ctx.unit.typology}</p>

      {availability && (
        <div style={{ marginBottom: 12 }}>
          <span className="status-badge">
            <span
              className="status-badge__dot"
              style={{ background: statusColor(availability.availabilityStatus) }}
            />
            {statusLabel(availability.availabilityStatus)}
          </span>
        </div>
      )}

      {specs.length > 0 && (
        <div className="unit-card__specs">
          {specs.map((s) => (
            <span key={s.label} className="spec-chip">
              {s.label}: <strong>{s.value}</strong>
            </span>
          ))}
        </div>
      )}

      <div className="unit-card__actions">
        <button type="button" className="btn btn--primary btn--sm" onClick={onDetail}>
          Ver detalles
        </button>
      </div>
    </div>
  )
}
