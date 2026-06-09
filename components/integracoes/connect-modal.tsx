"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Check } from "lucide-react"
import { GoogleAdsLogo } from "./platform-logos"

interface ConnectModalProps {
  platform: string | null
  onClose: () => void
}

const allowedPermissions = [
  "Visualizar campanhas e anúncios",
  "Acessar métricas de performance",
  "Ler dados de conversão",
]

export function ConnectModal({ platform, onClose }: ConnectModalProps) {
  return (
    <AnimatePresence>
      {platform && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md p-6 rounded-2xl bg-card/80 backdrop-blur-2xl border border-cyan/20"
            style={{ boxShadow: "0 0 60px rgba(0,102,255,0.2)" }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo + title */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/5 flex items-center justify-center mb-3">
                <GoogleAdsLogo className="w-10 h-10" />
              </div>
              <h2 className="text-lg font-semibold text-white">Conectar {platform}</h2>
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed max-w-xs">
                Você será redirecionado para o Google para autorizar o acesso ao MetaX.
              </p>
            </div>

            {/* Permissions */}
            <div className="space-y-2.5 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5">
              {allowedPermissions.map((perm) => (
                <div key={perm} className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-green-500" />
                  </span>
                  <span className="text-xs text-white">{perm}</span>
                </div>
              ))}
              <div className="flex items-center gap-2.5 pt-2 mt-2 border-t border-white/5">
                <span className="w-5 h-5 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                  <X className="w-3 h-3 text-red-500" />
                </span>
                <span className="text-xs text-muted-foreground">
                  O MetaX nunca poderá: criar, editar ou excluir campanhas
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-muted-foreground text-sm font-medium hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,102,255,0.4)]"
                style={{ background: "linear-gradient(135deg,#0066FF,#8B00FF)" }}
              >
                Autorizar com Google
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
