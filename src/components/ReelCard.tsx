import { useEffect, useRef, useState } from 'react'
import InstagramEmbed from './InstagramEmbed'

type ReelCardProps = {
  /** Local video path served from /public, e.g. "/reels/reel-1.mp4" */
  video: string
  /** Optional poster image, e.g. "/reels/reel-1.jpg" */
  poster?: string
  /** Instagram permalink, used as a fallback if the local video is missing */
  permalink: string
}

/**
 * Plays a local reel video muted + looping, auto-starting when scrolled into
 * view and pausing when out. If the local file can't load, it falls back to a
 * tap-to-play Instagram embed so the card always shows something.
 */
export default function ReelCard({ video, poster, permalink }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el || failed) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: 0.5 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [failed])

  if (failed) {
    return <InstagramEmbed permalink={permalink} />
  }

  return (
    <video
      ref={videoRef}
      className="aspect-[9/16] h-full w-full object-cover"
      src={video}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
    />
  )
}
