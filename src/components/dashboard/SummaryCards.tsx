import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'

interface Props {
  income: number
  expenses: number
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function SummaryCards({ income, expenses }: Props) {
  const balance = income - expenses

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(income)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-500">
            <TrendingDown className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-500">{formatCurrency(expenses)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo</CardTitle>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            balance >= 0 ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-500'
          }`}>
            <Wallet className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
