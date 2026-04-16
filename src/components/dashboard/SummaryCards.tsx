import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface Props {
  income: number
  expenses: number
  compareIncome?: number
  compareExpenses?: number
  compareLabel?: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

function Delta({ current, prev, label }: { current: number; prev: number; label: string }) {
  const diff = current - prev
  const pct = prev !== 0 ? Math.abs((diff / prev) * 100).toFixed(0) : null
  const up = diff >= 0

  return (
    <p className={`text-xs mt-1 flex items-center gap-1 ${up ? 'text-green-600' : 'text-red-500'}`}>
      <span>{up ? '▲' : '▼'}</span>
      <span>
        {pct ? `${pct}%` : '—'} vs {label}
      </span>
    </p>
  )
}

export default function SummaryCards({ income, expenses, compareIncome, compareExpenses, compareLabel }: Props) {
  const balance = income - expenses
  const hasCompare = compareIncome !== undefined && compareExpenses !== undefined && compareLabel

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(income)}</p>
          {hasCompare && (
            <Delta current={income} prev={compareIncome!} label={compareLabel!} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500">
            <TrendingDown className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-500">{formatCurrency(expenses)}</p>
          {hasCompare && (
            <Delta current={expenses} prev={compareExpenses!} label={compareLabel!} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            balance >= 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500'
          }`}>
            <Wallet className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
            {formatCurrency(balance)}
          </p>
          {hasCompare && (
            <Delta
              current={balance}
              prev={compareIncome! - compareExpenses!}
              label={compareLabel!}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
