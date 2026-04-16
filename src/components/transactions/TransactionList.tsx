'use client'

import { Transaction, CATEGORY_COLORS } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { toast } from 'sonner'

interface Props {
  transactions: Transaction[]
  onEdit: (t: Transaction) => void
  onRefresh: () => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export default function TransactionList({ transactions, onEdit, onRefresh }: Props) {
  async function handleDelete(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) {
      toast.error('Erro ao excluir: ' + error.message)
    } else {
      toast.success('Transação excluída')
      onRefresh()
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
        <p className="text-muted-foreground text-sm">Nenhuma transação encontrada.</p>
        <p className="text-muted-foreground text-xs">Adicione uma transação para começar.</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {transactions.map((t) => (
        <div key={t.id} className="flex items-center gap-3 py-3 px-1 hover:bg-muted/30 rounded-md transition-colors">
          {/* Icon */}
          <div
            className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${
              t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
            }`}
          >
            {t.type === 'income' ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{t.description}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[t.category] ?? '#94a3b8' }}
              />
              <span className="text-xs text-muted-foreground">{t.category}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {format(parseISO(t.date), "d 'de' MMM", { locale: ptBR })}
              </span>
            </div>
          </div>

          {/* Amount */}
          <span
            className={`text-sm font-semibold shrink-0 ${
              t.type === 'income' ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
          </span>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center h-8 w-8 shrink-0 rounded-md hover:bg-muted transition-colors focus:outline-none">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(t)}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => handleDelete(t.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
