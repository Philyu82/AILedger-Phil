
export type TransactionType = 'expense' | 'income';

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface Transaction {
  id: string;
  amount: number;
  categoryId: string;
  type: TransactionType;
  note: string;
  date: string; // ISO string
  createdAt: string;
}

export interface Budget {
  id: string;
  categoryId: string; // 'all' for total budget
  amount: number;
  period: 'monthly';
}

export interface DailySummary {
  date: string;
  income: number;
  expense: number;
  transactions: Transaction[];
}

export type ViewType = 'dashboard' | 'history' | 'charts' | 'settings';
