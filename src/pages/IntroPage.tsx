import { useNavigate } from 'react-router-dom'
import { ProjectVideo } from '../components/ProjectVideo'
import { useProject } from '../components/projectContextBase'
import { SpinView } from '../components/SpinView'
import { asset } from '../data'

/**
 * Intro splash: the project film as a fullscreen background with the logo
 * and the "Entrar" button, matching the original home experience. Falls back
 * to the 360 spin when the project has no video.
 */
export function IntroPage() {
  const { project } = useProject()
  const navigate = useNavigate()

  const hlsUrl = project.videoPage?.web3dVideoUrl
  const vimeoId = project.videoPage?.vimeoVideoId

  const stopPoints = project.projectStructure.spin360?.stopPoints ?? []
  const homeBg = project.backgroundTree?.home?.imgUrl
  const points =
    stopPoints.length > 0
      ? stopPoints
      : homeBg
        ? [{ stopPointSlug: '0', backgroundImgUrl: homeBg }]
        : []

  const logoUrl = project.home.logo?.logoImgUrl
    ? asset(project.home.logo.logoImgUrl)
    : undefined
  const enterTitle = project.home.enterButton?.title ?? 'Entrar'

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      {hlsUrl || vimeoId ? (
        <ProjectVideo hlsUrl={hlsUrl} vimeoId={vimeoId} className="intro__video" background />
      ) : (
        <SpinView stopPoints={points} interactive={false} />
      )}

      {logoUrl && (
        <img className="intro__logo" src={logoUrl} alt="PH Balcony" draggable={false} />
      )}

      <button
        type="button"
        className="btn btn--primary btn--lg intro__enter"
        onClick={() => navigate('/masterplan')}
      >
        {enterTitle}
      </button>
    </div>
  )
}
