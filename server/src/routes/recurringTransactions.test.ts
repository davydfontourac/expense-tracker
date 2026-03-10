import request from 'supertest';
import { app } from '../index';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { supabaseAdmin } from '../lib/supabase';
import { transactionController } from '../controllers/transactionController';

vi.mock('../middlewares/authMiddleware', () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = { id: 'user-123' };
    next();
  }
}));

// Mock Robusto para o Supabase
vi.mock('../lib/supabase', () => {
  const mockChain: any = {};
  
  const methods = ['from', 'select', 'eq', 'insert', 'single', 'match', 'delete', 'order', 'ilike', 'gte', 'lte', 'update'];
  
  methods.forEach(method => {
    mockChain[method] = vi.fn().mockReturnValue(mockChain);
  });

  return { supabaseAdmin: mockChain };
});

describe('Recurring Transactions Logic', () => {
  it('unidade: _generateRecurringTransactions deve gerar datas corretos', () => {
    const body = {
      frequency: 'monthly',
      installments: 3,
      date: '2026-01-01T12:00:00.000Z',
      description: 'Teste'
    };
    
    const results = transactionController._generateRecurringTransactions(body, 'u1');
    
    expect(results).toHaveLength(3);
    expect(results[0].date).toBe('2026-01-01T12:00:00.000Z');
    expect(new Date(results[1].date).getUTCMonth()).toBe(1); // Fev
    expect(new Date(results[2].date).getUTCMonth()).toBe(2); // Mar
  });
});

describe('Recurring Transactions Integration', () => {
  const mockAdmin = supabaseAdmin as any;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reinicia os retornos padrões para o mock encadeado
    const methods = ['from', 'select', 'eq', 'insert', 'match', 'delete', 'order', 'ilike', 'gte', 'lte', 'update'];
    methods.forEach(method => mockAdmin[method].mockReturnValue(mockAdmin));
  });

  it('deve gerar 3 parcelas mensais corretamente', async () => {
    const payload = {
      description: 'Aluguel',
      amount: 1000,
      date: '2026-01-01T12:00:00.000Z',
      type: 'expense',
      is_recurrent: true,
      frequency: 'monthly',
      installments: 3
    };

    mockAdmin.single
      .mockResolvedValueOnce({ data: { id: 'first-id', ...payload }, error: null })
      .mockResolvedValueOnce({ data: { id: 'first-id', ...payload }, error: null });

    const response = await request(app).post('/api/transactions').send(payload);

    expect(response.status).toBe(201);
    
    const insertCalls = mockAdmin.insert.mock.calls;
    expect(insertCalls[0][0][0].description).toBe('Aluguel');
    
    const otherInserts = insertCalls[1][0];
    expect(otherInserts).toHaveLength(2);
    expect(new Date(otherInserts[0].date).getUTCMonth()).toBe(1); // Fev
    expect(otherInserts[0].parent_id).toBe('first-id');
  });

  it('deve gerar parcelas semanais corretamente', async () => {
    const payload = {
      description: 'Semanal',
      amount: 50,
      date: '2026-01-01T12:00:00.000Z',
      type: 'expense',
      is_recurrent: true,
      frequency: 'weekly',
      installments: 2
    };

    mockAdmin.single.mockResolvedValue({ data: { id: 'w1' }, error: null });
    
    await request(app).post('/api/transactions').send(payload);

    const otherInserts = mockAdmin.insert.mock.calls[1][0];
    const d1 = new Date('2026-01-01T12:00:00.000Z');
    const d2 = new Date(otherInserts[0].date);
    const diffDays = Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    expect(diffDays).toBe(7);
  });

  it('deve gerar parcelas anuais corretamente', async () => {
    const payload = {
      description: 'Anual',
      amount: 1200,
      date: '2026-01-01T12:00:00.000Z',
      type: 'expense',
      is_recurrent: true,
      frequency: 'yearly',
      installments: 2
    };

    mockAdmin.single.mockResolvedValue({ data: { id: 'y1' }, error: null });
    
    await request(app).post('/api/transactions').send(payload);

    const otherInserts = mockAdmin.insert.mock.calls[1][0];
    expect(new Date(otherInserts[0].date).getUTCFullYear()).toBe(2027);
  });

  it('deve criar transação única se não houver recorrência', async () => {
    const payload = {
      description: 'Unico',
      amount: 100,
      date: '2026-01-01T12:00:00.000Z',
      type: 'expense'
      // is_recurrent default false
    };

    mockAdmin.single.mockResolvedValue({ data: { id: 'single-id', ...payload }, error: null });
    
    const response = await request(app).post('/api/transactions').send(payload);

    expect(response.status).toBe(201);
    expect(mockAdmin.insert).toHaveBeenCalledTimes(1);
    expect(mockAdmin.insert).toHaveBeenCalledWith([{ ...payload, user_id: 'user-123', is_recurrent: false, installments: 1 }]);
  });

  it('deve lidar com erro de banco de dados no passo secundário', async () => {
    const payload = {
      description: 'Erro',
      amount: 10,
      date: '2026-01-01T12:00:00.000Z',
      type: 'expense',
      is_recurrent: true,
      frequency: 'monthly',
      installments: 2
    };

    mockAdmin.single.mockResolvedValueOnce({ data: { id: 'ok-id' }, error: null });
    
    mockAdmin.insert
      .mockReturnValueOnce(mockAdmin) // primeira ok
      .mockResolvedValueOnce({ error: { message: 'Database Failure' } }); 

    const response = await request(app).post('/api/transactions').send(payload);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Database Failure');
  });

  it('deve lidar com erro de banco de dados no passo inicial', async () => {
    const payload = {
      description: 'Erro Inicial',
      amount: 10,
      date: '2026-01-01T12:00:00.000Z',
      type: 'expense'
    };

    mockAdmin.single.mockResolvedValueOnce({ data: null, error: { message: 'Initial Failure' } });
    
    const response = await request(app).post('/api/transactions').send(payload);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Initial Failure');
  });
});
