'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Wallet, MailCheck, AlertTriangle } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      toast.error('Erro ao cadastrar: ' + error.message)
    } else {
      setDone(true)
    }

    setLoading(false)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center mb-8 gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
              <Wallet className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Conta Paga</h1>
          </div>

          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-3">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                  <MailCheck className="h-7 w-7" />
                </div>
              </div>
              <CardTitle className="text-xl">Confirme seu e-mail</CardTitle>
              <CardDescription className="text-sm">
                Enviamos um link de confirmação para
              </CardDescription>
              <p className="font-semibold text-sm text-foreground mt-1">{email}</p>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-3 flex gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <p className="font-semibold">Verifique também a caixa de spam!</p>
                  <p>Às vezes nosso e-mail pode ser classificado como spam ou lixo eletrônico. Se não encontrar na caixa de entrada, procure nas pastas de spam ou lixo eletrônico.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Clique no link do e-mail para ativar sua conta e, em seguida, faça login.
              </p>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-2">
              <Link href="/auth/login" className={cn(buttonVariants(), 'w-full justify-center')}>
                Ir para o login
              </Link>
              <button
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => { setDone(false); setEmail(''); setPassword('') }}
              >
                Usar outro e-mail
              </button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Conta Paga</h1>
          <p className="text-sm text-muted-foreground">Seu controle financeiro pessoal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Criar conta</CardTitle>
            <CardDescription>Preencha os dados para se cadastrar</CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Criando conta...' : 'Criar conta'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Entrar
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
