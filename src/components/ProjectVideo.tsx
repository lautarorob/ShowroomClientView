import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

interface ProjectVideoProps {
  /** Interactive HLS stream (web3dVideoUrl) — preferred source. */
  hlsUrl?: string
  /** Vimeo fallback used when there is no HLS stream. */
  vimeoId?: string
  className?: string
  /** Native playback controls (player variant, e.g. the Video section). */
  controls?: boolean
  /** Muted, looping, control-less variant for page backgrounds. */
  background?: boolean
}

/**
 * The project film: HLS video with native HLS on Safari, Vimeo embed as a
 * fallback. Shared by the Video section and the intro background.
 */
export function ProjectVideo({
  hlsUrl,
  vimeoId,
  className,
  controls = false,
  background = false,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !hlsUrl) return

    let hls: Hls | null = null
    if (Hls.isSupported()) {
      hls = new Hls()
      hls.loadSource(hlsUrl)
      hls.attachMedia(video)
      // The media source lands after mount, so kick playback explicitly.
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        video.play().catch(() => undefined)
      })
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari: native HLS.
      video.src = hlsUrl
      video.play().catch(() => undefined)
    }

    return () => {
      hls?.destroy()
    }
  }, [hlsUrl])

  if (hlsUrl) {
    return (
      <video
        ref={videoRef}
        className={className}
        controls={controls}
        muted={background}
        loop={background}
        autoPlay
        playsInline
        preload="metadata"
      />
    )
  }

  if (vimeoId) {
    const src = background
      ? `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1`
      : `https://player.vimeo.com/video/${vimeoId}`
    return (
      <iframe
        className={className}
        src={src}
        title="Reproductor de video"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  return null
}
