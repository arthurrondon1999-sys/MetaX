export function MetaXLogo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Geometric M icon */}
      <div className="relative">
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_10px_rgba(0,102,255,0.5)]"
        >
          {/* Hexagon background */}
          <path
            d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
            fill="url(#hexGradient)"
            fillOpacity="0.2"
            stroke="url(#hexStroke)"
            strokeWidth="1.5"
          />
          {/* M shape */}
          <path
            d="M14 32V18L24 26L34 18V32"
            stroke="url(#mGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M24 26V32"
            stroke="url(#mGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="hexGradient"
              x1="6"
              y1="4"
              x2="42"
              y2="44"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#0066FF" />
              <stop offset="1" stopColor="#8B00FF" />
            </linearGradient>
            <linearGradient
              id="hexStroke"
              x1="6"
              y1="4"
              x2="42"
              y2="44"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00D4FF" />
              <stop offset="0.5" stopColor="#0066FF" />
              <stop offset="1" stopColor="#8B00FF" />
            </linearGradient>
            <linearGradient
              id="mGradient"
              x1="14"
              y1="18"
              x2="34"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#00D4FF" />
              <stop offset="1" stopColor="#0066FF" />
            </linearGradient>
          </defs>
        </svg>
        {/* Glow effect */}
        <div className="absolute inset-0 blur-xl bg-electric-blue/30 -z-10 rounded-full" />
      </div>
      {/* Text */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Meta<span className="text-cyan">X</span>
        </h1>
        <p className="text-xs text-muted-foreground tracking-wider">
          Advanced Ads Intelligence
        </p>
      </div>
    </div>
  )
}
