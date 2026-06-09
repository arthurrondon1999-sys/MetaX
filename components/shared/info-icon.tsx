"use client"

import { Info } from "lucide-react"

export function InfoIcon({ tip }: { tip?: string }) {
  return (
    <span title={tip} className="inline-flex items-center cursor-help">
      <Info className="w-3 h-3 text-muted-foreground/60 hover:text-cyan transition-colors" />
    </span>
  )
}
