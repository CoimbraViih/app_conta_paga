export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
  created_at: string
}

export interface TransactionFormData {
  type: TransactionType
  amount: string
  description: string
  category: string
  date: string
}

export const EXPENSE_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Vestuário',
  'Serviços',
  'Outros',
] as const

export const INCOME_CATEGORIES = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Presentes',
  'Outros',
] as const

export const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: '#f97316',
  Transporte: '#3b82f6',
  Moradia: '#8b5cf6',
  Saúde: '#ec4899',
  Educação: '#06b6d4',
  Lazer: '#84cc16',
  Vestuário: '#f59e0b',
  Serviços: '#6366f1',
  Outros: '#94a3b8',
  Salário: '#22c55e',
  Freelance: '#10b981',
  Investimentos: '#14b8a6',
  Presentes: '#a78bfa',
}
