import { ArrowDownRight, ArrowUpRight, Tag } from 'lucide-react';
import type { Transaction } from '@/types';

interface Props {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: Props) {
  const isIncome = transaction.type === 'income';

  // Formata dinamicamente R$ com base no local BRL
  const formattedAmount = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(transaction.amount);

  // Formata D/M/Y via browser padrão
  const formattedDate = new Date(transaction.date).toLocaleDateString('pt-BR', {
    timeZone: 'UTC'
  });

  return (
    <div className="flex items-center justify-between p-4 mb-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      
      <div className="flex items-center gap-4">
        {/* Ícone da Categoria (Fake/Base para já segurar a tela) */}
        <div 
          className="w-12 h-12 flex items-center justify-center rounded-xl"
          style={{ backgroundColor: transaction.categories?.color ? `${transaction.categories.color}20` : '#E5E7EB' }}
        >
          {transaction.categories?.icon ? (
            // Futuramente mapearemos icones reais aqui. Por agora um generico Tag assumindo estilo
            <Tag className="w-5 h-5" style={{ color: transaction.categories?.color || '#6B7280' }} />
          ) : (
            <Tag className="w-5 h-5 text-gray-500" />
          )}
        </div>

        {/* Detalhes de Texto */}
        <div>
          <h3 className="font-semibold text-gray-800">{transaction.description}</h3>
          <p className="text-sm text-gray-500">
            {transaction.categories?.name || 'Sem categoria'} • {formattedDate}
          </p>
        </div>
      </div>

      {/* Valor com cores dinâmicas */}
      <div className={`flex items-center gap-2 font-bold ${isIncome ? 'text-emerald-600' : 'text-red-500'}`}>
        {isIncome ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        {isIncome ? '+' : '-'} {formattedAmount.replace('R$', '').trim()}
      </div>

    </div>
  );
}
