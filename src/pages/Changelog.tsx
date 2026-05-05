import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Zap, Sparkles } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const COPY: any = {
  'pt-BR': {
    title: 'Changelog',
    subtitle: 'Acompanhe as últimas melhorias e novidades do Expense Tracker.',
    entries: [
      {
        version: 'v1.2.0',
        date: 'Abril 2026',
        tag: 'Novo',
        title: 'Importação Inteligente',
        items: [
          'Novo assistente de importação de CSV com mapeamento dinâmico.',
          'Detecção automática de categorias baseada em palavras-chave.',
          'Visualização prévia das transações antes de confirmar.'
        ],
        icon: <Zap className="w-5 h-5 text-yellow-500" />
      },
      {
        version: 'v1.1.0',
        date: 'Março 2026',
        tag: 'Melhoria',
        title: 'Experiência Mobile',
        items: [
          'Interface de autenticação otimizada para dispositivos móveis.',
          'Suporte a gestos para navegação no dashboard.',
          'Melhoria na performance de carregamento inicial.'
        ],
        icon: <Rocket className="w-5 h-5 text-blue-500" />
      },
      {
        version: 'v1.0.0',
        date: 'Fevereiro 2026',
        tag: 'Lançamento',
        title: 'O Início',
        items: [
          'Lançamento oficial da plataforma.',
          'Gestão de categorias com emojis.',
          'Dashboard com visão mensal e saldo acumulado.'
        ],
        icon: <Sparkles className="w-5 h-5 text-purple-500" />
      }
    ]
  },
  'en': {
    title: 'Changelog',
    subtitle: 'Keep track of the latest improvements and news from Expense Tracker.',
    entries: [
      {
        version: 'v1.2.0',
        date: 'April 2026',
        tag: 'New',
        title: 'Smart Import',
        items: [
          'New CSV import wizard with dynamic mapping.',
          'Auto-detection of categories based on keywords.',
          'Transaction preview before confirmation.'
        ],
        icon: <Zap className="w-5 h-5 text-yellow-500" />
      },
      {
        version: 'v1.1.0',
        date: 'March 2026',
        tag: 'Improvement',
        title: 'Mobile Experience',
        items: [
          'Auth interface optimized for mobile devices.',
          'Gesture support for dashboard navigation.',
          'Initial load performance improvements.'
        ],
        icon: <Rocket className="w-5 h-5 text-blue-500" />
      },
      {
        version: 'v1.0.0',
        date: 'February 2026',
        tag: 'Launch',
        title: 'The Beginning',
        items: [
          'Official platform launch.',
          'Category management with emojis.',
          'Dashboard with monthly view and accumulated balance.'
        ],
        icon: <Sparkles className="w-5 h-5 text-purple-500" />
      }
    ]
  }
};

export default function Changelog() {
  const navigate = useNavigate();
  const [lang] = useState(() => localStorage.getItem('language') || 'pt-BR');
  const t = COPY[lang] || COPY['pt-BR'];

  return (
    <PageTransition className="min-h-screen bg-white dark:bg-[#0c0c1d] pb-20">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0c0c1d]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 p-6">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 pt-12">
        <div className="space-y-12">
          <section className="text-center space-y-4 mb-16">
            <div className="w-20 h-20 bg-yellow-500/10 rounded-[28px] flex items-center justify-center mx-auto mb-6">
              <Zap className="w-10 h-10 text-yellow-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{t.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              {t.subtitle}
            </p>
          </section>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-100 dark:before:via-white/5 before:to-transparent">
            {t.entries.map((entry: any, idx: number) => (
              <motion.div 
                key={entry.version}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex items-start gap-8 group"
              >
                <div className="absolute left-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-[#0c0c1d] rounded-full border-2 border-gray-100 dark:border-white/10 z-10 group-hover:border-blue-500 transition-colors">
                  {entry.icon}
                </div>
                
                <div className="flex-1 ml-4 pt-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">{entry.version}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-full border border-gray-200 dark:border-white/5">{entry.tag}</span>
                    <span className="text-xs text-gray-400 font-medium ml-auto">{entry.date}</span>
                  </div>
                  
                  <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/5 group-hover:border-blue-500/20 transition-all">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{entry.title}</h3>
                    <ul className="space-y-3">
                      {entry.items.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500/40 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
