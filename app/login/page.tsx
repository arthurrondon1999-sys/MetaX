import { AnimatedBackground } from "@/components/login/animated-background"
import { LoginCard } from "@/components/login/login-card"

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-8">
      <AnimatedBackground />
      <LoginCard />
    </main>
  )
}
