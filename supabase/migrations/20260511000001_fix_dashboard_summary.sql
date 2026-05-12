-- Fix: corrige tipos de variáveis na função get_dashboard_summary
-- O bug era que v_start_date e v_end_date foram declarados como 'timestamp'
-- mas a coluna 'date' na tabela transactions é do tipo 'date'.
-- Isso causava um cast implícito que fazia o filtro BETWEEN falhar silenciosamente,
-- retornando 0 para receitas, despesas e saldo.

CREATE OR REPLACE FUNCTION public.get_dashboard_summary(p_month int, p_year int)
RETURNS json AS $$
DECLARE
  v_income decimal;
  v_expense decimal;
  v_total_balance decimal;
  v_caixinha_balance decimal;
  v_year_balance decimal;
  v_user_id uuid;
  v_start_date date;   -- ✅ CORRIGIDO: era 'timestamp', deve ser 'date'
  v_end_date   date;   -- ✅ CORRIGIDO: era 'timestamp', deve ser 'date'
BEGIN
  v_user_id := auth.uid();

  -- Define o intervalo do mês selecionado
  v_start_date := make_date(p_year, p_month, 1);
  v_end_date   := (v_start_date + interval '1 month' - interval '1 day')::date;

  -- Receitas do mês (apenas tipo income)
  SELECT COALESCE(SUM(amount), 0) INTO v_income
  FROM public.transactions
  WHERE user_id = v_user_id
    AND type = 'income'
    AND date BETWEEN v_start_date AND v_end_date;

  -- Despesas do mês (apenas tipo expense)
  SELECT COALESCE(SUM(amount), 0) INTO v_expense
  FROM public.transactions
  WHERE user_id = v_user_id
    AND type = 'expense'
    AND date BETWEEN v_start_date AND v_end_date;

  -- Saldo disponível acumulado (TODO o histórico até o fim do mês selecionado)
  SELECT COALESCE(SUM(
    CASE
      WHEN type IN ('income', 'transfer_in')  THEN  amount
      WHEN type IN ('expense', 'transfer_out') THEN -amount
      ELSE 0
    END
  ), 0) INTO v_total_balance
  FROM public.transactions
  WHERE user_id = v_user_id
    AND date <= v_end_date;

  -- Saldo Caixinhas (acumulado de transferências para categorias de caixinha/investimento)
  -- LEFT JOIN: garante que transações sem categoria não sejam excluídas acidentalmente
  SELECT COALESCE(SUM(
    CASE
      WHEN t.type = 'transfer_out' THEN  t.amount
      WHEN t.type = 'transfer_in'  THEN -t.amount
      ELSE 0
    END
  ), 0) INTO v_caixinha_balance
  FROM public.transactions t
  LEFT JOIN public.categories c ON t.category_id = c.id
  WHERE t.user_id = v_user_id
    AND (c.name ILIKE '%caixinha%' OR c.name ILIKE '%investimento%' OR c.name ILIKE '%reserva%')
    AND t.date <= v_end_date;

  -- Saldo do Ano (todo o ano selecionado)
  SELECT COALESCE(SUM(
    CASE
      WHEN type IN ('income', 'transfer_in')  THEN  amount
      WHEN type IN ('expense', 'transfer_out') THEN -amount
      ELSE 0
    END
  ), 0) INTO v_year_balance
  FROM public.transactions
  WHERE user_id = v_user_id
    AND extract(year from date) = p_year;

  RETURN json_build_object(
    'income',           v_income,
    'expense',          v_expense,
    'availableBalance', v_total_balance,
    'caixinhaBalance',  v_caixinha_balance,
    'yearBalance',      v_year_balance
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_dashboard_summary(int, int) IS
  'Retorna resumo financeiro do mês/ano. Fix: tipos de variáveis de data corrigidos para date (era timestamp).';
