import { useAuth } from '@/context/AuthContext';
import { LogOut, Wallet } from 'lucide-react';
import TransactionList from '@/components/TransactionList';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <nav className="max-w-7xl mx-auto flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">Controle de Gastos</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm hidden sm:block">
            {user?.email}
          </span>
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-red-600 font-medium hover:bg-red-50 py-2 px-4 rounded-lg transition-colors border border-transparent hover:border-red-100"
          >
            Sair
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 lg:px-0">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-10">
          <TransactionList />
        </div>
      </main>
    </div>
  );
}
