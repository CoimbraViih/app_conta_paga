import { Transaction, CATEGORY_COLORS } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

interface Props {
  transactions: Transaction[]
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function RecentTransactions({ transactions }: Props) {
  const recent = transactions.slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">Transações recentes</CardTitle>
        <Link href="/transactions" className="text-xs text-primary hover:underline">
          Ver todas
        </Link>
      </CardHeader>
      <CardContent>
        {recent.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Nenhuma transação neste mês
          </div>
        ) : (
          <div className="divide-y">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-2.5">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                    t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                  }`}
                >
                  {t.type === 'income' ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{t.description}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_COLORS[t.category] ?? '#94a3b8' }}
                    />
                    <span className="text-xs text-muted-foreground">{t.category}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {format(parseISO(t.date), "d MMM", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                <span className={`text-sm font-semibold shrink-0 ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-500'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
