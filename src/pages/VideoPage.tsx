import { Layout } from '../components/Layout'
import { ProjectVideo } from '../components/ProjectVideo'
import { useProject } from '../components/projectContextBase'

/**
 * Video: fullscreen project film. Prefers the interactive HLS stream
 * (web3dVideoUrl) like the original site, falling back to the Vimeo embed.
 */
export function VideoPage() {
  const { project } = useProject()
  const hlsUrl = project.videoPage?.web3dVideoUrl
  const vimeoId = project.videoPage?.vimeoVideoId

  return (
    <Layout title="Video">
      <div className="video-page">
        {hlsUrl || vimeoId ? (
          <ProjectVideo
            hlsUrl={hlsUrl}
            vimeoId={vimeoId}
            className="video-page__frame"
            controls
          />
        ) : (
          <p style={{ color: '#98A2B3' }}>No hay video disponible.</p>
        )}
      </div>
    </Layout>
  )
}
