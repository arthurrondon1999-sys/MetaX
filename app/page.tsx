import { AnimatedBackground } from "@/components/login/animated-background"
import { LoginCard } from "@/components/login/login-card"

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Version tag */}
      <div className="absolute top-4 right-4 text-xs text-muted-foreground/50 font-mono">
        MetaX v2.1
      </div>

      {/* Login card */}
      <LoginCard />

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground/40">
          © 2025 MetaX. Todos os direitos reservados.
        </p>
      </div>
    </main>
  )
}
