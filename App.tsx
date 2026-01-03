
import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutGrid, 
  History, 
  BarChart3, 
  Settings, 
  Plus, 
  Sparkles,
  Wallet
} from 'lucide-react';
import { Transaction, ViewType, Budget } from './types';
import { storageService } from './services/storageService';
import Dashboard from './components/Dashboard';
import HistoryView from './components/HistoryView';
import ReportsView from './components/ReportsView';
import TransactionForm from './components/TransactionForm';
import AIEntry from './components/AIEntry';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    setTransactions(storageService.getTransactions());
    setBudgets(storageService.getBudgets());
  }, []);

  const handleAddTransactions = (items: Omit<Transaction, 'id' | 'createdAt'> | Omit<Transaction, 'id' | 'createdAt'>[]) => {
    const itemsArray = Array.isArray(items) ? items : [items];
    const newEntries: Transaction[] = itemsArray.map(item => ({
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    }));
    
    const updated = [...newEntries, ...transactions];
    setTransactions(updated);
    storageService.saveTransactions(updated);
    setShowForm(false);
    setShowAI(false);
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    storageService.saveTransactions(updated);
  };

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  }, [transactions]);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 md:pl-64">
      {/* Mobile Header: Manual Entry moved here */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <Wallet size={18} />
          </div>
          <h1 className="font-bold text-lg">元元记账</h1>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-slate-50 text-slate-500 p-2 rounded-xl hover:bg-slate-100 transition-colors border border-slate-100"
        >
          <Plus size={20} />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r fixed left-0 top-0 bottom-0 z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Wallet size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight">元元记账 AI</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <NavItem 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
            icon={<LayoutGrid size={20} />} 
            label="收支总览" 
          />
          <NavItem 
            active={activeView === 'history'} 
            onClick={() => setActiveView('history')} 
            icon={<History size={20} />} 
            label="账单明细" 
          />
          <NavItem 
            active={activeView === 'charts'} 
            onClick={() => setActiveView('charts')} 
            icon={<BarChart3 size={20} />} 
            label="统计报表" 
          />
          <NavItem 
            active={activeView === 'settings'} 
            onClick={() => setActiveView('settings')} 
            icon={<Settings size={20} />} 
            label="设置中心" 
          />
        </nav>

        <div className="p-4 border-t">
          <button 
            onClick={() => setShowAI(true)}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-indigo-100"
          >
            <Sparkles size={20} className="text-yellow-200" /> AI 智能记账
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="w-full mt-3 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all border border-slate-100"
          >
            <Plus size={20} /> 手动记一笔
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeView === 'dashboard' && (
          <Dashboard 
            transactions={transactions} 
            monthlyTransactions={currentMonthTransactions}
            budgets={budgets}
            onDelete={handleDeleteTransaction}
          />
        )}
        {activeView === 'history' && (
          <HistoryView transactions={transactions} onDelete={handleDeleteTransaction} />
        )}
        {activeView === 'charts' && (
          <ReportsView transactions={transactions} />
        )}
        {activeView === 'settings' && (
          <div className="p-8 text-center text-slate-500">
            <Settings size={48} className="mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-semibold text-slate-700">设置</h2>
            <p className="mt-2">个人资料及数据导出功能即将上线！</p>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation: AI moved to center */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around py-3 px-2 z-40 pb-safe">
        <NavIconButton 
          active={activeView === 'dashboard'} 
          onClick={() => setActiveView('dashboard')} 
          icon={<LayoutGrid size={24} />} 
        />
        <NavIconButton 
          active={activeView === 'history'} 
          onClick={() => setActiveView('history')} 
          icon={<History size={24} />} 
        />
        
        {/* Main AI Center Button */}
        <div className="relative -top-6">
          <button 
            onClick={() => setShowAI(true)}
            className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-300 ring-[6px] ring-slate-50 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Sparkles size={32} className="relative z-10 text-yellow-200 drop-shadow-sm" />
          </button>
        </div>

        <NavIconButton 
          active={activeView === 'charts'} 
          onClick={() => setActiveView('charts')} 
          icon={<BarChart3 size={24} />} 
        />
        <NavIconButton 
          active={activeView === 'settings'} 
          onClick={() => setActiveView('settings')} 
          icon={<Settings size={24} />} 
        />
      </nav>

      {/* Overlays */}
      {showForm && (
        <TransactionForm 
          onClose={() => setShowForm(false)} 
          onSubmit={handleAddTransactions} 
        />
      )}
      {showAI && (
        <AIEntry 
          onClose={() => setShowAI(false)} 
          onSubmit={handleAddTransactions} 
        />
      )}
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
      active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const NavIconButton = ({ active, onClick, icon }: any) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-2xl transition-all ${
      active ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400'
    }`}
  >
    {icon}
  </button>
);

export default App;
