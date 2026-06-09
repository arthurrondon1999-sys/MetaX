"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Check } from "lucide-react"

export function SavedIndicator({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-6 right-6 z-[110] flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#0a1f14] border border-emerald-500/30 shadow-lg"
        >
          <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </span>
          <span className="text-sm font-medium text-emerald-400">Salvo</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
