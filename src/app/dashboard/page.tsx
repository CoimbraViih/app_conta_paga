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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(format(new Date(), 'yyyy-MM'))
  const [formOpen, setFormOpen] = useState(false)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const [year, mon] = month.split('-')
    const from = `${year}-${mon}-01`
    const to = `${year}-${mon}-31`

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', from)
      .lte('date', to)
      .order('date', { ascending: false })

    if (!error && data) setTransactions(data)
    setLoading(false)
  }, [month])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)

  const [year, mon] = month.split('-')
  const monthLabel = format(new Date(Number(year), Number(mon) - 1, 1), "MMMM 'de' yyyy", { locale: ptBR })

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-muted-foreground capitalize">{monthLabel}</p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-40"
            />
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
            <SummaryCards income={income} expenses={expenses} />

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
        onSuccess={fetchTransactions}
        transaction={null}
      />
    </AppShell>
  )
}
