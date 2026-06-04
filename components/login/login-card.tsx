"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, Check } from "lucide-react"
import { MetaXLogo } from "./metax-logo"

export function LoginCard() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/dashboard")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative w-full max-w-[440px] mx-auto"
    >
      {/* Animated border */}
      <div className="absolute -inset-[1px] rounded-2xl animate-border-travel opacity-50" />

      {/* Card glow */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(0, 102, 255, 0.3), rgba(139, 0, 255, 0.2))",
        }}
      />

      {/* Main card */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative backdrop-blur-[20px] bg-card rounded-2xl border border-border p-8 md:p-10"
        style={{
          boxShadow:
            "0 0 40px rgba(0, 102, 255, 0.1), 0 0 80px rgba(139, 0, 255, 0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute inset-0 animate-shimmer" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Logo */}
          <div className="flex justify-center">
            <MetaXLogo />
          </div>

          {/* Title */}
          <div className="text-center space-y-2 pt-2">
            <h2 className="text-2xl md:text-[28px] font-bold text-white">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-muted-foreground">
              Faça login na sua conta MetaX
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  focusedField === "email"
                    ? "shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                    : ""
                }`}
              />
              <div className="relative flex items-center">
                <Mail
                  className="absolute left-4 w-5 h-5 text-cyan"
                  strokeWidth={1.5}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Digite seu email"
                  className="w-full pl-12 pr-4 py-3.5 bg-secondary rounded-lg border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  focusedField === "password"
                    ? "shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                    : ""
                }`}
              />
              <div className="relative flex items-center">
                <Lock
                  className="absolute left-4 w-5 h-5 text-cyan"
                  strokeWidth={1.5}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Digite sua senha"
                  className="w-full pl-12 pr-12 py-3.5 bg-secondary rounded-lg border border-border text-white placeholder:text-muted-foreground focus:outline-none focus:border-cyan/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-muted-foreground hover:text-cyan transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${
                    rememberMe
                      ? "bg-gradient-to-br from-electric-blue to-neon-purple border-transparent shadow-[0_0_10px_rgba(0,102,255,0.5)]"
                      : "border-border bg-secondary group-hover:border-cyan/30"
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-muted-foreground group-hover:text-white transition-colors">
                  Lembrar-me
                </span>
              </label>
              <a
                href="#"
                className="text-electric-blue hover:text-cyan transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="relative w-full py-3.5 rounded-lg font-semibold text-white overflow-hidden group disabled:opacity-70"
              style={{
                background: "linear-gradient(135deg, #0066FF, #8B00FF)",
              }}
            >
              {/* Button glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, #0088FF, #AA00FF)",
                  boxShadow: "0 0 30px rgba(0, 102, 255, 0.5), 0 0 60px rgba(139, 0, 255, 0.3)",
                }}
              />
              {/* Shimmer effect */}
              <div className="absolute inset-0 animate-shimmer opacity-30" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </span>
            </motion.button>

            {/* Divider */}
            <div className="relative flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
              <span className="text-xs text-muted-foreground">
                ou continue com
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>

            {/* Facebook Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-lg font-medium text-white bg-secondary border border-[#1877F2]/30 hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="#1877F2"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continuar com Facebook
            </motion.button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <a
              href="#"
              className="text-neon-purple hover:text-cyan transition-colors font-medium"
            >
              Solicitar Acesso
            </a>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
