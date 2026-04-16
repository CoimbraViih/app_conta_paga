'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Transaction,
  TransactionFormData,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Props {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  transaction?: Transaction | null
}

const defaultForm: TransactionFormData = {
  type: 'expense',
  amount: '',
  description: '',
  category: '',
  date: format(new Date(), 'yyyy-MM-dd'),
}

export default function TransactionForm({ open, onClose, onSuccess, transaction }: Props) {
  const [form, setForm] = useState<TransactionFormData>(defaultForm)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        amount: String(transaction.amount),
        description: transaction.description,
        category: transaction.category,
        date: transaction.date,
      })
    } else {
      setForm(defaultForm)
    }
  }, [transaction, open])

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const amount = parseFloat(form.amount.replace(',', '.'))
    if (isNaN(amount) || amount <= 0) {
      toast.error('Valor inválido')
      return
    }

    setLoading(true)
    const supabase = createClient()

    const payload = {
      type: form.type,
      amount,
      description: form.description,
      category: form.category,
      date: form.date,
    }

    let error
    if (transaction) {
      ;({ error } = await supabase.from('transactions').update(payload).eq('id', transaction.id))
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      ;({ error } = await supabase.from('transactions').insert({ ...payload, user_id: user!.id }))
    }

    if (error) {
      toast.error('Erro ao salvar: ' + error.message)
    } else {
      toast.success(transaction ? 'Transação atualizada!' : 'Transação adicionada!')
      onSuccess()
      onClose()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction ? 'Editar transação' : 'Nova transação'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Type */}
          <div className="flex rounded-lg border overflow-hidden">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                form.type === 'expense'
                  ? 'bg-red-500 text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              onClick={() => setForm((f) => ({ ...f, type: 'expense', category: '' }))}
            >
              Despesa
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                form.type === 'income'
                  ? 'bg-green-500 text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
              onClick={() => setForm((f) => ({ ...f, type: 'income', category: '' }))}
            >
              Receita
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Salário..."
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm((f) => ({ ...f, category: v ?? '' }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              required
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !form.category}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
