// landing.jsx — Expense Tracker landing page
// Bilingual (PT/EN), light hero + dark feature section, Vercel-style depth.

const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────────────────────────
// Reveal on scroll (IntersectionObserver) + delayed entry for above-the-fold
// ─────────────────────────────────────────────────────────────────────────────
function Reveal({ children, as = 'div', variant = 'up', delay = 0, afterLoad = 0, className = '', ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (afterLoad > 0) {
      // Dashboard mockup sits in the first fold — don't wait for scroll.
      const t = setTimeout(() => setSeen(true), afterLoad);
      return () => clearTimeout(t);
    }
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { setSeen(true); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [afterLoad]);

  const Tag = as;
  const cls = `reveal reveal-${variant} ${seen ? 'in' : ''} ${className}`.trim();
  return <Tag ref={ref} className={cls} data-delay={delay || undefined} {...rest}>{children}</Tag>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Copy (PT-BR + EN)
// ─────────────────────────────────────────────────────────────────────────────
const COPY = {
  'pt-BR': {
    nav: { features: 'Recursos', how: 'Como funciona', faq: 'FAQ', github: 'GitHub', signin: 'Entrar', cta: 'Começar grátis' },
    hero: {
      badge: '100% open source · gratuito',
      h1a: 'Seu dinheiro,',
      h1b: 'sob controle.',
      sub: 'Rastreie despesas, receitas e investimentos em um só lugar. Importe extratos do seu banco, categorize automaticamente e entenda para onde vai cada real.',
      cta: 'Começar grátis',
      cta2: 'Ver demo',
      trust: 'Sem cartão de crédito · Dados criptografados · Código aberto',
    },
    problems: {
      kicker: 'O problema',
      title: 'Você já passou pelo mês sem saber pra onde foi o dinheiro?',
      items: [
        { t: 'Planilhas que ninguém atualiza', d: 'Começa com disciplina na primeira semana. Some até o fim do mês.' },
        { t: '"Para onde foi meu salário?"', d: 'Fatura do cartão chega e você não lembra de 80% das compras.' },
        { t: 'Sem visão do todo', d: 'Investimentos de um lado, gastos do outro, reservas no meio. Nada se conversa.' },
      ],
    },
    solution: {
      kicker: 'A solução',
      title: 'Um único painel. Todo o seu dinheiro.',
      sub: 'Expense Tracker junta contas, cartões e categorias em um dashboard que entende o seu mês — e o seu acumulado.',
    },
    features: {
      kicker: 'Recursos',
      title: 'Tudo que você precisa. Nada que você não vai usar.',
      items: [
        { tag: '01', t: 'Dashboard inteligente', d: 'Saldo disponível e "Caixinhas" refletem o valor real acumulado, enquanto receitas e despesas respeitam o filtro mensal.' },
        { tag: '02', t: 'Importação bancária (CSV)', d: 'Assistente de importação com detecção automática de categorias e mapeamento de colunas do extrato.' },
        { tag: '03', t: 'Categorias customizáveis', d: 'Categorias nativas + crie as suas com emoji e cor. Personalize do seu jeito.' },
        { tag: '04', t: 'Dark mode nativo', d: 'Tema escuro pra quem fecha as contas de madrugada. Alterna com um clique.' },
        { tag: '05', t: 'Segurança Supabase', d: 'Autenticação completa (OAuth, recuperação), banco criptografado e RLS em todas as tabelas.' },
      ],
    },
    how: {
      kicker: 'Como funciona',
      title: 'Do cadastro ao primeiro relatório em menos de 5 minutos.',
      steps: [
        { n: '01', t: 'Crie sua conta', d: 'E-mail e senha ou login com Google. Sem papelada, sem cartão.' },
        { n: '02', t: 'Importe suas transações', d: 'Suba o CSV do seu banco. A gente detecta categorias automaticamente.' },
        { n: '03', t: 'Visualize seus relatórios', d: 'Gráficos de receita vs. despesa, por categoria, por mês. Tudo em tempo real.' },
        { n: '04', t: 'Tome decisões', d: 'Entenda seu padrão de gastos e reorganize o que importa.' },
      ],
    },
    cta: {
      title: 'Pronto pra controlar suas finanças?',
      sub: 'Leva 5 minutos pra começar. Você pode fechar esta aba depois.',
      btn: 'Começar grátis',
      btn2: 'Ver no GitHub',
    },
    footer: {
      tag: 'Feito com ❤️ por Davyd Fontoura',
      product: 'Produto', company: 'Projeto', resources: 'Recursos',
      links: {
        product: [['Recursos', '#features'], ['Como funciona', '#how'], ['Demo', '#'], ['Dark mode', '#']],
        company: [['GitHub', 'https://github.com/davydfontourac/expense-tracker'], ['Issues', 'https://github.com/davydfontourac/expense-tracker/issues'], ['Licença MIT', '#']],
        resources: [['Documentação', '#'], ['Changelog', '#'], ['Privacidade', '#']],
      },
      rights: '© 2026 Expense Tracker · Open source sob licença MIT',
    },
  },
  'en': {
    nav: { features: 'Features', how: 'How it works', faq: 'FAQ', github: 'GitHub', signin: 'Sign in', cta: 'Start free' },
    hero: {
      badge: '100% open source · free forever',
      h1a: 'Your money,',
      h1b: 'under control.',
      sub: 'Track expenses, income and investments in one place. Import bank statements, auto-categorize, and understand where every dollar goes.',
      cta: 'Start free',
      cta2: 'See demo',
      trust: 'No credit card · Encrypted data · Open source',
    },
    problems: {
      kicker: 'The problem',
      title: 'Ever reached month-end with no idea where the money went?',
      items: [
        { t: 'Spreadsheets no one updates', d: 'Discipline in week one. Gone by week four. Every single time.' },
        { t: '"Where did my paycheck go?"', d: 'Credit-card bill arrives and 80% of the charges are a blur.' },
        { t: 'No full picture', d: 'Investments over there, spending over here, savings somewhere. None of it talks.' },
      ],
    },
    solution: {
      kicker: 'The solution',
      title: 'One dashboard. All of your money.',
      sub: 'Expense Tracker ties accounts, cards and categories into one view that understands both your month and your lifetime totals.',
    },
    features: {
      kicker: 'Features',
      title: 'Everything you need. Nothing you won\u2019t use.',
      items: [
        { tag: '01', t: 'Smart dashboard', d: 'Available balance and "Savings" reflect real accumulated value, while income and expenses respect the monthly filter.' },
        { tag: '02', t: 'Bank import (CSV)', d: 'Import wizard with auto-detected categories and smart column mapping for your statement.' },
        { tag: '03', t: 'Custom categories', d: 'Built-in categories plus your own — with emoji and color. Shape it around your life.' },
        { tag: '04', t: 'Native dark mode', d: 'Dark theme for closing the books late at night. One click to switch.' },
        { tag: '05', t: 'Supabase security', d: 'Full auth (OAuth, recovery), encrypted database and row-level security on every table.' },
      ],
    },
    how: {
      kicker: 'How it works',
      title: 'From sign-up to your first report in under 5 minutes.',
      steps: [
        { n: '01', t: 'Create your account', d: 'Email + password or Google login. No paperwork, no card.' },
        { n: '02', t: 'Import your transactions', d: 'Drop in your bank CSV. We detect categories automatically.' },
        { n: '03', t: 'See your reports', d: 'Income vs. expense, by category, by month. All real-time.' },
        { n: '04', t: 'Make decisions', d: 'Understand your spending pattern and reshape what matters.' },
      ],
    },
    cta: {
      title: 'Ready to own your finances?',
      sub: 'Five minutes to set up. You can close this tab after.',
      btn: 'Start free',
      btn2: 'View on GitHub',
    },
    footer: {
      tag: 'Built with ❤️ by Davyd Fontoura',
      product: 'Product', company: 'Project', resources: 'Resources',
      links: {
        product: [['Features', '#features'], ['How it works', '#how'], ['Demo', '#'], ['Dark mode', '#']],
        company: [['GitHub', 'https://github.com/davydfontourac/expense-tracker'], ['Issues', 'https://github.com/davydfontourac/expense-tracker/issues'], ['MIT License', '#']],
        resources: [['Docs', '#'], ['Changelog', '#'], ['Privacy', '#']],
      },
      rights: '© 2026 Expense Tracker · Open source under MIT license',
    },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Styles (scoped via data-attrs)
// ─────────────────────────────────────────────────────────────────────────────
const STYLE = `
/* ── Shared ─────────────────────────────────────────────────────────────── */
.container { max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
.kicker {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
  color: var(--brand-600); text-transform: uppercase;
}
.kicker::before {
  content: ''; width: 18px; height: 1px; background: currentColor; opacity: 0.5;
}
[data-theme="dark"] .kicker { color: var(--accent-400); }

.h1 {
  font-size: clamp(44px, 7vw, 88px);
  line-height: 0.95; letter-spacing: -0.04em;
  font-weight: 600; margin: 0;
  text-wrap: balance;
}
.h2 {
  font-size: clamp(32px, 4.5vw, 56px);
  line-height: 1.02; letter-spacing: -0.035em;
  font-weight: 600; margin: 0;
  text-wrap: balance;
}
.h3 {
  font-size: 20px; line-height: 1.3; letter-spacing: -0.01em;
  font-weight: 600; margin: 0;
}
.lede {
  font-size: clamp(17px, 1.4vw, 20px); line-height: 1.55;
  color: var(--ink-500); max-width: 640px; text-wrap: pretty;
}
[data-theme="dark"] .lede { color: rgba(232, 232, 240, 0.7); }

/* ── Buttons ────────────────────────────────────────────────────────────── */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  height: 44px; padding: 0 20px; border-radius: 999px;
  font-size: 15px; font-weight: 500; letter-spacing: -0.005em;
  border: 1px solid transparent; cursor: pointer;
  transition: transform 120ms ease, background 120ms ease, border-color 120ms ease, box-shadow 120ms ease;
  white-space: nowrap;
}
.btn:active { transform: translateY(1px); }
.btn-primary {
  background: var(--ink-900); color: white;
  box-shadow: 0 1px 0 0 rgba(255,255,255,0.15) inset, 0 1px 2px rgba(12,12,29,0.15), 0 8px 24px -8px rgba(99,102,241,0.4);
}
.btn-primary:hover { background: #1a1a33; }
[data-theme="dark"] .btn-primary {
  background: white; color: var(--ink-900);
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px -4px rgba(99,102,241,0.3);
}
[data-theme="dark"] .btn-primary:hover { background: #f0f0f5; }

.btn-ghost {
  background: transparent; color: var(--ink-900);
  border-color: var(--ink-200);
}
.btn-ghost:hover { background: var(--ink-100); }
[data-theme="dark"] .btn-ghost {
  color: #e8e8f0;
  border-color: rgba(255,255,255,0.12);
}
[data-theme="dark"] .btn-ghost:hover { background: rgba(255,255,255,0.05); }

.btn-sm { height: 36px; padding: 0 14px; font-size: 13px; }

/* ── Nav ────────────────────────────────────────────────────────────────── */
.nav {
  position: sticky; top: 0; z-index: 40;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: rgba(255,255,255,0.72);
  border-bottom: 1px solid rgba(12,12,29,0.06);
}
[data-theme="dark"] .nav {
  background: rgba(7,7,15,0.72);
  border-bottom-color: rgba(255,255,255,0.06);
}
.nav-inner {
  display: flex; align-items: center; justify-content: space-between;
  height: 64px;
}
.brand {
  display: flex; align-items: center; gap: 10px;
  font-weight: 600; letter-spacing: -0.01em; font-size: 15px;
}
.brand img { width: 28px; height: 28px; object-fit: contain; }
.nav-links {
  display: flex; align-items: center; gap: 28px;
  font-size: 14px; color: var(--ink-500);
}
[data-theme="dark"] .nav-links { color: rgba(232,232,240,0.6); }
.nav-links a:hover { color: var(--ink-900); }
[data-theme="dark"] .nav-links a:hover { color: #fff; }
.nav-actions { display: flex; align-items: center; gap: 8px; }
@media (max-width: 820px) {
  .nav-links { display: none; }
}

.lang-toggle {
  display: inline-flex; padding: 2px; border-radius: 999px;
  background: var(--ink-100); border: 1px solid var(--ink-200);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11px; font-weight: 500;
}
[data-theme="dark"] .lang-toggle {
  background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.08);
}
.lang-toggle button {
  appearance: none; border: 0; background: transparent;
  padding: 4px 10px; border-radius: 999px; cursor: pointer;
  color: var(--ink-500); font: inherit;
}
.lang-toggle button.active {
  background: white; color: var(--ink-900);
  box-shadow: 0 1px 2px rgba(12,12,29,0.08);
}
[data-theme="dark"] .lang-toggle button { color: rgba(232,232,240,0.5); }
[data-theme="dark"] .lang-toggle button.active {
  background: rgba(255,255,255,0.12); color: #fff; box-shadow: none;
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
.hero {
  position: relative; overflow: hidden;
  padding: clamp(48px, 8vw, 96px) 0 0;
}
.hero-bg {
  position: absolute; inset: 0; pointer-events: none; z-index: 0;
  background:
    radial-gradient(1200px 600px at 50% -10%, rgba(99,102,241,0.18), transparent 60%),
    radial-gradient(800px 400px at 90% 10%, rgba(34,211,238,0.12), transparent 60%);
}
.hero-grid {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(12,12,29,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(12,12,29,0.05) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 40%, transparent 85%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 30%, #000 40%, transparent 85%);
}
.hero-inner { position: relative; z-index: 1; padding-bottom: 80px; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  height: 30px; padding: 0 12px; border-radius: 999px;
  background: white; border: 1px solid var(--ink-200);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11.5px; color: var(--ink-700);
  box-shadow: 0 1px 2px rgba(12,12,29,0.04);
}
.hero-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.18); }
.hero-h1 { margin-top: 22px; }
.hero-h1 em {
  font-style: normal;
  background: linear-gradient(100deg, var(--brand-600) 0%, var(--accent-500) 60%, var(--brand-700) 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero-sub { margin-top: 22px; }
.hero-actions { margin-top: 32px; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.hero-trust {
  margin-top: 20px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11.5px; color: var(--ink-400); letter-spacing: 0.01em;
}

/* Dashboard mockup frame */
.mock-wrap {
  position: relative; margin-top: 56px; padding: 0 0 20px;
}
.mock-wrap::before {
  content: ''; position: absolute; left: 50%; top: -40px; transform: translateX(-50%);
  width: 70%; height: 180px;
  background: radial-gradient(ellipse 50% 50% at 50% 50%, rgba(99,102,241,0.35), transparent 70%);
  filter: blur(40px); z-index: 0;
}
.mock {
  position: relative; z-index: 1;
  border-radius: var(--radius-lg);
  border: 1px solid var(--ink-200);
  background: white;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.8) inset,
    0 2px 4px rgba(12,12,29,0.04),
    0 24px 64px -20px rgba(12,12,29,0.22),
    0 50px 100px -40px rgba(99,102,241,0.25);
  overflow: hidden;
}
.mock-chrome {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 16px; border-bottom: 1px solid var(--ink-200);
  background: var(--ink-50);
}
.mock-chrome .dots { display: flex; gap: 6px; }
.mock-chrome .dots span {
  width: 10px; height: 10px; border-radius: 50%; background: var(--ink-200);
}
.mock-chrome .url {
  flex: 1; text-align: center;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11.5px; color: var(--ink-400);
}

/* ── Section wrapper ────────────────────────────────────────────────────── */
.section { padding: clamp(80px, 12vw, 140px) 0; position: relative; }
.section-dark {
  background: #07070f;
  color: #e8e8f0;
  position: relative;
  overflow: hidden;
}
.section-dark::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(800px 500px at 20% 0%, rgba(99,102,241,0.18), transparent 60%),
    radial-gradient(700px 500px at 90% 100%, rgba(34,211,238,0.08), transparent 60%);
}
.section-dark::after {
  content: ''; position: absolute; inset: 0; pointer-events: none; opacity: 0.4;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 30%, transparent 80%);
}
.section-dark > .container { position: relative; z-index: 1; }

/* ── Scroll reveal ─────────────────────────────────────────────────────── */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity 720ms cubic-bezier(0.16, 1, 0.3, 1), transform 720ms cubic-bezier(0.16, 1, 0.3, 1); will-change: opacity, transform; }
.reveal.in { opacity: 1; transform: translateY(0); }
.reveal-up    { transform: translateY(36px); }
.reveal-left  { transform: translateX(-28px); }
.reveal-right { transform: translateX(28px); }
.reveal-scale { transform: translateY(24px) scale(0.985); }
.reveal.in.reveal-left, .reveal.in.reveal-right { transform: translateX(0); }
.reveal.in.reveal-scale { transform: translateY(0) scale(1); }
.reveal[data-delay="1"] { transition-delay: 80ms; }
.reveal[data-delay="2"] { transition-delay: 160ms; }
.reveal[data-delay="3"] { transition-delay: 240ms; }
.reveal[data-delay="4"] { transition-delay: 320ms; }
.reveal[data-delay="5"] { transition-delay: 400ms; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
}

.section-head { max-width: 720px; margin-bottom: 56px; }
.section-head .kicker { margin-bottom: 16px; }
.section-head .h2 + .lede { margin-top: 20px; }

/* ── Problems ───────────────────────────────────────────────────────────── */
.prob-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
}
@media (max-width: 820px) { .prob-grid { grid-template-columns: 1fr; } }
.prob-card {
  padding: 28px; border-radius: var(--radius);
  background: var(--ink-50);
  border: 1px solid var(--ink-200);
  display: flex; flex-direction: column; gap: 10px;
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.prob-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px -16px rgba(12,12,29,0.15);
}
.prob-num {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11px; color: var(--brand-600); letter-spacing: 0.05em;
}
.prob-t { font-size: 19px; font-weight: 600; letter-spacing: -0.015em; line-height: 1.25; }
.prob-d { font-size: 15px; color: var(--ink-500); line-height: 1.5; }

/* ── Features (dark) ────────────────────────────────────────────────────── */
.feat-grid {
  display: grid; grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}
@media (max-width: 960px) { .feat-grid { grid-template-columns: 1fr; } }

.feat-card {
  position: relative; padding: 32px;
  border-radius: var(--radius);
  background: linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.015));
  border: 1px solid rgba(255,255,255,0.08);
  display: flex; flex-direction: column; gap: 14px;
  overflow: hidden;
  transition: border-color 200ms ease, transform 200ms ease;
}
.feat-card:hover {
  border-color: rgba(99,102,241,0.35);
  transform: translateY(-2px);
}
.feat-card .feat-tag {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11px; color: var(--accent-400); letter-spacing: 0.05em;
}
.feat-card .feat-t {
  font-size: 22px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.2;
  color: #fff;
}
.feat-card .feat-d { font-size: 15px; color: rgba(232,232,240,0.6); line-height: 1.55; }
.feat-card .feat-visual {
  margin-top: auto; padding-top: 16px;
}

/* grid placements: 1 wide, 4 others arranged */
.feat-card.span-3 { grid-column: span 3; min-height: 360px; }
.feat-card.span-2 { grid-column: span 2; min-height: 260px; }
@media (max-width: 960px) {
  .feat-card.span-3, .feat-card.span-2 { grid-column: auto; min-height: 0; }
}

/* ── How it works ───────────────────────────────────────────────────────── */
.steps {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
  position: relative;
}
.steps::before {
  content: ''; position: absolute;
  top: 22px; left: 5%; right: 5%; height: 1px;
  background: repeating-linear-gradient(to right, var(--ink-300) 0 4px, transparent 4px 8px);
  z-index: 0;
}
@media (max-width: 820px) {
  .steps { grid-template-columns: 1fr; }
  .steps::before { display: none; }
}
.step { position: relative; z-index: 1; display: flex; flex-direction: column; gap: 14px; }
.step-num {
  width: 44px; height: 44px; border-radius: 999px;
  display: flex; align-items: center; justify-content: center;
  background: white; border: 1px solid var(--ink-200);
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 13px; color: var(--brand-700); font-weight: 500;
  box-shadow: 0 1px 2px rgba(12,12,29,0.04);
}
.step-t { font-size: 18px; font-weight: 600; letter-spacing: -0.015em; }
.step-d { font-size: 15px; color: var(--ink-500); line-height: 1.5; }

/* ── Stats ──────────────────────────────────────────────────────────────── */
.stats {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 0;
  border-top: 1px solid var(--ink-200);
  border-bottom: 1px solid var(--ink-200);
  margin-top: 80px;
}
@media (max-width: 820px) { .stats { grid-template-columns: repeat(2, 1fr); } }
.stat {
  padding: 28px 24px; border-right: 1px solid var(--ink-200);
}
.stat:last-child { border-right: 0; }
@media (max-width: 820px) {
  .stat:nth-child(2) { border-right: 0; }
  .stat:nth-child(1), .stat:nth-child(2) { border-bottom: 1px solid var(--ink-200); }
}
.stat-v {
  font-size: 40px; font-weight: 600; letter-spacing: -0.035em; line-height: 1;
  font-family: 'Geist', sans-serif;
}
.stat-v em { font-family: 'Instrument Serif', serif; font-style: italic; font-weight: 400; color: var(--brand-600); }
.stat-l {
  margin-top: 10px; font-size: 13px; color: var(--ink-500);
  font-family: 'Geist Mono', ui-monospace, monospace;
}

/* ── Final CTA ──────────────────────────────────────────────────────────── */
.final-cta {
  position: relative; overflow: hidden;
  border-radius: 28px;
  padding: clamp(56px, 8vw, 96px) clamp(24px, 5vw, 64px);
  background:
    radial-gradient(800px 400px at 20% 0%, rgba(99,102,241,0.7), transparent 60%),
    radial-gradient(600px 400px at 100% 100%, rgba(14,165,233,0.5), transparent 60%),
    linear-gradient(180deg, #1e1b4b, #0c0c1d);
  color: #fff;
  text-align: center;
  box-shadow: 0 30px 80px -30px rgba(99,102,241,0.4);
}
.final-cta::before {
  content: ''; position: absolute; inset: 0; opacity: 0.3;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, #000 30%, transparent 90%);
  -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 50%, #000 30%, transparent 90%);
}
.final-cta-inner { position: relative; z-index: 1; }
.final-cta .h2 { color: #fff; }
.final-cta .lede { color: rgba(255,255,255,0.75); margin: 20px auto 0; }
.final-cta .actions { margin-top: 32px; display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.final-cta .btn-primary {
  background: white; color: var(--ink-900);
  box-shadow: 0 10px 40px -10px rgba(0,0,0,0.4);
}
.final-cta .btn-primary:hover { background: #f0f0f5; }
.final-cta .btn-ghost {
  color: #fff;
  border-color: rgba(255,255,255,0.22);
  background: rgba(255,255,255,0.04);
}
.final-cta .btn-ghost:hover { background: rgba(255,255,255,0.1); }

/* ── Footer ─────────────────────────────────────────────────────────────── */
.footer { padding: 64px 0 32px; border-top: 1px solid var(--ink-200); }
[data-theme="dark"] .footer { border-top-color: rgba(255,255,255,0.08); }
.footer-grid {
  display: grid; grid-template-columns: 2fr repeat(3, 1fr); gap: 32px;
  margin-bottom: 48px;
}
@media (max-width: 720px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
.footer-col h4 {
  font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--ink-500); font-weight: 500; margin: 0 0 14px;
  font-family: 'Geist Mono', ui-monospace, monospace;
}
.footer-col ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.footer-col a { font-size: 14px; color: var(--ink-700); }
.footer-col a:hover { color: var(--brand-700); }
.footer-bottom {
  display: flex; justify-content: space-between; align-items: center; gap: 16px;
  padding-top: 24px; border-top: 1px solid var(--ink-200);
  font-size: 13px; color: var(--ink-500);
  flex-wrap: wrap;
}
[data-theme="dark"] .footer-bottom { border-top-color: rgba(255,255,255,0.08); }
.footer-social { display: flex; gap: 8px; }
.footer-social a {
  width: 34px; height: 34px; border-radius: 8px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--ink-200); color: var(--ink-500);
}
.footer-social a:hover { color: var(--brand-700); border-color: var(--brand-500); }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
const Icon = {
  arrow: (p) => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}><path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  play: (p) => <svg width="10" height="12" viewBox="0 0 10 12" fill="none" {...p}><path d="M1 1l8 5-8 5V1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor"/></svg>,
  github: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.79 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.48 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.56 22.28 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z"/></svg>,
  twitter: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  linkedin: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>,
};

// ─────────────────────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────────────────────
function Nav({ lang, setLang, t, onToggleDark, isDark }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#" className="brand">
          <img src="public/logo-expense-tracker.png" alt="" />
          <span>Expense Tracker</span>
        </a>
        <div className="nav-links">
          <a href="#features">{t.nav.features}</a>
          <a href="#how">{t.nav.how}</a>
          <a href="https://github.com/davydfontourac/expense-tracker" target="_blank" rel="noopener">{t.nav.github}</a>
        </div>
        <div className="nav-actions">
          <div className="lang-toggle" role="tablist" aria-label="Language">
            <button className={lang === 'pt-BR' ? 'active' : ''} onClick={() => setLang('pt-BR')}>PT</button>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <a href="#" className="btn btn-ghost btn-sm">{t.nav.signin}</a>
          <a href="#" className="btn btn-primary btn-sm">{t.nav.cta}</a>
        </div>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard mockup (clean, data-driven, not slop)
// ─────────────────────────────────────────────────────────────────────────────
function DashboardMock() {
  // deterministic but varied bar heights
  const bars = [42, 58, 71, 49, 83, 92, 76, 64, 88, 72, 95, 81];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const sparks = [
    [20,28,24,36,30,42,38,50],
    [60,52,58,44,50,38,30,24],
    [12,18,16,22,20,28,26,34],
  ];
  const mkSpark = (pts, color) => {
    const mx = Math.max(...pts);
    return (
      <svg width="100%" height="22" viewBox="0 0 100 22" preserveAspectRatio="none" style={{ marginTop: 10 }}>
        <polyline fill="none" stroke={color} strokeWidth="1.5"
          points={pts.map((v,i)=>`${(i/(pts.length-1))*100},${22-(v/mx)*20}`).join(' ')}/>
      </svg>
    );
  };

  return (
    <div className="mock">
      <div className="mock-chrome">
        <div className="dots"><span></span><span></span><span></span></div>
        <div className="url">controle-de-gastos.vercel.app/dashboard</div>
        <div style={{width: 52}}></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 500 }}>
        {/* Sidebar */}
        <aside style={{
          borderRight: '1px solid var(--ink-200)',
          padding: '20px 16px',
          background: 'var(--ink-50)',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px 16px', marginBottom: 4 }}>
            <img src="public/logo-expense-tracker.png" alt="" style={{ width: 22, height: 22, objectFit: 'contain' }} />
            <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em' }}>Expense Tracker</span>
          </div>
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9.5, color: 'var(--ink-400)', letterSpacing: '0.08em', padding: '6px 10px 6px', textTransform: 'uppercase' }}>GERAL</div>
          {[
            ['▦', 'Dashboard', true],
            ['≡', 'Transações', false],
            ['◫', 'Categorias', false],
            ['⎘', 'Caixinhas', false],
          ].map(([ic, label, active]) => (
            <div key={label} style={{
              padding: '7px 10px', borderRadius: 7,
              fontSize: 13, color: active ? 'var(--ink-900)' : 'var(--ink-500)',
              background: active ? 'var(--ink-100)' : 'transparent',
              fontWeight: active ? 500 : 400,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ width: 14, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: active ? 'var(--brand-500)' : 'var(--ink-400)', textAlign: 'center' }}>{ic}</span>
              {label}
            </div>
          ))}
          <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 9.5, color: 'var(--ink-400)', letterSpacing: '0.08em', padding: '14px 10px 6px', textTransform: 'uppercase' }}>ANÁLISES</div>
          {[['⌗','Relatórios'],['◎','Metas'],['✱','Insights']].map(([ic,label])=>(
            <div key={label} style={{ padding: '7px 10px', borderRadius: 7, fontSize: 13, color: 'var(--ink-500)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 14, fontFamily: 'Geist Mono, monospace', fontSize: 11, color: 'var(--ink-400)', textAlign: 'center' }}>{ic}</span>
              {label}
            </div>
          ))}
          <div style={{
            marginTop: 'auto', padding: 12, borderRadius: 10,
            border: '1px solid var(--ink-200)', background: 'white',
            fontSize: 11, color: 'var(--ink-500)',
          }}>
            <div style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--ink-400)', fontSize: 10 }}>OUTUBRO 2026</div>
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-900)', fontWeight: 500 }}>Filtro ativo</div>
          </div>
        </aside>

        {/* Main */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em' }}>Boa tarde, davyd.</div>
              <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>Você gastou <b style={{ color: 'var(--ink-900)' }}>R$ 1.292,83</b> em abril · 41% da sua receita</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ height: 30, padding: '0 10px', borderRadius: 7, border: '1px solid var(--ink-200)', background: 'white', fontSize: 11.5, color: 'var(--ink-700)', display: 'flex', alignItems: 'center', gap: 6 }}>📅 Abril 2026</div>
              <div style={{ height: 30, padding: '0 10px', borderRadius: 7, border: '1px solid var(--ink-900)', fontSize: 11.5, color: 'var(--ink-900)', display: 'flex', alignItems: 'center', fontWeight: 500, background: 'white' }}>Todos</div>
              <div style={{ height: 30, padding: '0 12px', borderRadius: 7, background: 'var(--ink-900)', color: 'white', fontSize: 11.5, display: 'flex', alignItems: 'center', fontWeight: 500 }}>+ Nova</div>
            </div>
          </div>

          {/* KPI cards with sparklines */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'DISPONÍVEL',   sub: 'Saldo em conta',   v: 'R$ 2.014,70', delta: '+4.2%',  color: 'var(--brand-500)', pts: sparks[0] },
              { label: 'RECEITAS',     sub: 'Neste mês',         v: 'R$ 3.179,00', delta: '+12%',   color: '#10b981',           pts: sparks[0] },
              { label: 'DESPESAS',     sub: 'Neste mês',         v: 'R$ 1.292,83', delta: '-3.1%',  color: '#ef4444',           pts: sparks[1] },
            ].map((k) => (
              <div key={k.label} style={{ padding: 14, borderRadius: 12, border: '1px solid var(--ink-200)', background: 'white' }}>
                <div style={{ fontSize: 10, color: 'var(--ink-400)', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.08em' }}>{k.label}</div>
                <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>{k.sub}</div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em', marginTop: 10, lineHeight: 1 }}>{k.v}</div>
                <div style={{ marginTop: 8, fontSize: 10.5, color: k.color, fontFamily: 'Geist Mono, monospace' }}>{k.delta} vs. mês anterior</div>
                {mkSpark(k.pts, k.color)}
              </div>
            ))}
          </div>

          {/* Chart + donut */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 10, flex: 1 }}>
            <div style={{ padding: 14, borderRadius: 12, border: '1px solid var(--ink-200)', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>Evolução Mensal</div>
                  <div style={{ fontSize: 11, color: 'var(--ink-500)', marginTop: 2 }}>Receitas vs. Despesas · 12 meses</div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--ink-400)', fontFamily: 'Geist Mono, monospace', letterSpacing: '0.05em' }}>JAN → DEZ</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 130 }}>
                {bars.map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: '100%', display: 'flex', gap: 2, alignItems: 'flex-end', height: 118 }}>
                      <div style={{ flex: 1, height: h + '%', borderRadius: '3px 3px 0 0', background: i === 3 ? 'var(--brand-500)' : 'var(--ink-900)' }}/>
                      <div style={{ flex: 1, height: Math.max(10, h * 0.45) + '%', borderRadius: '3px 3px 0 0', background: i === 3 ? 'rgba(99,102,241,0.25)' : 'var(--ink-200)' }}/>
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--ink-400)', fontFamily: 'Geist Mono, monospace' }}>{months[i]}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: 'var(--ink-500)' }}>
                <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--ink-900)', borderRadius: 2, marginRight: 6 }}/>Receitas</span>
                <span><span style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--ink-200)', borderRadius: 2, marginRight: 6 }}/>Despesas</span>
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: 12, border: '1px solid var(--ink-200)', background: 'white', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>Distribuição</div>
                <div style={{ fontSize: 10, color: 'var(--ink-400)', fontFamily: 'Geist Mono, monospace' }}>R$ 1.293</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                <Donut />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11, flex: 1 }}>
                  {[
                    ['#6366f1', 'Débito', '38%'],
                    ['#8b5cf6', 'Pix', '30%'],
                    ['#22d3ee', 'Alimentação', '16%'],
                    ['#0ea5e9', 'Transporte', '8%'],
                    ['#94a3b8', 'Outros', '8%'],
                  ].map(([c, l, p]) => (
                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-700)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                        {l}
                      </div>
                      <span style={{ fontFamily: 'Geist Mono, monospace', color: 'var(--ink-500)' }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Donut() {
  // values sum to 100
  const segs = [
    { v: 38, c: '#6366f1' },
    { v: 30, c: '#8b5cf6' },
    { v: 16, c: '#22d3ee' },
    { v: 8,  c: '#0ea5e9' },
    { v: 8,  c: '#94a3b8' },
  ];
  const R = 36, C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={R} fill="none" stroke="var(--ink-100)" strokeWidth="14" />
      {segs.map((s, i) => {
        const len = (s.v / 100) * C;
        const el = (
          <circle key={i}
            cx="50" cy="50" r={R} fill="none"
            stroke={s.c} strokeWidth="14"
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-acc}
            transform="rotate(-90 50 50)"
          />
        );
        acc += len;
        return el;
      })}
      <text x="50" y="48" textAnchor="middle" fontSize="14" fontWeight="600" fill="#0c0c1d" fontFamily="Geist">R$ 1.3k</text>
      <text x="50" y="62" textAnchor="middle" fontSize="8" fill="#9a9ab0" fontFamily="Geist Mono">GASTO</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
function Hero({ t }) {
  return (
    <section className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />
      <div className="container hero-inner">
        <div className="hero-badge">
          <span className="dot"></span>
          <span>{t.hero.badge}</span>
        </div>
        <h1 className="h1 hero-h1">
          {t.hero.h1a}<br/>
          <em>{t.hero.h1b}</em>
        </h1>
        <p className="lede hero-sub">{t.hero.sub}</p>
        <div className="hero-actions">
          <a href="#" className="btn btn-primary">
            {t.hero.cta} <Icon.arrow />
          </a>
          <a href="https://controle-de-gastos-tan-six.vercel.app" target="_blank" rel="noopener" className="btn btn-ghost">
            <Icon.play /> {t.hero.cta2}
          </a>
        </div>
        <div className="hero-trust">{t.hero.trust}</div>

        <Reveal className="mock-wrap" variant="scale" afterLoad={900}>
          <DashboardMock />
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Problems
// ─────────────────────────────────────────────────────────────────────────────
function Problems({ t }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="kicker">{t.problems.kicker}</div>
          <h2 className="h2">{t.problems.title}</h2>
        </Reveal>
        <div className="prob-grid">
          {t.problems.items.map((p, i) => (
            <Reveal className="prob-card" key={i} delay={i + 1}>
              <div className="prob-num">0{i + 1} / 03</div>
              <div className="prob-t">{p.t}</div>
              <div className="prob-d">{p.d}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Features (dark section)
// ─────────────────────────────────────────────────────────────────────────────
function FeatureVisuals() {
  return {
    dashboard: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div style={{ padding: 14, borderRadius: 10, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)' }}>
          <div style={{ fontSize: 10, fontFamily: 'Geist Mono, monospace', color: 'rgba(255,255,255,0.5)' }}>SALDO</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginTop: 4 }}>R$ 18.240</div>
          <div style={{ fontSize: 10, fontFamily: 'Geist Mono, monospace', color: 'var(--accent-400)', marginTop: 2 }}>ACUMULADO</div>
        </div>
        <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: 10, fontFamily: 'Geist Mono, monospace', color: 'rgba(255,255,255,0.5)' }}>DESPESAS</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em', marginTop: 4 }}>R$ 4.827</div>
          <div style={{ fontSize: 10, fontFamily: 'Geist Mono, monospace', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>OUT/2026</div>
        </div>
      </div>
    ),
    csv: (
      <div style={{ fontFamily: 'Geist Mono, monospace', fontSize: 11, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 12, color: 'rgba(255,255,255,0.75)' }}>
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>$ statement.csv</div>
        <div style={{ marginTop: 6 }}><span style={{ color: '#22d3ee' }}>02/10</span>  IFOOD *PIZZARIA      <span style={{ color: '#a78bfa' }}>→ Alimentação</span></div>
        <div><span style={{ color: '#22d3ee' }}>04/10</span>  UBER TRIP            <span style={{ color: '#a78bfa' }}>→ Transporte</span></div>
        <div><span style={{ color: '#22d3ee' }}>07/10</span>  NETFLIX              <span style={{ color: '#a78bfa' }}>→ Assinaturas</span></div>
        <div style={{ marginTop: 8, color: '#10b981' }}>✓ 47 transações importadas</div>
      </div>
    ),
    categories: (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[
          ['🍔', 'Alimentação', 'rgba(239,68,68,0.2)'],
          ['🚗', 'Transporte', 'rgba(14,165,233,0.2)'],
          ['🏠', 'Moradia', 'rgba(99,102,241,0.2)'],
          ['🎬', 'Lazer', 'rgba(168,85,247,0.2)'],
          ['💊', 'Saúde', 'rgba(34,197,94,0.2)'],
          ['📚', 'Educação', 'rgba(234,179,8,0.2)'],
          ['✈️', 'Viagem', 'rgba(34,211,238,0.2)'],
          ['+ Nova', '', 'rgba(255,255,255,0.06)'],
        ].map(([e, l, bg], i) => (
          <div key={i} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 999,
            background: bg, border: '1px solid rgba(255,255,255,0.1)',
            fontSize: 12, color: '#fff',
          }}>
            <span>{e}</span>{l && <span>{l}</span>}
          </div>
        ))}
      </div>
    ),
    dark: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, height: 80 }}>
        <div style={{ borderRadius: 8, background: 'white', padding: 10 }}>
          <div style={{ height: 4, borderRadius: 2, background: '#e6e6ee', width: '60%' }} />
          <div style={{ height: 12, borderRadius: 2, background: '#0c0c1d', marginTop: 6, width: '80%' }} />
          <div style={{ height: 4, borderRadius: 2, background: '#e6e6ee', marginTop: 8, width: '50%' }} />
        </div>
        <div style={{ borderRadius: 8, background: '#0c0c1d', border: '1px solid rgba(255,255,255,0.1)', padding: 10 }}>
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', width: '60%' }} />
          <div style={{ height: 12, borderRadius: 2, background: 'rgba(255,255,255,0.85)', marginTop: 6, width: '80%' }} />
          <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', marginTop: 8, width: '50%' }} />
        </div>
      </div>
    ),
    security: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderRadius: 10, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', fontFamily: 'Geist Mono, monospace', fontSize: 11 }}>
        <div style={{ color: '#10b981' }}>●</div>
        <div style={{ color: 'rgba(255,255,255,0.75)' }}>row-level-security <span style={{ color: 'rgba(255,255,255,0.4)' }}>ON</span></div>
        <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)' }}>Supabase</div>
      </div>
    ),
  };
}

function Features({ t }) {
  const v = FeatureVisuals();
  const visuals = [v.dashboard, v.csv, v.categories, v.dark, v.security];
  const classes = ['span-3', 'span-3', 'span-2', 'span-2', 'span-2'];

  return (
    <section className="section section-dark" id="features">
      <div className="container">
        <Reveal className="section-head">
          <div className="kicker">{t.features.kicker}</div>
          <h2 className="h2" style={{ color: '#fff' }}>{t.features.title}</h2>
        </Reveal>
        <div className="feat-grid">
          {t.features.items.map((f, i) => (
            <Reveal key={i} className={`feat-card ${classes[i]}`} variant="scale" delay={(i % 3) + 1}>
              <div className="feat-tag">{f.tag}</div>
              <div className="feat-t">{f.t}</div>
              <div className="feat-d">{f.d}</div>
              <div className="feat-visual">{visuals[i]}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// How it works + stats
// ─────────────────────────────────────────────────────────────────────────────
function HowItWorks({ t, lang }) {
  const stats = lang === 'pt-BR'
    ? [
        ['100%', <><em>open</em> source</>, 'Código no GitHub · MIT'],
        ['5min', 'Até o primeiro relatório', 'Do cadastro ao insight'],
        ['∞', 'Categorias customizáveis', 'Emoji, cor, seu jeito'],
        ['R$ 0', 'Gratuito para sempre', 'Sem pegadinha, sem cartão'],
      ]
    : [
        ['100%', <><em>open</em> source</>, 'Code on GitHub · MIT'],
        ['5min', 'To your first report', 'Sign-up to insight'],
        ['∞', 'Custom categories', 'Emoji, color, your way'],
        ['$0', 'Free forever', 'No tricks, no card'],
      ];

  return (
    <section className="section" id="how">
      <div className="container">
        <Reveal className="section-head">
          <div className="kicker">{t.how.kicker}</div>
          <h2 className="h2">{t.how.title}</h2>
        </Reveal>
        <div className="steps">
          {t.how.steps.map((s, i) => (
            <Reveal className="step" key={i} delay={i + 1}>
              <div className="step-num">{s.n}</div>
              <div className="step-t">{s.t}</div>
              <div className="step-d">{s.d}</div>
            </Reveal>
          ))}
        </div>

        <div className="stats">
          {stats.map(([v, label, sub], i) => (
            <Reveal className="stat" key={i} delay={i + 1}>
              <div className="stat-v">{v}</div>
              <div className="stat-l">{label}</div>
              <div className="stat-l" style={{ fontFamily: 'Geist', color: 'var(--ink-700)', fontSize: 14, marginTop: 4 }}>{sub}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Final CTA
// ─────────────────────────────────────────────────────────────────────────────
function FinalCTA({ t }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal className="final-cta" variant="scale">
          <div className="final-cta-inner">
            <h2 className="h2">{t.cta.title}</h2>
            <p className="lede">{t.cta.sub}</p>
            <div className="actions">
              <a href="#" className="btn btn-primary">{t.cta.btn} <Icon.arrow /></a>
              <a href="https://github.com/davydfontourac/expense-tracker" target="_blank" rel="noopener" className="btn btn-ghost">
                <Icon.github /> {t.cta.btn2}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ t }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#" className="brand">
              <img src="public/logo-expense-tracker.png" alt="" style={{ width: 32, height: 32, objectFit: 'contain' }} />
              <span style={{ fontSize: 16 }}>Expense Tracker</span>
            </a>
            <div style={{ marginTop: 14, fontSize: 14, color: 'var(--ink-500)', maxWidth: 320, lineHeight: 1.55 }}>
              {t.footer.tag}
            </div>
          </div>
          <div className="footer-col">
            <h4>{t.footer.product}</h4>
            <ul>{t.footer.links.product.map(([l, h]) => <li key={l}><a href={h}>{l}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.company}</h4>
            <ul>{t.footer.links.company.map(([l, h]) => <li key={l}><a href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener">{l}</a></li>)}</ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.resources}</h4>
            <ul>{t.footer.links.resources.map(([l, h]) => <li key={l}><a href={h}>{l}</a></li>)}</ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t.footer.rights}</div>
          <div className="footer-social">
            <a href="https://github.com/davydfontourac/expense-tracker" target="_blank" rel="noopener" aria-label="GitHub"><Icon.github /></a>
            <a href="#" aria-label="X / Twitter"><Icon.twitter /></a>
            <a href="#" aria-label="LinkedIn"><Icon.linkedin /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// App
// ─────────────────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": false,
  "lang": "pt-BR"
}/*EDITMODE-END*/;

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [lang, setLang] = useState(tw.lang || 'pt-BR');
  const t = COPY[lang];

  // keep tweak + state in sync
  useEffect(() => { setTweak('lang', lang); }, [lang]);

  useEffect(() => {
    document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : 'en';
  }, [lang]);

  return (
    <div data-theme={tw.dark ? 'dark' : 'light'} style={{ background: tw.dark ? '#07070f' : 'white', color: tw.dark ? '#e8e8f0' : 'var(--ink-900)', minHeight: '100vh' }}>
      <style>{STYLE}</style>
      <Nav lang={lang} setLang={setLang} t={t} isDark={tw.dark} onToggleDark={() => setTweak('dark', !tw.dark)} />
      <Hero t={t} />
      <Problems t={t} />
      <Features t={t} />
      <HowItWorks t={t} lang={lang} />
      <FinalCTA t={t} />
      <Footer t={t} />

      <TweaksPanel>
        <TweakSection label={lang === 'pt-BR' ? 'Tema' : 'Theme'} />
        <TweakToggle
          label={lang === 'pt-BR' ? 'Modo escuro' : 'Dark mode'}
          value={tw.dark}
          onChange={(v) => setTweak('dark', v)}
        />
        <TweakSection label={lang === 'pt-BR' ? 'Idioma' : 'Language'} />
        <TweakRadio
          label={lang === 'pt-BR' ? 'Idioma' : 'Language'}
          value={lang}
          options={['pt-BR', 'en']}
          onChange={(v) => setLang(v)}
        />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
