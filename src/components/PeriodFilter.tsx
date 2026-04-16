'use client'

import { useState } from 'react'
import { format, endOfMonth, parseISO, subDays, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export interface FilterPeriod {
  from: string
  to: string
  label: string
  mode: 'quick' | 'month' | 'custom' | 'compare'
  compareFrom?: string
  compareTo?: string
  compareLabel?: string
}

export function currentMonthPeriod(): FilterPeriod {
  const d = new Date()
  const monthStr = format(d, 'yyyy-MM')
  const monthDate = parseISO(`${monthStr}-01`)
  return {
    from: format(monthDate, 'yyyy-MM-dd'),
    to: format(endOfMonth(monthDate), 'yyyy-MM-dd'),
    label: format(monthDate, "MMMM 'de' yyyy", { locale: ptBR }),
    mode: 'month',
  }
}

function monthPeriod(monthStr: string): FilterPeriod {
  const monthDate = parseISO(`${monthStr}-01`)
  return {
    from: format(monthDate, 'yyyy-MM-dd'),
    to: format(endOfMonth(monthDate), 'yyyy-MM-dd'),
    label: format(monthDate, "MMMM 'de' yyyy", { locale: ptBR }),
    mode: 'month',
  }
}

function quickPeriod(days: number): FilterPeriod {
  const to = new Date()
  const from = subDays(to, days - 1)
  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(to, 'yyyy-MM-dd'),
    label: `Últimos ${days} dias`,
    mode: 'quick',
  }
}

type AdvancedMode = 'month' | 'custom' | 'compare'

interface Props {
  value: FilterPeriod
  onChange: (p: FilterPeriod) => void
}

export default function PeriodFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [advMode, setAdvMode] = useState<AdvancedMode>(
    value.mode === 'quick' ? 'month' : (value.mode as AdvancedMode)
  )

  // Por mês state
  const [selectedMonth, setSelectedMonth] = useState(
    value.mode === 'month' ? value.from.slice(0, 7) : format(new Date(), 'yyyy-MM')
  )

  // Personalizado state
  const [customFrom, setCustomFrom] = useState(value.from)
  const [customTo, setCustomTo] = useState(value.to)

  // Mês a mês state
  const today = new Date()
  const [cmpMonth1, setCmpMonth1] = useState(format(today, 'yyyy-MM'))
  const [cmpMonth2, setCmpMonth2] = useState(format(subMonths(today, 1), 'yyyy-MM'))

  function navigateMonth(delta: number) {
    const [y, m] = selectedMonth.split('-').map(Number)
    const d = new Date(y, m - 1 + delta, 1)
    setSelectedMonth(format(d, 'yyyy-MM'))
  }

  function applyQuick(days: number) {
    onChange(quickPeriod(days))
    setOpen(false)
  }

  function applyThisMonth() {
    const p = currentMonthPeriod()
    setSelectedMonth(format(new Date(), 'yyyy-MM'))
    setAdvMode('month')
    onChange(p)
    setOpen(false)
  }

  function apply() {
    if (advMode === 'month') {
      onChange(monthPeriod(selectedMonth))
    } else if (advMode === 'custom') {
      if (!customFrom || !customTo || customFrom > customTo) return
      onChange({
        from: customFrom,
        to: customTo,
        label: `${format(parseISO(customFrom), 'dd/MM/yy')} – ${format(parseISO(customTo), 'dd/MM/yy')}`,
        mode: 'custom',
      })
    } else if (advMode === 'compare') {
      const d1 = parseISO(`${cmpMonth1}-01`)
      const d2 = parseISO(`${cmpMonth2}-01`)
      const lbl1 = format(d1, "MMM/yy", { locale: ptBR })
      const lbl2 = format(d2, "MMM/yy", { locale: ptBR })
      onChange({
        from: format(d1, 'yyyy-MM-dd'),
        to: format(endOfMonth(d1), 'yyyy-MM-dd'),
        label: `${lbl1} vs ${lbl2}`,
        mode: 'compare',
        compareFrom: format(d2, 'yyyy-MM-dd'),
        compareTo: format(endOfMonth(d2), 'yyyy-MM-dd'),
        compareLabel: format(d2, "MMMM 'de' yyyy", { locale: ptBR }),
      })
    }
    setOpen(false)
  }

  const advModes: { id: AdvancedMode; label: string }[] = [
    { id: 'month', label: 'Por mês' },
    { id: 'custom', label: 'Personalizado' },
    { id: 'compare', label: 'Mês a mês' },
  ]

  const canApply =
    advMode !== 'custom' || (!!customFrom && !!customTo && customFrom <= customTo)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 h-8 px-3 rounded-md border border-input bg-background text-sm hover:bg-muted transition-colors whitespace-nowrap"
      >
        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="truncate max-w-36">{value.label}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground rotate-90 shrink-0" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Selecionar período</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-1">
            {/* Quick presets */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Acesso rápido
              </p>
              <div className="flex flex-wrap gap-2">
                {[7, 15, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => applyQuick(d)}
                    className={`px-3 py-1.5 rounded-md border text-sm transition-colors hover:bg-muted ${
                      value.mode === 'quick' && value.label === `Últimos ${d} dias`
                        ? 'bg-primary text-primary-foreground border-primary hover:bg-primary'
                        : ''
                    }`}
                  >
                    {d} dias
                  </button>
                ))}
                <button
                  onClick={applyThisMonth}
                  className="px-3 py-1.5 rounded-md border text-sm hover:bg-muted transition-colors"
                >
                  Este mês
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Advanced modes */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Avançado
              </p>

              {/* Mode selector */}
              <div className="flex rounded-lg border overflow-hidden">
                {advModes.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      advMode === m.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                    onClick={() => setAdvMode(m.id)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Por mês: nav */}
              {advMode === 'month' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="flex items-center justify-center w-8 h-8 rounded-md border hover:bg-muted transition-colors shrink-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center text-sm font-medium capitalize">
                    {format(parseISO(`${selectedMonth}-01`), "MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="flex items-center justify-center w-8 h-8 rounded-md border hover:bg-muted transition-colors shrink-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Personalizado: date range */}
              {advMode === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Data inicial</Label>
                    <Input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Data final</Label>
                    <Input
                      type="date"
                      value={customTo}
                      min={customFrom}
                      onChange={(e) => setCustomTo(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Mês a mês: two month selectors */}
              {advMode === 'compare' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Mês principal</Label>
                      <Input
                        type="month"
                        value={cmpMonth1}
                        onChange={(e) => setCmpMonth1(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Comparar com</Label>
                      <Input
                        type="month"
                        value={cmpMonth2}
                        onChange={(e) => setCmpMonth2(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Compara receitas e despesas entre os dois meses selecionados.
                  </p>
                </div>
              )}
            </div>

            {/* Apply button */}
            <div className="flex gap-2 pt-1">
              <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={apply} disabled={!canApply}>
                Aplicar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
