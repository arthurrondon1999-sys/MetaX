"use client"

import { motion } from "framer-motion"
import { Plug, RefreshCw, BarChart3, ArrowRight } from "lucide-react"
import { SectionTitle } from "./ad-platforms-section"

const steps = [
  {
    number: 1,
    icon: Plug,
    title: "Conecte sua conta",
    description: "Autorize o MetaX a acessar seus dados com segurança via OAuth",
  },
  {
    number: 2,
    icon: RefreshCw,
    title: "Sincronizamos os dados",
    description: "Importamos automaticamente campanhas, vendas e métricas em tempo real",
  },
  {
    number: 3,
    icon: BarChart3,
    title: "Visualize tudo",
    description: "Acesse todos os dados unificados no seu dashboard",
  },
]

export function HowItWorksSection() {
  return (
    <section>
      <SectionTitle
        icon={<Plug className="w-5 h-5 text-cyan" />}
        title="Como funciona a integração"
      />

      <div className="relative flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
        {steps.map((step, index) => (
          <div key={step.number} className="flex-1 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.15 }}
              className="flex-1 p-5 rounded-xl bg-card/40 backdrop-blur-xl border border-cyan/10 text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ background: "linear-gradient(135deg,#0066FF,#8B00FF)" }}
                  >
                    {step.number}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-background border border-cyan/30 flex items-center justify-center">
                    <step.icon className="w-3.5 h-3.5 text-cyan" />
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>

            {index < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center px-2 shrink-0">
                <div className="flex items-center">
                  <div className="w-8 border-t border-dashed border-cyan/30" />
                  <ArrowRight className="w-4 h-4 text-cyan/50" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
