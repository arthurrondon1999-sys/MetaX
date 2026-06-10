"use client"

import { useCurrency } from "@/lib/currency/currency-context"

export function CurrencyToggle() {
  const { currency, setCurrency, rate } = useCurrency()

  return (
    <div className="flex items-center gap-2">
      <div
        className="flex items-center rounded-lg border border-white/15 bg-white/5 p-0.5"
        role="group"
        aria-label="Selecionar moeda"
      >
        <button
          onClick={() => setCurrency("USD")}
          aria-pressed={currency === "USD"}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            currency === "USD" ? "bg-electric-blue text-white" : "text-[#94A3B8] hover:text-white"
          }`}
        >
          USD $
        </button>
        <button
          onClick={() => setCurrency("BRL")}
          aria-pressed={currency === "BRL"}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
            currency === "BRL" ? "bg-electric-blue text-white" : "text-[#94A3B8] hover:text-white"
          }`}
        >
          BRL R$
        </button>
      </div>
      {currency === "BRL" && (
        <span className="hidden md:inline text-[10px] text-[#94A3B8] tabular-nums whitespace-nowrap">
          {`1 USD = ${rate.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`}
        </span>
      )}
    </div>
  )
}
