
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

interface Props {
  transactions: Transaction[];
}

const ReportsView: React.FC<Props> = ({ transactions }) => {
  const expenseData = useMemo(() => {
    const data: Record<string, number> = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      const catName = CATEGORIES.find(c => c.id === t.categoryId)?.name || '其他支出';
      data[catName] = (data[catName] || 0) + t.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const trendData = useMemo(() => {
    const days: Record<string, { income: number, expense: number }> = {};
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    last7Days.forEach(day => {
      days[day] = { income: 0, expense: 0 };
    });

    transactions.forEach(t => {
      const day = t.date.split('T')[0];
      if (days[day]) {
        if (t.type === 'income') days[day].income += t.amount;
        else days[day].expense += t.amount;
      }
    });

    return Object.entries(days).map(([date, stats]) => ({
      date: date.split('-').slice(1).join('/'),
      ...stats
    }));
  }, [transactions]);

  const COLORS = ['#6366f1', '#f43f5e', '#ec4899', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">统计报表</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">支出分类占比</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `¥${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day Trend */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">最近7天趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip 
                  formatter={(value: number, name: string) => [`¥${value.toLocaleString()}`, name === 'income' ? '收入' : '支出']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar name="收入" dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="支出" dataKey="expense" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Spending Habits Highlight */}
      <div className="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
        <h3 className="font-bold text-indigo-900 mb-4">AI 消费洞察</h3>
        <p className="text-indigo-700 leading-relaxed">
          分析您的近期记录，本周在 
          <span className="font-bold"> {expenseData.sort((a,b) => b.value - a.value)[0]?.name || '...'} </span> 
          方面的支出最高。建议关注此项开支，看看是否有节省空间，加油达成您的财务目标！
        </p>
      </div>
    </div>
  );
};

export default ReportsView;
