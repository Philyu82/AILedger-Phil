
import React, { useMemo } from 'react';
import { Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { Trash2, Search } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<Props> = ({ transactions, onDelete }) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      t.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
      CATEGORIES.find(c => c.id === t.categoryId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const grouped = useMemo(() => {
    const groups: Record<string, Transaction[]> = {};
    filteredTransactions.forEach(t => {
      const date = new Date(t.date).toLocaleDateString('zh-CN', { 
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(t);
    });
    return groups;
  }, [filteredTransactions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">账单明细</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="搜索备注或分类..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="space-y-8 pb-10">
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-400">没有找到匹配的账单记录。</p>
          </div>
        ) : (
          (Object.entries(grouped) as [string, Transaction[]][]).map(([date, items]) => (
            <div key={date}>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">{date}</h3>
              <div className="space-y-3">
                {items.map(t => {
                  const cat = CATEGORIES.find(c => c.id === t.categoryId);
                  return (
                    <div key={t.id} className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-50 shadow-sm group hover:border-indigo-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${cat?.color} text-2xl flex items-center justify-center rounded-xl shadow-sm`}>
                          {cat?.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{t.note}</p>
                          <p className="text-xs text-slate-400">{cat?.name} • {new Date(t.date).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-700'}`}>
                          {t.type === 'income' ? '+' : '-'}¥{t.amount.toLocaleString()}
                        </span>
                        <button 
                          onClick={() => onDelete(t.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryView;
