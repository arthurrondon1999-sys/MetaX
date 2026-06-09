"use client"

import { useState } from "react"
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react"
import { Modal } from "@/components/shared/modal"
import type { MetaStatus } from "@/hooks/use-meta"

interface MetaConnectionModalProps {
  open: boolean
  onClose: () => void
  status?: MetaStatus
  onChanged: () => void
}

export function MetaConnectionModal({ open, onClose, status, onChanged }: MetaConnectionModalProps) {
  const [token, setToken] = useState("")
  const [accountId, setAccountId] = useState(status?.accountId || "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const accounts = status?.accounts ?? []

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const body: Record<string, string> = {}
      if (token.trim()) body.access_token = token.trim()
      if (accountId) body.account_id = accountId

      const res = await fetch("/api/meta/integration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Erro ao salvar")
      setToken("")
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
      const res = await fetch("/api/meta/integration", { method: "DELETE" })
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
    <Modal open={open} onClose={onClose} title="Gerenciar Conexão Meta Ads">
      <div className="space-y-4">
        {/* Status atual */}
        {status?.tokenValid ? (
          <div className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Token válido e conectado
          </div>
        ) : status?.connected ? (
          <div className="flex items-center gap-2 text-sm text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            {status.error || "Token inválido ou expirado"}
          </div>
        ) : (
          <p className="text-sm text-white/60">Cole um token de acesso do Meta para conectar.</p>
        )}

        {/* Seletor de conta */}
        {accounts.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Conta de Anúncio</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white outline-none focus:border-electric-blue/40"
            >
              <option value="">Selecionar automaticamente</option>
              {accounts.map((a) => (
                <option key={a.account_id} value={a.account_id} className="bg-[#0b1020]">
                  {a.name} ({a.account_id})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Token input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Novo token de acesso {status?.connected && "(deixe em branco para manter o atual)"}
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="EAAB..."
            rows={3}
            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-muted-foreground outline-none focus:border-electric-blue/40 resize-none"
          />
        </div>

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
