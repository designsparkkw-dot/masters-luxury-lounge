import logo from '../assets/logo.jpg'

type LogoProps = {
  className?: string
  showTagline?: boolean
}

export default function Logo({ className = '', showTagline = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt="Masters Billiards Lounge logo"
        className="h-10 w-10 shrink-0 rounded-md object-cover"
      />
      <div className="leading-none text-left">
        <div className="font-display text-2xl font-semibold tracking-[0.2em] text-gradient-gold">
          MASTERS
        </div>
        {showTagline && (
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.35em] text-muted">
            Billiards Lounge
          </div>
        )}
      </div>
    </div>
  )
}
