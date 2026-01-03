
import React, { useState } from 'react';
import { X, Calendar, DollarSign, Edit3 } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { TransactionType } from '../types';

interface Props {
  onClose: () => void;
  onSubmit: (data: {
    amount: number;
    categoryId: string;
    type: TransactionType;
    note: string;
    date: string;
  }) => void;
}

const TransactionForm: React.FC<Props> = ({ onClose, onSubmit }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCat, setSelectedCat] = useState('food');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    onSubmit({
      amount: Number(amount),
      categoryId: selectedCat,
      type,
      note: note || CATEGORIES.find(c => c.id === selectedCat)?.name || '',
      date: new Date(date).toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">记一笔</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Toggle Type */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button 
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                type === 'expense' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              支出
            </button>
            <button 
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
                type === 'income' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
              }`}
            >
              收入
            </button>
          </div>

          {/* Amount Input */}
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-2xl font-bold">¥</span>
            <input 
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 border-0 text-3xl font-bold py-4 pl-12 pr-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-200"
              autoFocus
            />
          </div>

          {/* Category Grid */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-3">选择分类</label>
            <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 hide-scrollbar">
              {CATEGORIES.filter(c => c.type === type).map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCat(c.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-2xl transition-all border-2 ${
                    selectedCat === c.id 
                      ? 'border-indigo-600 bg-indigo-50' 
                      : 'border-transparent hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-2xl ${c.color} p-2 rounded-xl shadow-sm`}>{c.icon}</span>
                  <span className="text-[10px] font-medium text-slate-600">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Note */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">备注</label>
              <div className="relative">
                <Edit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="想记点什么？"
                  className="w-full bg-slate-50 border-0 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">日期</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border-0 py-3 pl-10 pr-4 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 mt-2"
          >
            确认保存
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
