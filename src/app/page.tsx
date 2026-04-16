import Link from 'next/link'
import { Wallet, TrendingUp, TrendingDown, PieChart, ShieldCheck, Smartphone } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg tracking-tight">Conta Paga</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              Entrar
            </Link>
            <Link href="/auth/signup" className={cn(buttonVariants({ size: 'sm' }))}>
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 gap-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Wallet className="h-10 w-10" />
        </div>
        <div className="space-y-3 max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Seu dinheiro,{' '}
            <span className="underline decoration-primary decoration-4 underline-offset-4">
              sob controle
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Registre receitas e despesas, visualize gráficos e mantenha suas finanças
            pessoais organizadas — de forma simples e segura.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/auth/signup" className={cn(buttonVariants({ size: 'lg' }))}>
            Começar gratuitamente
          </Link>
          <Link href="/auth/login" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/40">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Tudo que você precisa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<TrendingUp className="h-5 w-5 text-green-600" />}
              iconBg="bg-green-100 dark:bg-green-900/30"
              title="Receitas e despesas"
              description="Registre qualquer movimentação financeira com descrição, categoria e data."
            />
            <FeatureCard
              icon={<PieChart className="h-5 w-5 text-blue-600" />}
              iconBg="bg-blue-100 dark:bg-blue-900/30"
              title="Dashboard visual"
              description="Veja um resumo do seu mês com gráficos de categorias e saldo atualizado."
            />
            <FeatureCard
              icon={<TrendingDown className="h-5 w-5 text-red-500" />}
              iconBg="bg-red-100 dark:bg-red-900/30"
              title="Filtros avançados"
              description="Filtre por período, categoria ou descrição para encontrar qualquer transação."
            />
            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5 text-purple-600" />}
              iconBg="bg-purple-100 dark:bg-purple-900/30"
              title="100% seguro"
              description="Seus dados ficam protegidos com autenticação e isolamento por usuário."
            />
            <FeatureCard
              icon={<Smartphone className="h-5 w-5 text-orange-500" />}
              iconBg="bg-orange-100 dark:bg-orange-900/30"
              title="Mobile-first"
              description="Interface pensada para funcionar perfeitamente no celular ou no computador."
            />
            <FeatureCard
              icon={<Wallet className="h-5 w-5" />}
              iconBg="bg-primary/10"
              title="Totalmente gratuito"
              description="Sem planos pagos, sem limites. Comece agora e organize suas finanças."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold">Pronto para organizar suas finanças?</h2>
          <p className="text-muted-foreground">
            Crie sua conta em segundos e comece a registrar suas transações hoje mesmo.
          </p>
          <Link href="/auth/signup" className={cn(buttonVariants({ size: 'lg' }))}>
            Criar conta grátis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 px-4 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Conta Paga · Seu controle financeiro pessoal</p>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  iconBg,
  title,
  description,
}: {
  icon: React.ReactNode
  iconBg: string
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-card p-5 flex gap-4">
      <div className={`flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
