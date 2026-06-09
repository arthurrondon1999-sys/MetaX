export function MetaLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
        fill="#1877F2"
      />
    </svg>
  )
}

export function GoogleAdsLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M3.6 16.2 8.4 7.9a3 3 0 0 1 5.2 3l-4.8 8.3a3 3 0 0 1-5.2-3z" fill="#FBBC04" />
      <path d="M14.4 7.9a3 3 0 0 1 5.2 3l-4.8 8.3a3 3 0 0 1-5.2-3l4.8-8.3z" fill="#4285F4" />
      <circle cx="6" cy="18.7" r="3" fill="#34A853" />
    </svg>
  )
}

export function TikTokLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3.1v12.4a2.5 2.5 0 1 1-2.5-2.6c.26 0 .5.04.74.1V9.7a5.7 5.7 0 0 0-.74-.05A5.65 5.65 0 1 0 15.7 15.3V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.4-1.6z"
        fill="#00F2EA"
      />
      <path
        d="M15.7 5.8a4.3 4.3 0 0 1-1-2.8h-2.2v12.4a2.5 2.5 0 0 1-4.5 1.5 2.5 2.5 0 0 0 4 .15c.3-.4.46-.9.46-1.45V3.2h2.1c.06.4.17.8.32 1.16.16.5.46.97.8 1.4z"
        fill="#FF004F"
      />
    </svg>
  )
}

function PlatformBadge({ letter, bg }: { letter: string; bg: string }) {
  return (
    <div
      className={`w-7 h-7 rounded-md flex items-center justify-center text-white font-bold ${
        letter.length > 1 ? "text-[11px]" : "text-sm"
      }`}
      style={{ background: bg }}
    >
      {letter}
    </div>
  )
}

export function HotmartLogo() {
  return <PlatformBadge letter="H" bg="linear-gradient(135deg,#FF4F00,#F5004F)" />
}
export function KiwifyLogo() {
  return <PlatformBadge letter="K" bg="linear-gradient(135deg,#00C455,#009E44)" />
}
export function PerfectPayLogo() {
  return <PlatformBadge letter="PP" bg="linear-gradient(135deg,#1E5BFF,#0033B3)" />
}
export function DigistoreLogo() {
  return <PlatformBadge letter="D" bg="linear-gradient(135deg,#FF6A00,#E5102E)" />
}
export function CaktoLogo() {
  return <PlatformBadge letter="C" bg="linear-gradient(135deg,#8B00FF,#5B00B3)" />
}
