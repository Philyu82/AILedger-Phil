
import React from 'react';
import { Transaction, Budget } from '../types';
import { CATEGORIES } from '../constants';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  monthlyTransactions: Transaction[];
  budgets: Budget[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<Props> = ({ monthlyTransactions, transactions, budgets, onDelete }) => {
  const stats = React.useMemo(() => {
    let income = 0;
    let expense = 0;
    monthlyTransactions.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
  }, [monthlyTransactions]);

  const totalBudget = budgets.find(b => b.categoryId === 'all')?.amount || 0;
  const budgetProgress = totalBudget > 0 ? (stats.expense / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Wallet Summary */}
      <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400 rounded-full -ml-12 -mb-12 opacity-30 blur-2xl"></div>
        
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">本月结余</p>
          <h2 className="text-4xl font-bold mb-6">¥{stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <div className="bg-green-400/20 p-2 rounded-lg">
                <ArrowDownLeft size={18} className="text-green-300" />
              </div>
              <div>
                <p className="text-indigo-100 text-xs uppercase tracking-wider">本月收入</p>
                <p className="font-semibold">¥{stats.income.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3">
              <div className="bg-red-400/20 p-2 rounded-lg">
                <ArrowUpRight size={18} className="text-red-300" />
              </div>
              <div>
                <p className="text-indigo-100 text-xs uppercase tracking-wider">本月支出</p>
                <p className="font-semibold">¥{stats.expense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-slate-800">每月预算</h3>
          <span className="text-sm text-slate-400 font-medium">
            ¥{stats.expense.toLocaleString()} / ¥{totalBudget.toLocaleString()}
          </span>
        </div>
        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full transition-all duration-1000 ${
              budgetProgress > 100 ? 'bg-red-500' : 'bg-indigo-500'
            }`}
            style={{ width: `${Math.min(budgetProgress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-400">
          {budgetProgress > 100 
            ? `注意！您已超出预算 ¥${(stats.expense - totalBudget).toLocaleString()}！` 
            : `预算余额: ¥${(totalBudget - stats.expense).toLocaleString()}`
          }
        </p>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">最近记录</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">查看全部</button>
        </div>
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border-2 border-dashed border-slate-200">
              <p className="text-slate-400">还没有账单。点击“记一笔”开始吧！</p>
            </div>
          ) : (
            transactions.slice(0, 5).map(t => {
              const category = CATEGORIES.find(c => c.id === t.categoryId);
              return (
                <div key={t.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100 shadow-sm hover:border-indigo-100 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${category?.color} text-2xl flex items-center justify-center rounded-xl shadow-sm`}>
                      {category?.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{t.note}</p>
                      <p className="text-xs text-slate-400">{category?.name} • {new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-700'}`}>
                      {t.type === 'income' ? '+' : '-'}¥{t.amount.toLocaleString()}
                    </span>
                    <button 
                      onClick={() => onDelete(t.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                    >
                      删除
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
