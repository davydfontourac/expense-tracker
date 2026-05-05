export const CAT_EMOJI: Record<string, string> = {
  Alimentação: '🍔',
  Transporte: '🚗',
  Supermercado: '🛒',
  Pix: '⚡',
  Receita: '💰',
  Débito: '💳',
  Saúde: '💊',
  Lazer: '🎬',
  Educação: '📚',
};

export const formatCurrency = (n: number) =>
  'R$ ' +
  Math.abs(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
