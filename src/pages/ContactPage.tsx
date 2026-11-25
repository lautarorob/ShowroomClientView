import { useState } from 'react'
import type { FormEvent } from 'react'
import { Layout } from '../components/Layout'
import { useProject } from '../components/projectContextBase'
import { asset } from '../data'
import { IconCheck } from '../components/Icons'

/**
 * Contact: lead form (name / email / phone / subject / message) over the
 * project background, plus the project & developer contact details.
 */
export function ContactPage() {
  const { project } = useProject()
  const { contactPage, project: meta } = project

  const bg = project.backgroundTree?.contact?.imgUrl
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    // The original posts to a backend we cannot reach cross-origin;
    // emulate the async submission and show the success state.
    setTimeout(() => {
      setSubmitting(false)
      setSent(true)
    }, 700)
  }

  return (
    <Layout title="Contacto">
      <div
        className="contact"
        style={bg ? { backgroundImage: `url(${asset(bg)})` } : undefined}
      >
        <div className="contact__scrim">
          <div className="contact__card">
            <div className="contact__form-side">
              {sent ? (
                <div className="form-success">
                  <div className="form-success__icon">
                    <IconCheck />
                  </div>
                  <h3>¡Su consulta ha sido enviada!</h3>
                  <p>Nos contactaremos con Usted a la brevedad.</p>
                  <button
                    type="button"
                    className="btn btn--outline btn--sm"
                    style={{ marginTop: 18 }}
                    onClick={() => setSent(false)}
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="page-heading" style={{ fontSize: '1.25rem' }}>
                    ¿Tienes alguna consulta?
                  </h1>
                  <p className="page-subheading" style={{ marginBottom: 20 }}>
                    Completa tus datos y un ejecutivo se pondrá en contacto contigo.
                  </p>

                  <form className="form-grid" onSubmit={onSubmit}>
                    <div className="form-field">
                      <label htmlFor="c-name">Nombre</label>
                      <input id="c-name" name="name" type="text" required autoComplete="name" />
                    </div>
                    <div className="form-field">
                      <label htmlFor="c-lastname">Apellido(s)</label>
                      <input id="c-lastname" name="lastname" type="text" required autoComplete="family-name" />
                    </div>
                    <div className="form-field">
                      <label htmlFor="c-email">Correo electrónico</label>
                      <input id="c-email" name="email" type="email" required autoComplete="email" />
                    </div>
                    <div className="form-field">
                      <label htmlFor="c-phone">Teléfono</label>
                      <input id="c-phone" name="phone" type="tel" required autoComplete="tel" />
                    </div>
                    <div className="form-field form-field--full">
                      <label htmlFor="c-subject">Asunto</label>
                      <input id="c-subject" name="subject" type="text" required />
                    </div>
                    <div className="form-field form-field--full">
                      <label htmlFor="c-message">Mensaje</label>
                      <textarea id="c-message" name="message" maxLength={500} required />
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
                      <button
                        type="submit"
                        className="btn btn--primary btn--lg"
                        disabled={submitting}
                      >
                        {submitting ? 'Enviando...' : 'Enviar'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>

            <div className="contact__info-side">
              <div className="contact__info-block">
                <h4>Proyecto</h4>
                <p>
                  <strong>{contactPage?.projectName ?? 'Terrazy'}</strong>
                  <br />
                  {contactPage?.projectDescription ?? meta.email}
                </p>
              </div>

              <div className="contact__info-block">
                <h4>Ventas</h4>
                <p>
                  {meta.phoneNumber && (
                    <>
                      <a href={meta.phoneUrl ?? `tel:${meta.phoneNumber}`}>{meta.phoneNumber}</a>
                      <br />
                    </>
                  )}
                  {meta.whatsAppNumber && meta.whatsAppUrl && (
                    <>
                      <a href={meta.whatsAppUrl} target="_blank" rel="noreferrer">
                        {meta.whatsAppNumber} (Whatsapp)
                      </a>
                      <br />
                    </>
                  )}
                  {meta.email && (
                    <a href={meta.emailUrl ?? `mailto:${meta.email}`}>{meta.email}</a>
                  )}
                </p>
              </div>

              <div className="contact__info-block">
                <h4>Desarrollador</h4>
                <p>
                  <strong>{contactPage?.developerName ?? 'Grupo Binian'}</strong>
                  <br />
                  {contactPage?.developerDescription}
                  {project.developer.websiteLink && (
                    <>
                      <br />
                      <a
                        href={project.developer.websiteLink.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.developer.websiteLink.displayText}
                      </a>
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
