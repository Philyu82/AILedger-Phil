
import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'food', name: '餐饮', icon: '🍔', color: 'bg-orange-400', type: 'expense' },
  { id: 'transport', name: '交通', icon: '🚗', color: 'bg-blue-400', type: 'expense' },
  { id: 'shopping', name: '购物', icon: '🛍️', color: 'bg-pink-400', type: 'expense' },
  { id: 'housing', name: '居住', icon: '🏠', color: 'bg-indigo-400', type: 'expense' },
  { id: 'entertainment', name: '娱乐', icon: '🎮', color: 'bg-purple-400', type: 'expense' },
  { id: 'health', name: '医疗', icon: '🏥', color: 'bg-red-400', type: 'expense' },
  { id: 'education', name: '教育', icon: '📚', color: 'bg-cyan-400', type: 'expense' },
  { id: 'other_exp', name: '其他支出', icon: '✨', color: 'bg-gray-400', type: 'expense' },
  { id: 'salary', name: '工资', icon: '💰', color: 'bg-green-500', type: 'income' },
  { id: 'bonus', name: '奖金', icon: '🧧', color: 'bg-red-500', type: 'income' },
  { id: 'investment', name: '投资', icon: '📈', color: 'bg-emerald-500', type: 'income' },
  { id: 'other_inc', name: '其他收入', icon: '🧧', color: 'bg-lime-500', type: 'income' },
];

export const APP_PRIMARY_COLOR = '#6366f1'; // Indigo-500
