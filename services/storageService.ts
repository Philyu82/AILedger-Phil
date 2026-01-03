
import { Transaction, Budget } from '../types';

const STORAGE_KEYS = {
  TRANSACTIONS: 'yy_transactions',
  BUDGETS: 'yy_budgets',
  USER_PREFS: 'yy_prefs'
};

// 检查是否在微信环境中
const isWechat = typeof (window as any).wx !== 'undefined' && (window as any).wx.getSystemInfo;

const getItem = (key: string): string | null => {
  if (isWechat) {
    try {
      return (window as any).wx.getStorageSync(key);
    } catch (e) {
      return null;
    }
  }
  return localStorage.getItem(key);
};

const setItem = (key: string, value: string): void => {
  if (isWechat) {
    try {
      (window as any).wx.setStorageSync(key, value);
    } catch (e) {}
    return;
  }
  localStorage.setItem(key, value);
};

export const storageService = {
  getTransactions: (): Transaction[] => {
    const data = getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? (typeof data === 'string' ? JSON.parse(data) : data) : [];
  },

  saveTransactions: (transactions: Transaction[]) => {
    setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getBudgets: (): Budget[] => {
    const data = getItem(STORAGE_KEYS.BUDGETS);
    const parsed = data ? (typeof data === 'string' ? JSON.parse(data) : data) : null;
    return parsed || [{ id: 'total-budget', categoryId: 'all', amount: 3000, period: 'monthly' }];
  },

  saveBudgets: (budgets: Budget[]) => {
    setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }
};
