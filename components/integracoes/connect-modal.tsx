"use client"

import { Modal } from "@/components/shared/modal"

interface ConnectModalProps {
  /** platform name when in "connect" mode, null when closed */
  platform: string | null
  /** when true, shows the "gerenciar conexão" message instead */
  manage?: boolean
  onClose: () => void
}

export function ConnectModal({ platform, manage = false, onClose }: ConnectModalProps) {
  const title = manage ? "Gerenciar Conexão" : "Integração em breve"
  const message = manage
    ? "Gerenciamento de conexão disponível após integração com Meta API."
    : `Integração em breve disponível. Estamos trabalhando para conectar ${platform} ao MetaX.`

  return (
    <Modal open={platform !== null} onClose={onClose} title={title}>
      <p className="text-sm text-white/70 leading-relaxed">{message}</p>
      <button
        onClick={onClose}
        className="mt-6 w-full py-2.5 rounded-lg font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #0066FF, #8B00FF)" }}
      >
        OK
      </button>
    </Modal>
  )
}
