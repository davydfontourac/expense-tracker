CREATE TYPE transaction_type AS ENUM ('income', 'expense');
CREATE TYPE recurrence_frequency AS ENUM ('weekly', 'monthly', 'yearly');

-- Tabela de Categorias
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  color VARCHAR(50) DEFAULT '#3b82f6',
  icon VARCHAR(50) DEFAULT 'Tag',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tabela de Transações
CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  amount DECIMAL(12, 2) NOT NULL,
  type transaction_type NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_recurrent BOOLEAN DEFAULT false,
  frequency recurrence_frequency,
  parent_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Ativar RLS nas tabelas
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Políticas para 'categories'
-- Usuário só pode ler (SELECT) suas próprias categorias
CREATE POLICY "Users can view their own categories" 
ON categories FOR SELECT 
USING (auth.uid() = user_id);

-- Usuário só pode criar (INSERT) suas próprias categorias
CREATE POLICY "Users can insert their own categories" 
ON categories FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Usuário só pode editar (UPDATE) suas próprias categorias
CREATE POLICY "Users can update their own categories" 
ON categories FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Usuário só pode deletar (DELETE) suas próprias categorias
CREATE POLICY "Users can delete their own categories" 
ON categories FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para 'transactions'
-- Usuário só pode ler (SELECT) suas próprias transações
CREATE POLICY "Users can view their own transactions" 
ON transactions FOR SELECT 
USING (auth.uid() = user_id);

-- Usuário só pode criar (INSERT) suas próprias transações
CREATE POLICY "Users can insert their own transactions" 
ON transactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Usuário só pode editar (UPDATE) suas próprias transações
CREATE POLICY "Users can update their own transactions" 
ON transactions FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Usuário só pode deletar (DELETE) suas próprias transações
CREATE POLICY "Users can delete their own transactions" 
ON transactions FOR DELETE 
USING (auth.uid() = user_id);
-- Tabela de Perfis
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS para 'profiles'
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas para 'profiles'
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Trigger para criar perfil automaticamente no SignUp (Opcional, mas recomendado)
-- Vamos deixar manual por enquanto via frontend para simplificar a lógica inicial.
-- Migration: Automação de Novo Usuário (Perfis e Categorias)
-- Issue: #02

-- 1. Função para lidar com o novo usuário
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Inserir Perfil automático
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );

  -- Inserir Categorias Padrão automáticas
  INSERT INTO public.categories (name, icon, color, user_id)
  VALUES
    ('Salário', 'banknote', '#10B981', new.id),
    ('Investimentos', 'trending-up', '#059669', new.id),
    ('Moradia', 'home', '#3B82F6', new.id),
    ('Conta de Luz', 'zap', '#F59E0B', new.id),
    ('Conta de Água', 'droplets', '#06B6D4', new.id),
    ('Internet', 'wifi', '#6366F1', new.id),
    ('Supermercado', 'shopping-cart', '#8B5CF6', new.id),
    ('Alimentação', 'utensils', '#EF4444', new.id),
    ('Transporte', 'car', '#6B7280', new.id),
    ('Lazer', 'clapperboard', '#F472B6', new.id),
    ('Saúde', 'heart', '#10B981', new.id),
    ('Educação', 'graduation-cap', '#4F46E5', new.id),
    ('Assinaturas', 'tv', '#EC4899', new.id),
    ('Vestuário', 'shirt', '#D946EF', new.id);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Trigger para disparar após a criação do usuário no Auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

COMMENT ON FUNCTION public.handle_new_user() IS 'Cria perfil e categorias padrão automaticamente para novos usuários do Auth';
