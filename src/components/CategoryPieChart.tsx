import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Transaction } from '@/types';
import { useMemo } from 'react';

interface Props {
  transactions: Transaction[];
}

const COLORS = ['#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6', '#EC4899', '#6B7280', '#06B6D4'];

export default function CategoryPieChart({ transactions }: Props) {
  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    // Agrupa por categoria
    const groups: Record<string, { value: number; color?: string }> = {};
    
    expenses.forEach(t => {
      const categoryName = t.categories?.name || 'Sem categoria';
      if (!groups[categoryName]) {
        groups[categoryName] = { value: 0, color: t.categories?.color };
      }
      groups[categoryName].value += Number(t.amount);
    });

    return Object.entries(groups).map(([name, { value, color }], index) => ({
      name,
      value: Number(value.toFixed(2)),
      color: color || COLORS[index % COLORS.length]
    })).sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl border border-gray-100 h-[400px]">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <PieChart className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-gray-500 font-medium text-center">Nenhuma despesa registrada<br/>neste período para exibir o gráfico.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-[400px] flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Distribuição de Gastos</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              animationBegin={0}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => {
                const numericValue = typeof value === 'string' ? parseFloat(value) : (value as number);
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numericValue || 0);
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              formatter={(value) => <span className="text-sm font-medium text-gray-600">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
