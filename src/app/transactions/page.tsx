'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Transaction, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/types'
import AppShell from '@/components/AppShell'
import TransactionForm from '@/components/transactions/TransactionForm'
import TransactionList from '@/components/transactions/TransactionList'
import PeriodFilter, { FilterPeriod, currentMonthPeriod } from '@/components/PeriodFilter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search } from 'lucide-react'

const ALL_CATEGORIES = ['Todas', ...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES.filter(
  (c) => !EXPENSE_CATEGORIES.includes(c as never)
)]

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Todas')
  const [period, setPeriod] = useState<FilterPeriod>(() => currentMonthPeriod())

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', period.from)
      .lte('date', period.to)
      .order('date', { ascending: false })

    if (error) {
      console.error('Erro ao buscar transações:', error)
    } else if (data) {
      setTransactions(data)
    }
    setLoading(false)
  }, [period])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filtered = transactions.filter((t) => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Todas' || t.category === category
    return matchSearch && matchCat
  })

  function handleEdit(t: Transaction) {
    setEditing(t)
    setFormOpen(true)
  }

  return (
    <AppShell>
      <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Transações</h1>
          <Button onClick={() => { setEditing(null); setFormOpen(true) }} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nova transação</span>
            <span className="sm:hidden">Nova</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar descrição..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <PeriodFilter value={period} onChange={setPeriod} />
          <Select value={category} onValueChange={(v) => setCategory(v ?? 'Todas')}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground font-normal">
              {filtered.length} transação(ões) · {period.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Carregando...
              </div>
            ) : (
              <TransactionList
                transactions={filtered}
                onEdit={handleEdit}
                onRefresh={fetchTransactions}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <TransactionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={fetchTransactions}
        transaction={editing}
      />
    </AppShell>
  )
}
