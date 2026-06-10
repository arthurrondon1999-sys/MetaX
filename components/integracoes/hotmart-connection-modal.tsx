"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { Modal } from "@/components/shared/modal"
import type { HotmartStatus } from "@/hooks/use-hotmart"

interface HotmartConnectionModalProps {
  open: boolean
  onClose: () => void
  status?: HotmartStatus
  onChanged: () => void
}

export function HotmartConnectionModal({ open, onClose, status, onChanged }: HotmartConnectionModalProps) {
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [basic, setBasic] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const body: Record<string, string> = {}
      if (basic.trim()) {
        body.basic_credential = basic.trim()
      } else if (clientId.trim() && clientSecret.trim()) {
        body.client_id = clientId.trim()
        body.client_secret = clientSecret.trim()
      } else {
        throw new Error("Informe o Client ID e o Client Secret, ou o token Basic.")
      }

      const res = await fetch("/api/hotmart/integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erro ao salvar")
      setClientId("")
      setClientSecret("")
      setBasic("")
      onChanged()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao salvar")
    } finally {
      setSaving(false)
    }
  }

  async function handleDisconnect() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/hotmart/integration", { method: "DELETE" })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erro ao desconectar")
      onChanged()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro ao desconectar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Gerenciar Conexão Hotmart">
      <div className="space-y-4">
        {/* Status atual */}
        {status?.tokenValid ? (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Credencial válida e conectada
          </div>
        ) : status?.connected ? (
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            {status.error || "Credencial inválida ou expirada"}
          </div>
        ) : (
          <p className="text-sm text-white/60">
            Informe as credenciais do seu app na Hotmart (Ferramentas &gt; Credenciais API).
          </p>
        )}

        {/* Client ID */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">Client ID</label>
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="ex: e90dc94c-763e-46c9-..."
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-electric-blue/40"
          />
        </div>

        {/* Client Secret */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Client Secret {status?.connected && "(deixe em branco para manter o atual)"}
          </label>
          <input
            type="password"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            placeholder="ex: a1e68522-7d59-..."
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-electric-blue/40"
          />
        </div>

        {/* Basic (alternativa) */}
        <details className="group">
          <summary className="text-xs text-cyan cursor-pointer select-none">
            Usar token Basic diretamente
          </summary>
          <textarea
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
            placeholder="Basic (base64 de client_id:client_secret)"
            rows={2}
            className="mt-2 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-electric-blue/40 resize-none"
          />
        </details>

        {error && (
          <p className="text-sm text-red-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          {status?.connected && (
            <button
              onClick={handleDisconnect}
              disabled={saving}
              className="flex-1 py-2.5 rounded-lg border border-red-500/40 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-colors disabled:opacity-50"
            >
              Desconectar
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #0066FF, #8B00FF)" }}
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  )
}
