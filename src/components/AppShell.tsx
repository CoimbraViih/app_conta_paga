'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  ArrowLeftRight,
  LogOut,
  Wallet,
  Menu,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r bg-card px-4 py-6 gap-2 shrink-0">
        <div className="flex items-center gap-2 px-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg tracking-tight">Conta Paga</span>
        </div>
        <Separator className="mb-2" />
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                pathname === href
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <Separator className="mb-2" />
        <Button variant="ghost" className="justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight">Conta Paga</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMenuOpen(false)}>
          <aside
            className="absolute top-14 left-0 w-64 h-[calc(100%-3.5rem)] bg-card border-r flex flex-col px-4 py-6 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
            <Separator className="mb-2" />
            <Button variant="ghost" className="justify-start gap-3 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-14 md:pt-0 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
