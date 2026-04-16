'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction } from '@/lib/types'
import AppShell from '@/components/AppShell'
import SummaryCards from '@/components/dashboard/SummaryCards'
import ExpenseChart from '@/components/dashboard/ExpenseChart'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import TransactionForm from '@/components/transactions/TransactionForm'
import PeriodFilter, { FilterPeriod, currentMonthPeriod } from '@/components/PeriodFilter'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [compareTransactions, setCompareTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<FilterPeriod>(() => currentMonthPeriod())
  const [formOpen, setFormOpen] = useState(false)

  const fetchRange = useCallback(async (from: string, to: string) => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false })
    if (error) console.error('Erro ao buscar transações:', error)
    return data ?? []
  }, [])

  useEffect(() => {
    setLoading(true)
    const run = async () => {
      const [primary, compare] = await Promise.all([
        fetchRange(period.from, period.to),
        period.compareFrom && period.compareTo
          ? fetchRange(period.compareFrom, period.compareTo)
          : Promise.resolve([]),
      ])
      setTransactions(primary)
      setCompareTransactions(compare)
      setLoading(false)
    }
    run()
  }, [period, fetchRange])

  const income = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const cmpIncome = compareTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const cmpExpenses = compareTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground capitalize">{period.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <PeriodFilter value={period} onChange={setPeriod} />
            <Button size="sm" className="gap-2 shrink-0" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova transação</span>
              <span className="sm:hidden">Nova</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-sm text-muted-foreground">
            Carregando...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <SummaryCards
              income={income}
              expenses={expenses}
              compareIncome={period.mode === 'compare' ? cmpIncome : undefined}
              compareExpenses={period.mode === 'compare' ? cmpExpenses : undefined}
              compareLabel={period.compareLabel}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ExpenseChart transactions={transactions} />
              <RecentTransactions transactions={transactions} />
            </div>
          </div>
        )}
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => {
          setLoading(true)
          fetchRange(period.from, period.to).then((data) => {
            setTransactions(data)
            setLoading(false)
          })
        }}
        transaction={null}
      />
    </AppShell>
  )
}
