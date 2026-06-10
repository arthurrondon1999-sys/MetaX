"use client"

import { cn } from "@/lib/utils"

/**
 * Skeleton com efeito shimmer.
 * Cor base rgba(255,255,255,0.05) conforme guideline.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-md", className)} aria-hidden="true" />
}
