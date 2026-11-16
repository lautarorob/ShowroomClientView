import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { useProject } from '../components/projectContextBase'
import {
  allUnitContexts,
  asset,
  findUnitContext,
  formatPrice,
  statusColor,
  statusLabel,
} from '../data'
import { IconCheck } from '../components/Icons'

/**
 * Quote: personal-data form to request a custom price quote for a
 * specific unit (or a general one when no unit is given).
 */
export function QuotePage() {
  const { unitId } = useParams()
  const navigate = useNavigate()
  const { project, availability } = useProject()

  const ctx = useMemo(() => {
    if (!unitId) return undefined
    return findUnitContext(
      project.projectStructure.cluster?.towers ?? [],
      availability,
      Number(unitId),
    )
  }, [unitId, project.projectStructure, availability])

  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const bg = project.backgroundTree?.home?.imgUrl
  const units = allUnitContexts(project.projectStructure.cluster?.towers ?? [], availability)
  const apartmentOptions = units.filter((c) => c.unit.unitType === 'APARTMENT')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
    }, 700)
  }

  return (
    <Layout title="Cotizar">
      <div className="quote-page" style={bg ? { backgroundImage: `url(${asset(bg)})` } : undefined}>
        <div className="quote-page__scrim">
          <div className="quote-card">
            {sent ? (
              <div className="form-success">
                <div className="form-success__icon">
                  <IconCheck />
                </div>
                <h3>¡Cotización enviada exitosamente!</h3>
                <p>
                  Recibirás un correo electrónico con la cotización personalizada en segundos.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18 }}>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    onClick={() => setSent(false)}
                  >
                    Nueva cotización
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary btn--sm"
                    onClick={() => navigate('/availability')}
                  >
                    Ver disponibilidad
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="page-heading" style={{ fontSize: '1.25rem' }}>
                  ¡Obtén una cotización personalizada!
                </h1>
                <p className="page-subheading" style={{ marginBottom: 18 }}>
                  Completa tus datos personales y obtén una cotización en segundos.
                </p>

                {ctx && (
                  <div className="quote-card__unit">
                    <div>
                      <p className="quote-card__unit-name">
                        {ctx.unit.typology} — {ctx.unit.displayName}
                      </p>
                      <p className="quote-card__unit-meta">
                        {ctx.availability?.externalSKU}
                        {ctx.unit.filterCriteria?.find((f) => f.type === 'BEDROOMS')?.value
                          ? ` · ${ctx.unit.filterCriteria.find((f) => f.type === 'BEDROOMS')!.value} recámaras`
                          : ''}
                        {ctx.unit.filterCriteria?.find((f) => f.type === 'AREA')?.value
                          ? ` · ${ctx.unit.filterCriteria.find((f) => f.type === 'AREA')!.value} m²`
                          : ''}
                      </p>
                    </div>
                    <span className="status-badge">
                      <span
                        className="status-badge__dot"
                        style={{ background: statusColor(ctx.availability?.availabilityStatus) }}
                      />
                      {statusLabel(ctx.availability?.availabilityStatus)}
                    </span>
                  </div>
                )}

                {ctx?.availability?.price && (
                  <p
                    style={{
                      margin: '0 0 16px',
                      fontSize: '1.375rem',
                      fontWeight: 700,
                      color: '#151515',
                    }}
                  >
                    {formatPrice(
                      ctx.availability.price.amount,
                      ctx.availability.price.currencyCode,
                    )}
                  </p>
                )}

                <form className="form-grid" onSubmit={onSubmit}>
                  {!ctx && (
                    <div className="form-field form-field--full">
                      <label htmlFor="q-unit">Unidad</label>
                      <select id="q-unit" name="unitId" defaultValue="">
                        <option value="">Consulta general</option>
                        {apartmentOptions.map((c) => (
                          <option key={c.unit.unitId} value={c.unit.unitId}>
                            {c.unit.displayName}
                            {c.availability
                              ? ` — ${statusLabel(c.availability.availabilityStatus)}`
                              : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="form-field">
                    <label htmlFor="q-name">Nombre</label>
                    <input id="q-name" name="name" type="text" required autoComplete="name" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="q-lastname">Apellido(s)</label>
                    <input id="q-lastname" name="lastname" type="text" required autoComplete="family-name" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="q-email">Correo electrónico</label>
                    <input id="q-email" name="email" type="email" required autoComplete="email" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="q-phone">Teléfono</label>
                    <input id="q-phone" name="phone" type="tel" required autoComplete="tel" />
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="q-message">Mensaje (opcional)</label>
                    <textarea id="q-message" name="message" maxLength={500} />
                  </div>
                  <label className="form-check">
                    <input type="checkbox" required />
                    <span>
                      He leído y acepto la{' '}
                      <a href="#privacy" onClick={(e) => e.preventDefault()}>
                        política de privacidad
                      </a>
                      .
                    </span>
                  </label>
                  <div className="form-field form-field--full">
                    <button type="submit" className="btn btn--primary btn--lg" disabled={submitting}>
                      {submitting ? 'Enviando...' : 'Obtener cotización'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
