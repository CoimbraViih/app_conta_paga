'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className={showLabel ? 'h-8 w-32' : 'w-9 h-9'} />

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size={showLabel ? 'default' : 'icon'}
      className={className}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Alternar tema"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {showLabel && (
        <span>{isDark ? 'Modo claro' : 'Modo escuro'}</span>
      )}
    </Button>
  )
}
