import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Transaction } from '@/types';
import TransactionItem from './TransactionItem';
import { ReceiptText } from 'lucide-react';

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get<Transaction[]>('/transactions');
        setTransactions(response.data);
      } catch (err) {
        console.error(err);
        setError('Ocorreu um erro ao carregar as transações.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 animate-pulse">Carregando transações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
        <p>⚠️ {error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl">
        <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
          <ReceiptText className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhuma transação ainda</h3>
        <p className="text-gray-500 max-w-sm text-center">
          Seu caixa está vazio. Comece a registrar suas entradas e saídas para ver os gráficos e listar aqui!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Últimas Transações</h2>
      <div className="flex flex-col space-y-2">
        {transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}
