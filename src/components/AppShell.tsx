'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  LayoutDashboard,
  ArrowLeftRight,
  LogOut,
  Wallet,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ThemeToggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email ?? '')
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split('@')[0] ||
          'Usuário'
        setUserName(name)
      }
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/auth/login')
    router.refresh()
  }

  const avatarLetter = userName.charAt(0).toUpperCase() || 'U'

  const UserCard = () => (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 w-full px-2 py-2 rounded-md hover:bg-accent transition-colors focus:outline-none">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
          {avatarLetter}
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-medium truncate leading-tight">{userName || '...'}</p>
          <p className="text-xs text-muted-foreground truncate leading-tight">{userEmail}</p>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair da conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r bg-card px-4 py-6 gap-2 shrink-0">
        {/* User card (replaces brand header) */}
        <div className="mb-2">
          <UserCard />
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
        <ThemeToggle className="justify-start gap-3 w-full text-muted-foreground" showLabel />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b bg-card">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-primary text-primary-foreground">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="font-bold tracking-tight">Conta Paga</span>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMenuOpen(false)}>
          <aside
            className="absolute top-14 left-0 w-64 h-[calc(100%-3.5rem)] bg-card border-r flex flex-col px-4 py-4 gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* User info in drawer */}
            <div className="flex items-center gap-2 px-2 py-2 mb-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{userName || '...'}</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
            </div>
            <Separator className="mb-1" />
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
            <Separator className="mb-1" />
            <ThemeToggle className="justify-start gap-3 w-full text-muted-foreground" showLabel />
            <Button variant="ghost" className="justify-start gap-3 text-red-500 hover:text-red-500" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Sair da conta
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
