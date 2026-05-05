import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, HelpCircle, Import, Tags, Wallet } from 'lucide-react';
import PageTransition from '@/components/PageTransition';

const COPY: any = {
  'pt-BR': {
    title: 'Documentação',
    subtitle: 'Tudo o que você precisa saber para dominar suas finanças com o Expense Tracker.',
    sections: [
      {
        icon: <Wallet className="w-6 h-6 text-emerald-500" />,
        title: 'Primeiros Passos',
        content: 'Ao criar sua conta, você será levado ao Dashboard. Lá você terá uma visão geral do seu saldo disponível, receitas e despesas do mês atual.'
      },
      {
        icon: <Import className="w-6 h-6 text-blue-500" />,
        title: 'Importando Dados (CSV)',
        content: 'Você pode importar extratos de qualquer banco. Nosso assistente detecta as colunas automaticamente e permite que você revise cada transação antes de salvar.'
      },
      {
        icon: <Tags className="w-6 h-6 text-purple-500" />,
        title: 'Categorias e Emojis',
        content: 'Organize seus gastos com categorias personalizadas. Você pode escolher cores e emojis para deixar o dashboard com a sua cara.'
      },
      {
        icon: <HelpCircle className="w-6 h-6 text-amber-500" />,
        title: 'Segurança e Privacidade',
        content: 'Seus dados são seus. Utilizamos Row Level Security (RLS) para garantir que apenas você tenha acesso às suas informações financeiras.'
      }
    ]
  },
  'en': {
    title: 'Documentation',
    subtitle: 'Everything you need to know to master your finances with Expense Tracker.',
    sections: [
      {
        icon: <Wallet className="w-6 h-6 text-emerald-500" />,
        title: 'Getting Started',
        content: 'Once you create your account, you will be taken to the Dashboard. There you will have an overview of your available balance, income, and expenses for the current month.'
      },
      {
        icon: <Import className="w-6 h-6 text-blue-500" />,
        title: 'Importing Data (CSV)',
        content: 'You can import statements from any bank. Our assistant automatically detects columns and allows you to review each transaction before saving.'
      },
      {
        icon: <Tags className="w-6 h-6 text-purple-500" />,
        title: 'Categories and Emojis',
        content: 'Organize your spending with custom categories. You can choose colors and emojis to make the dashboard your own.'
      },
      {
        icon: <HelpCircle className="w-6 h-6 text-amber-500" />,
        title: 'Security and Privacy',
        content: 'Your data is yours. We use Row Level Security (RLS) to ensure that only you have access to your financial information.'
      }
    ]
  }
};

export default function Docs() {
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
            <div className="w-20 h-20 bg-emerald-500/10 rounded-[28px] flex items-center justify-center mx-auto mb-6">
              <Book className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{t.title}</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              {t.subtitle}
            </p>
          </section>

          <div className="grid gap-6">
            {t.sections.map((section: any, idx: number) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-gray-50 dark:bg-white/5 rounded-[32px] border border-gray-100 dark:border-white/5 hover:border-emerald-500/20 transition-all"
              >
                <div className="w-12 h-12 bg-white dark:bg-[#161629] rounded-2xl shadow-sm flex items-center justify-center mb-6">
                  {section.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{section.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>

          <section className="mt-16 p-10 bg-[#0c0c1d] dark:bg-white rounded-[40px] text-center space-y-6">
            <h3 className="text-2xl font-bold text-white dark:text-[#0c0c1d]">Ainda tem dúvidas?</h3>
            <p className="text-white/60 dark:text-[#0c0c1d]/60 max-w-sm mx-auto">
              Nosso projeto é open source. Você pode conferir o código ou abrir uma issue no GitHub.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://github.com/davydfontourac/expense-tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 px-8 items-center justify-center bg-white dark:bg-[#0c0c1d] text-[#0c0c1d] dark:text-white font-bold rounded-2xl hover:scale-105 transition-transform"
              >
                Ver no GitHub
              </a>
            </div>
          </section>
        </div>
      </main>
    </PageTransition>
  );
}
