// landing-mobile.jsx — Expense Tracker mobile landing page
// Rendered inside an iOS or Android device frame, with tweaks for lang/theme/device/bezel/type.

const { useState: useM, useEffect: useEM, useRef: useRefM } = React;

// ─── Copy ────────────────────────────────────────────────────────────────
const MCOPY = {
  'pt-BR': {
    nav: { features: 'Recursos', how: 'Como funciona', faq: 'FAQ', github: 'GitHub', signin: 'Entrar', cta: 'Começar grátis' },
    hero: {
      badge: '100% open source',
      h1a: 'Seu dinheiro,',
      h1b: 'sob controle.',
      sub: 'Rastreie despesas, receitas e investimentos em um só lugar. Importe extratos, categorize e entenda para onde vai cada real.',
      cta: 'Começar grátis',
      cta2: 'Ver demo',
      trust: 'Sem cartão · Criptografado · Open source',
    },
    prob: { kicker: 'O PROBLEMA', title: 'Planilhas cansam. Apps escondem.', items: [
      { t: 'Planilhas viram zona', d: 'Você começa animado e abandona em 2 semanas.' },
      { t: 'Apps pagos escondem dados', d: 'Você paga mensalidade e eles decidem o que você pode ver.' },
      { t: 'Extratos sem contexto', d: 'Seu banco mostra números, não padrões.' },
    ]},
    feat: { kicker: 'RECURSOS', title: 'Tudo que você precisa, nada que não precisa.', items: [
      { tag: 'DASHBOARD', t: 'Visão em tempo real', d: 'KPIs, evolução mensal e distribuição por categoria num só lugar.' },
      { tag: 'IMPORTAÇÃO', t: 'CSV em 2 cliques', d: 'Importe extratos do seu banco e categorize em lote.' },
      { tag: 'CATEGORIAS', t: 'Do seu jeito', d: 'Categorias ilimitadas, emojis, cores. Orçamento por categoria.' },
      { tag: 'TEMAS', t: 'Light + Dark', d: 'Interface que segue o tema do sistema ou sua preferência.' },
      { tag: 'SEGURANÇA', t: 'Supabase RLS', d: 'Seus dados são seus. Row-level security por padrão.' },
    ]},
    how: { kicker: 'COMO FUNCIONA', title: 'Do zero ao controle em 5 minutos.', steps: [
      { n: '01', t: 'Crie sua conta', d: 'E-mail + senha, ou Google/GitHub. Sem cartão.' },
      { n: '02', t: 'Importe ou cadastre', d: 'Suba um CSV do seu banco ou lance manualmente.' },
      { n: '03', t: 'Acompanhe', d: 'Dashboard, caixinhas e metas atualizam em tempo real.' },
    ], stats: [
      ['5min', 'Setup', 'Até o primeiro insight'],
      ['100%', 'Grátis', 'Código aberto, sempre'],
      ['∞', 'Categorias', 'Customize como quiser'],
    ]},
    cta: { title: 'Pronto para assumir o controle?', sub: 'Grátis. Open source. Seus dados são seus.', a: 'Começar agora' },
    foot: { built: 'Feito por davyd.', repo: 'github.com/davydfontourac' },
    menu: [['Recursos','#features'],['Como funciona','#how'],['GitHub','#'],['Entrar','#']],
  },
  'en': {
    nav: { features: 'Features', how: 'How it works', faq: 'FAQ', github: 'GitHub', signin: 'Sign in', cta: 'Get started' },
    hero: {
      badge: '100% open source',
      h1a: 'Your money,',
      h1b: 'under control.',
      sub: 'Track expenses, income and investments in one place. Import statements, categorize and see where every dollar goes.',
      cta: 'Get started free',
      cta2: 'See demo',
      trust: 'No card · Encrypted · Open source',
    },
    prob: { kicker: 'THE PROBLEM', title: 'Spreadsheets die. Apps hide.', items: [
      { t: 'Spreadsheets rot', d: 'You start hyped and quit in 2 weeks.' },
      { t: 'Paid apps hide data', d: 'You pay, they decide what you see.' },
      { t: 'Statements lack context', d: 'Your bank shows numbers, not patterns.' },
    ]},
    feat: { kicker: 'FEATURES', title: 'Everything you need, nothing you don\'t.', items: [
      { tag: 'DASHBOARD', t: 'Real-time view', d: 'KPIs, monthly evolution and category breakdown in one place.' },
      { tag: 'IMPORT', t: 'CSV in 2 clicks', d: 'Import bank statements and categorize in bulk.' },
      { tag: 'CATEGORIES', t: 'Your way', d: 'Unlimited categories, emojis, colors. Per-category budget.' },
      { tag: 'THEMES', t: 'Light + Dark', d: 'UI that follows your system or your mood.' },
      { tag: 'SECURITY', t: 'Supabase RLS', d: 'Your data is yours. Row-level security by default.' },
    ]},
    how: { kicker: 'HOW IT WORKS', title: 'Zero to control in 5 minutes.', steps: [
      { n: '01', t: 'Create account', d: 'Email + password, or Google/GitHub. No card.' },
      { n: '02', t: 'Import or log', d: 'Upload a CSV or enter manually.' },
      { n: '03', t: 'Track', d: 'Dashboard, savings and goals update in real time.' },
    ], stats: [
      ['5min', 'Setup', 'To first insight'],
      ['100%', 'Free', 'Open source, always'],
      ['∞', 'Categories', 'Customize freely'],
    ]},
    cta: { title: 'Ready to take control?', sub: 'Free. Open source. Your data is yours.', a: 'Start now' },
    foot: { built: 'Made by davyd.', repo: 'github.com/davydfontourac' },
    menu: [['Features','#features'],['How it works','#how'],['GitHub','#'],['Sign in','#']],
  },
};

// ─── Mobile landing content (rendered inside device frame) ─────────────
const MSTYLE = `
.ML { font-family: Geist, system-ui; color: var(--ml-ink); background: var(--ml-bg); min-height: 100%; overflow-x: hidden; }
.ML[data-theme="light"] { --ml-bg:#fafafb; --ml-panel:#ffffff; --ml-border:#eaeaf0; --ml-div:#f1f1f7; --ml-ink:#0c0c1d; --ml-ink-2:#3b3b52; --ml-mute:#6b6b82; --ml-faint:#9a9ab0; }
.ML[data-theme="dark"]  { --ml-bg:#07070f; --ml-panel:#0f0f1e; --ml-border:#1e1e2e; --ml-div:#17172a; --ml-ink:#f4f4f7; --ml-ink-2:#c8c8d5; --ml-mute:#8a8a9e; --ml-faint:#5a5a72; }
.ML[data-type="sm"] { --ml-h1: 34px; --ml-h2: 22px; --ml-body: 14px; --ml-small: 12px; --ml-kick: 10px; }
.ML[data-type="md"] { --ml-h1: 40px; --ml-h2: 25px; --ml-body: 15px; --ml-small: 13px; --ml-kick: 10.5px; }
.ML[data-type="lg"] { --ml-h1: 46px; --ml-h2: 28px; --ml-body: 16px; --ml-small: 14px; --ml-kick: 11px; }

/* Nav */
.ML-nav { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: color-mix(in oklab, var(--ml-bg) 80%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--ml-border); }
.ML-nav .brand { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; color: var(--ml-ink); }
.ML-nav .brand img { width: 22px; height: 22px; }
.ML-nav button.burger { appearance: none; background: transparent; border: 1px solid var(--ml-border); border-radius: 9px; width: 36px; height: 36px; display: grid; place-items: center; cursor: pointer; gap: 3px; }
.ML-nav button.burger span { display: block; width: 14px; height: 1.5px; background: var(--ml-ink); }
.ML-nav button.burger span + span { margin-top: 3px; }

/* Menu sheet */
.ML-sheet { position: absolute; inset: 0; background: var(--ml-bg); z-index: 60; display: flex; flex-direction: column; padding: 12px 20px 28px; animation: sheetIn 260ms cubic-bezier(0.2,0.9,0.3,1.2); }
@keyframes sheetIn { from { opacity: 0; transform: translateY(12px); } to { opacity:1; transform: none; } }
.ML-sheet .top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-top: 2px; }
.ML-sheet .x { appearance: none; background: transparent; border: 1px solid var(--ml-border); width: 36px; height: 36px; border-radius: 9px; color: var(--ml-ink); font-size: 16px; cursor: pointer; }
.ML-sheet nav { display: flex; flex-direction: column; gap: 4px; margin-top: 8px; }
.ML-sheet nav a { padding: 16px 6px; font-size: 26px; font-weight: 500; letter-spacing: -0.025em; color: var(--ml-ink); text-decoration: none; border-bottom: 1px solid var(--ml-div); display: flex; justify-content: space-between; align-items: center; }
.ML-sheet nav a::after { content: '→'; color: var(--ml-faint); font-size: 18px; }
.ML-sheet .foot { margin-top: auto; display: flex; flex-direction: column; gap: 10px; }
.ML-sheet .btn { display: flex; align-items: center; justify-content: center; padding: 14px; border-radius: 12px; font-weight: 500; font-size: 15px; text-decoration: none; }
.ML-sheet .btn.primary { background: var(--ml-ink); color: var(--ml-bg); }
.ML-sheet .btn.ghost { border: 1px solid var(--ml-border); color: var(--ml-ink); }

/* Container */
.ML-wrap { padding: 0 20px; }

/* Hero */
.ML-hero { padding: 32px 20px 28px; position: relative; }
.ML-hero .badge { display: inline-flex; align-items: center; gap: 8px; padding: 5px 12px; border-radius: 999px; background: var(--ml-panel); border: 1px solid var(--ml-border); font-family: Geist Mono, monospace; font-size: var(--ml-kick); letter-spacing: 0.06em; text-transform: uppercase; color: var(--ml-mute); }
.ML-hero .badge .dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; box-shadow: 0 0 0 3px rgba(16,185,129,0.2); }
.ML-hero h1 { margin: 22px 0 0; font-size: var(--ml-h1, 40px); font-weight: 600; letter-spacing: -0.035em; line-height: 1.05; color: var(--ml-ink); }
.ML-hero h1 em { font-style: normal; background: linear-gradient(90deg, #6366f1, #22d3ee); -webkit-background-clip: text; background-clip: text; color: transparent; }
.ML-hero p.sub { font-size: var(--ml-body); color: var(--ml-mute); line-height: 1.55; margin: 16px 0 0; max-width: 30ch; }
.ML-hero .cta-col { display: flex; flex-direction: column; gap: 10px; margin-top: 24px; }
.ML-hero .cta-col a { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 18px; border-radius: 12px; font-weight: 500; font-size: 15px; text-decoration: none; }
.ML-hero .cta-col a.primary { background: var(--ml-ink); color: var(--ml-bg); }
.ML-hero .cta-col a.ghost { background: var(--ml-panel); color: var(--ml-ink); border: 1px solid var(--ml-border); }
.ML-hero .trust { margin-top: 18px; font-size: var(--ml-small); color: var(--ml-faint); font-family: Geist Mono, monospace; letter-spacing: 0.04em; }

/* Phone dashboard mock */
.ML-mock { margin-top: 28px; background: var(--ml-panel); border: 1px solid var(--ml-border); border-radius: 20px; padding: 18px; position: relative; overflow: hidden; }
.ML-mock::before { content: ''; position: absolute; right: -30px; top: -30px; width: 180px; height: 180px; border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(99,102,241,0.18), transparent 70%); pointer-events: none; }
.ML-mock .mh { display: flex; justify-content: space-between; align-items: center; position: relative; }
.ML-mock .mh .l { font-family: Geist Mono, monospace; font-size: 10px; color: var(--ml-faint); letter-spacing: 0.08em; text-transform: uppercase; }
.ML-mock .mh .dropd { font-size: 12px; color: var(--ml-mute); }
.ML-mock .big-val { font-size: 34px; font-weight: 600; letter-spacing: -0.03em; line-height: 1; margin-top: 12px; color: var(--ml-ink); position: relative; }
.ML-mock .delta { font-family: Geist Mono, monospace; font-size: 11.5px; color: #10b981; margin-top: 8px; position: relative; }
.ML-mock .spark { margin-top: 14px; height: 42px; position: relative; }
.ML-mock .row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-top: 1px solid var(--ml-div); position: relative; }
.ML-mock .row:first-of-type { margin-top: 12px; }
.ML-mock .ic { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; font-size: 15px; }
.ML-mock .row .desc { flex: 1; min-width: 0; }
.ML-mock .row .d1 { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--ml-ink); }
.ML-mock .row .d2 { font-size: 10.5px; color: var(--ml-faint); font-family: Geist Mono, monospace; margin-top: 2px; letter-spacing: 0.04em; }
.ML-mock .row .amt { font-size: 13.5px; font-weight: 500; font-variant-numeric: tabular-nums; color: var(--ml-ink); }
.ML-mock .row .amt.pos { color: #10b981; }

/* Section */
.ML-sec { padding: 56px 20px; }
.ML-sec.dark { background: #07070f; color: #e8e8f0; margin: 20px 0; border-radius: 24px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); }
.ML-sec.dark::before { content:''; position: absolute; inset: 0; pointer-events: none; opacity: 0.35; background-image: linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px); background-size: 32px 32px; mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 80%); -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 30%, #000 30%, transparent 80%); }
.ML-sec.dark > * { position: relative; }
.ML-sec .kicker { font-family: Geist Mono, monospace; font-size: var(--ml-kick); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ml-mute); margin-bottom: 14px; }
.ML-sec.dark .kicker { color: rgba(255,255,255,0.5); }
.ML-sec h2 { margin: 0 0 28px; font-size: var(--ml-h2, 26px); font-weight: 600; letter-spacing: -0.03em; line-height: 1.15; color: var(--ml-ink); }
.ML-sec.dark h2 { color: #fff; }

/* Problems */
.ML-probs { display: flex; flex-direction: column; gap: 10px; }
.ML-prob { padding: 20px; border-radius: 14px; background: var(--ml-panel); border: 1px solid var(--ml-border); }
.ML-prob .num { font-family: Geist Mono, monospace; font-size: 10.5px; letter-spacing: 0.08em; color: var(--ml-faint); }
.ML-prob .t { margin-top: 12px; font-size: 17px; font-weight: 500; letter-spacing: -0.015em; color: var(--ml-ink); }
.ML-prob .d { margin-top: 6px; font-size: 13.5px; color: var(--ml-mute); line-height: 1.55; }

/* Features (bento, stacked on mobile) */
.ML-feats { display: flex; flex-direction: column; gap: 10px; }
.ML-feat { padding: 22px 22px 0; border-radius: 18px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); overflow: hidden; position: relative; }
.ML-feat .tag { font-family: Geist Mono, monospace; font-size: 10px; letter-spacing: 0.08em; color: rgba(255,255,255,0.5); }
.ML-feat .t { margin-top: 10px; font-size: 19px; font-weight: 500; letter-spacing: -0.02em; color: #fff; }
.ML-feat .d { margin-top: 6px; font-size: 13.5px; color: rgba(255,255,255,0.65); line-height: 1.55; }
.ML-feat .vis { margin: 20px -22px 0; height: 130px; background: linear-gradient(180deg, rgba(99,102,241,0.08), transparent); border-top: 1px solid rgba(255,255,255,0.06); display: grid; place-items: center; position: relative; overflow: hidden; }

/* How */
.ML-steps { display: flex; flex-direction: column; gap: 14px; margin-bottom: 28px; }
.ML-step { padding: 18px; border-left: 2px solid var(--ml-ink); background: var(--ml-panel); border-radius: 0 12px 12px 0; border-top: 1px solid var(--ml-border); border-right: 1px solid var(--ml-border); border-bottom: 1px solid var(--ml-border); }
.ML-step .n { font-family: Geist Mono, monospace; font-size: 11px; letter-spacing: 0.1em; color: var(--ml-faint); }
.ML-step .t { margin-top: 8px; font-size: 16px; font-weight: 500; letter-spacing: -0.015em; color: var(--ml-ink); }
.ML-step .d { margin-top: 4px; font-size: 13.5px; color: var(--ml-mute); line-height: 1.55; }
.ML-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.ML-stat { padding: 16px 12px; border-radius: 12px; background: var(--ml-panel); border: 1px solid var(--ml-border); text-align: center; }
.ML-stat .v { font-size: 22px; font-weight: 600; letter-spacing: -0.025em; color: var(--ml-ink); }
.ML-stat .l { font-family: Geist Mono, monospace; font-size: 9.5px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ml-faint); margin-top: 6px; }
.ML-stat .s { font-size: 11px; color: var(--ml-mute); margin-top: 3px; line-height: 1.4; }

/* CTA */
.ML-cta-box { margin: 0 20px; padding: 32px 24px; border-radius: 20px; background: linear-gradient(135deg, #1e1b4b 0%, #0c0a36 100%); color: white; text-align: center; position: relative; overflow: hidden; }
.ML-cta-box::before { content:''; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(300px 200px at 100% 0%, rgba(99,102,241,0.35), transparent 60%), radial-gradient(260px 200px at 0% 100%, rgba(34,211,238,0.2), transparent 60%); }
.ML-cta-box > * { position: relative; }
.ML-cta-box h3 { margin: 0 0 10px; font-size: 24px; font-weight: 600; letter-spacing: -0.025em; line-height: 1.15; }
.ML-cta-box p { margin: 0; font-size: 13.5px; color: rgba(255,255,255,0.7); line-height: 1.55; }
.ML-cta-box a { display: block; margin-top: 20px; padding: 14px; border-radius: 12px; background: white; color: #0c0a36; font-weight: 600; font-size: 15px; text-decoration: none; }

/* Footer */
.ML-foot { padding: 32px 20px 24px; border-top: 1px solid var(--ml-border); margin-top: 24px; }
.ML-foot .brand { display: flex; align-items: center; gap: 8px; font-weight: 600; color: var(--ml-ink); margin-bottom: 16px; }
.ML-foot .brand img { width: 22px; height: 22px; }
.ML-foot .links { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px; font-size: 13px; color: var(--ml-mute); margin-bottom: 20px; }
.ML-foot .links a { color: var(--ml-ink-2); text-decoration: none; padding: 4px 0; }
.ML-foot .meta { font-family: Geist Mono, monospace; font-size: 10.5px; letter-spacing: 0.05em; color: var(--ml-faint); padding-top: 14px; border-top: 1px solid var(--ml-div); display: flex; justify-content: space-between; }

/* Reveal */
.mr { opacity: 0; transform: translateY(20px); transition: opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1); }
.mr.in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .mr { opacity: 1; transform: none; transition: none; } }
`;

function MR({ children, className = '', delay = 0, scroller }) {
  const ref = useRefM(null);
  const [seen, setSeen] = useM(false);
  useEM(() => {
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return; }
    // root = scrollable ancestor (the phone content area)
    const root = scroller || el.closest('[data-ml-scroll]') || null;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { setTimeout(()=>setSeen(true), delay); io.unobserve(e.target); } }),
      { root, threshold: 0.15, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`mr ${seen?'in':''} ${className}`}>{children}</div>;
}

function MobileDashboardMock({ theme }) {
  const pts=[28,34,30,42,38,50,46,58,52,64];
  const mx=Math.max(...pts);
  const color = '#6366f1';
  const txs=[
    { ic:'🍔', d:'iFood — Combo', m:'22 ABR · Débito', v:-33.39, pos:false },
    { ic:'⚡', d:'Pix recebido', m:'21 ABR · Zamp SA', v:25.90, pos:true },
    { ic:'🚗', d:'Uber *Trip', m:'21 ABR · Transporte', v:-17.36, pos:false },
    { ic:'🛒', d:'Supermercado Extra', m:'20 ABR · Mercado', v:-142.80, pos:false },
  ];
  return (
    <div className="ML-mock">
      <div className="mh">
        <div className="l">DISPONÍVEL · ABRIL</div>
        <div className="dropd">⋯</div>
      </div>
      <div className="big-val">R$ 2.014,70</div>
      <div className="delta">+ R$ 412,00 · 4,2% vs. março</div>
      <svg className="spark" viewBox="0 0 100 40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={`M 0,${40-(pts[0]/mx)*36} ${pts.map((v,i)=>`L ${(i/(pts.length-1))*100},${40-(v/mx)*36}`).join(' ')} L 100,40 L 0,40 Z`} fill="url(#sparkGrad)"/>
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts.map((v,i)=>`${(i/(pts.length-1))*100},${40-(v/mx)*36}`).join(' ')}/>
      </svg>
      {txs.map((r,i)=>(
        <div key={i} className="row">
          <div className="ic" style={{ background: theme==='dark' ? 'rgba(255,255,255,0.08)' : 'var(--ml-div)' }}>{r.ic}</div>
          <div className="desc"><div className="d1">{r.d}</div><div className="d2">{r.m}</div></div>
          <div className={'amt '+(r.pos?'pos':'')}>{r.pos?'+':'−'} R$ {Math.abs(r.v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
        </div>
      ))}
    </div>
  );
}

function MobileLanding({ lang, theme, type }) {
  const c = MCOPY[lang];
  const [menu, setMenu] = useM(false);
  return (
    <div className="ML" data-theme={theme} data-type={type} data-ml-scroll>
      <style>{MSTYLE}</style>

      {/* Nav */}
      <header className="ML-nav">
        <div className="brand"><img src="public/logo-expense-tracker.png" alt=""/>Expense Tracker</div>
        <button className="burger" onClick={()=>setMenu(true)} aria-label="menu">
          <span/><span/><span/>
        </button>
      </header>

      {/* Menu sheet */}
      {menu && (
        <div className="ML-sheet">
          <div className="top">
            <div className="brand" style={{ display:'flex',alignItems:'center',gap:8,fontSize:14,fontWeight:600 }}>
              <img src="public/logo-expense-tracker.png" alt="" style={{ width:22,height:22 }}/>Expense Tracker
            </div>
            <button className="x" onClick={()=>setMenu(false)} aria-label="close">✕</button>
          </div>
          <nav>
            {c.menu.map(([label,href])=>(
              <a key={label} href={href} onClick={()=>setMenu(false)}>{label}</a>
            ))}
          </nav>
          <div className="foot">
            <a href="#" className="btn ghost">{c.nav.signin}</a>
            <a href="#" className="btn primary">{c.nav.cta} →</a>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="ML-hero">
        <MR><div className="badge"><span className="dot"/>{c.hero.badge}</div></MR>
        <MR delay={60}><h1>{c.hero.h1a}<br/><em>{c.hero.h1b}</em></h1></MR>
        <MR delay={120}><p className="sub">{c.hero.sub}</p></MR>
        <MR delay={180}>
          <div className="cta-col">
            <a href="#" className="primary">{c.hero.cta} →</a>
            <a href="#" className="ghost">▶ {c.hero.cta2}</a>
          </div>
        </MR>
        <MR delay={240}><div className="trust">{c.hero.trust}</div></MR>
        <MR delay={320}><MobileDashboardMock theme={theme}/></MR>
      </section>

      {/* Problems */}
      <section className="ML-sec">
        <MR><div className="kicker">{c.prob.kicker}</div></MR>
        <MR delay={60}><h2>{c.prob.title}</h2></MR>
        <div className="ML-probs">
          {c.prob.items.map((p,i)=>(
            <MR key={i} delay={i*80}><div className="ML-prob"><div className="num">0{i+1} / 03</div><div className="t">{p.t}</div><div className="d">{p.d}</div></div></MR>
          ))}
        </div>
      </section>

      {/* Features (dark section) */}
      <section className="ML-sec dark" id="features">
        <MR><div className="kicker">{c.feat.kicker}</div></MR>
        <MR delay={60}><h2>{c.feat.title}</h2></MR>
        <div className="ML-feats">
          {c.feat.items.map((f,i)=>(
            <MR key={i} delay={i*60}>
              <div className="ML-feat">
                <div className="tag">{f.tag}</div>
                <div className="t">{f.t}</div>
                <div className="d">{f.d}</div>
                <div className="vis">{i===0 && <MiniViz kind="chart"/>}{i===1 && <MiniViz kind="csv"/>}{i===2 && <MiniViz kind="cats"/>}{i===3 && <MiniViz kind="themes"/>}{i===4 && <MiniViz kind="lock"/>}</div>
              </div>
            </MR>
          ))}
        </div>
      </section>

      {/* How + Stats */}
      <section className="ML-sec" id="how">
        <MR><div className="kicker">{c.how.kicker}</div></MR>
        <MR delay={60}><h2>{c.how.title}</h2></MR>
        <div className="ML-steps">
          {c.how.steps.map((s,i)=>(
            <MR key={i} delay={i*80}>
              <div className="ML-step"><div className="n">{s.n}</div><div className="t">{s.t}</div><div className="d">{s.d}</div></div>
            </MR>
          ))}
        </div>
        <div className="ML-stats">
          {c.how.stats.map(([v,l,s],i)=>(
            <MR key={i} delay={i*60}>
              <div className="ML-stat"><div className="v">{v}</div><div className="l">{l}</div><div className="s">{s}</div></div>
            </MR>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ padding: '12px 0 24px' }}>
        <MR>
          <div className="ML-cta-box">
            <h3>{c.cta.title}</h3>
            <p>{c.cta.sub}</p>
            <a href="#">{c.cta.a} →</a>
          </div>
        </MR>
      </div>

      {/* Footer */}
      <footer className="ML-foot">
        <div className="brand"><img src="public/logo-expense-tracker.png" alt=""/>Expense Tracker</div>
        <div className="links">
          <a href="#features">{c.nav.features}</a>
          <a href="#how">{c.nav.how}</a>
          <a href="#">{c.nav.github}</a>
          <a href="#">{c.nav.signin}</a>
        </div>
        <div className="meta"><span>{c.foot.built}</span><span>{c.foot.repo}</span></div>
      </footer>
    </div>
  );
}

// ─── Mini visuals for feature cards ─────────────────────────────────────
function MiniViz({ kind }) {
  if (kind==='chart') {
    const bars=[22,36,28,48,42,60,52,68];
    return (
      <div style={{ display:'flex',alignItems:'flex-end',gap:5,height:86,padding:'0 22px',width:'100%',justifyContent:'center' }}>
        {bars.map((h,i)=>(
          <div key={i} style={{ width:14,height:h+'%',borderRadius:'4px 4px 0 0',background: i===5?'#6366f1':'rgba(255,255,255,0.18)' }}/>
        ))}
      </div>
    );
  }
  if (kind==='csv') {
    return (
      <div style={{ fontFamily:'Geist Mono, monospace',fontSize:10,color:'rgba(255,255,255,0.7)',lineHeight:1.7,textAlign:'left',padding:'0 22px',width:'100%' }}>
        <div style={{ color:'#22d3ee' }}>statement.csv</div>
        <div>2026-04-22,−33.39,iFood</div>
        <div>2026-04-21,+25.90,Pix</div>
        <div>2026-04-21,−17.36,Uber</div>
        <div style={{ color:'#10b981',marginTop:4 }}>✓ 127 linhas importadas</div>
      </div>
    );
  }
  if (kind==='cats') {
    const cats = [['🍔','#22d3ee'],['🚗','#0ea5e9'],['🏠','#6366f1'],['🎬','#8b5cf6'],['🛒','#f59e0b'],['💊','#10b981']];
    return (
      <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,padding:'0 22px',width:'100%' }}>
        {cats.map(([e,c],i)=>(
          <div key={i} style={{ height:32,borderRadius:8,display:'grid',placeItems:'center',fontSize:15,background:`color-mix(in oklab, ${c} 22%, transparent)` }}>{e}</div>
        ))}
      </div>
    );
  }
  if (kind==='themes') {
    return (
      <div style={{ display:'flex',gap:8,padding:'0 22px',width:'100%',justifyContent:'center' }}>
        <div style={{ flex:1,height:70,borderRadius:10,background:'#fafafb',border:'1px solid rgba(0,0,0,0.06)',display:'flex',flexDirection:'column',padding:10,gap:4 }}>
          <div style={{ height:6,width:'60%',background:'#0c0c1d',borderRadius:2 }}/>
          <div style={{ height:4,width:'40%',background:'#9a9ab0',borderRadius:2 }}/>
          <div style={{ height:14,marginTop:'auto',background:'#6366f1',borderRadius:3 }}/>
        </div>
        <div style={{ flex:1,height:70,borderRadius:10,background:'#07070f',border:'1px solid rgba(255,255,255,0.12)',display:'flex',flexDirection:'column',padding:10,gap:4 }}>
          <div style={{ height:6,width:'60%',background:'#f4f4f7',borderRadius:2 }}/>
          <div style={{ height:4,width:'40%',background:'#5a5a72',borderRadius:2 }}/>
          <div style={{ height:14,marginTop:'auto',background:'#6366f1',borderRadius:3 }}/>
        </div>
      </div>
    );
  }
  if (kind==='lock') {
    return (
      <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:10 }}>
        <div style={{ width:42,height:42,borderRadius:12,background:'linear-gradient(135deg, #6366f1, #22d3ee)',display:'grid',placeItems:'center',fontSize:20 }}>🔒</div>
        <div style={{ fontFamily:'Geist Mono, monospace',fontSize:10,color:'rgba(255,255,255,0.65)',letterSpacing:'0.08em' }}>RLS · SUPABASE · E2E</div>
      </div>
    );
  }
  return null;
}

// ─── Tweaks panel ───────────────────────────────────────────────────────
const PANEL_STYLE = `
.LMT { position: fixed; right: 20px; bottom: 20px; width: 280px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 14px; padding: 14px; box-shadow: 0 20px 40px -12px rgba(0,0,0,0.2); font-family: Geist, system-ui; color: #0c0c1d; z-index: 9999; }
.LMT h4 { margin: 0 0 12px; font-size: 11px; font-family: Geist Mono, monospace; letter-spacing: 0.08em; text-transform: uppercase; color: #6b6b82; display: flex; justify-content: space-between; align-items: center; }
.LMT h4 button { border: 0; background: transparent; color: #9a9ab0; cursor: pointer; font-size: 14px; }
.LMT .row { margin-bottom: 12px; }
.LMT label { font-size: 11.5px; color: #6b6b82; display: block; margin-bottom: 6px; font-weight: 500; }
.LMT .seg { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 2px; padding: 3px; background: #f4f4f7; border-radius: 8px; }
.LMT .seg button { appearance: none; border: 0; background: transparent; padding: 6px 0; border-radius: 6px; font: inherit; font-size: 11.5px; color: #6b6b82; cursor: pointer; }
.LMT .seg button.on { background: #fff; color: #0c0c1d; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
`;

function TweaksPanelLM({ s, set, open, setOpen }) {
  if (!open) return <button onClick={()=>setOpen(true)} style={{ position:'fixed',right:20,bottom:20,height:38,padding:'0 14px',borderRadius:10,border:'1px solid #e4e4e7',background:'#fff',fontFamily:'Geist',fontSize:13,color:'#0c0c1d',cursor:'pointer',boxShadow:'0 6px 16px -4px rgba(0,0,0,0.1)',zIndex:9999 }}>⚙ Tweaks</button>;
  return (
    <div className="LMT">
      <style>{PANEL_STYLE}</style>
      <h4>Tweaks <button onClick={()=>setOpen(false)}>✕</button></h4>
      <div className="row"><label>Idioma</label>
        <div className="seg">
          {[['pt-BR','PT'],['en','EN']].map(([v,l])=>(<button key={v} className={s.lang===v?'on':''} onClick={()=>set({lang:v})}>{l}</button>))}
        </div>
      </div>
      <div className="row"><label>Tema</label>
        <div className="seg">
          {[['light','Light'],['dark','Dark']].map(([v,l])=>(<button key={v} className={s.theme===v?'on':''} onClick={()=>set({theme:v})}>{l}</button>))}
        </div>
      </div>
      <div className="row"><label>Device</label>
        <div className="seg">
          {[['ios','iPhone'],['android','Android']].map(([v,l])=>(<button key={v} className={s.device===v?'on':''} onClick={()=>set({device:v})}>{l}</button>))}
        </div>
      </div>
      <div className="row"><label>Bezel</label>
        <div className="seg">
          {[['on','Mostrar'],['off','Esconder']].map(([v,l])=>(<button key={v} className={s.bezel===v?'on':''} onClick={()=>set({bezel:v})}>{l}</button>))}
        </div>
      </div>
      <div className="row" style={{ marginBottom: 0 }}><label>Tipografia</label>
        <div className="seg">
          {[['sm','Small'],['md','Medium'],['lg','Large']].map(([v,l])=>(<button key={v} className={s.type===v?'on':''} onClick={()=>set({type:v})}>{l}</button>))}
        </div>
      </div>
    </div>
  );
}

// ─── App root ───────────────────────────────────────────────────────────
const DEF_LM = /*EDITMODE-BEGIN*/{
  "lang": "pt-BR",
  "theme": "light",
  "device": "ios",
  "bezel": "on",
  "type": "md"
}/*EDITMODE-END*/;

function AppLM() {
  const [s, setS] = useM(() => {
    try { return { ...DEF_LM, ...JSON.parse(localStorage.getItem('lm-v1') || '{}') }; }
    catch { return DEF_LM; }
  });
  const set = (patch) => setS(prev => { const next = { ...prev, ...patch }; try { localStorage.setItem('lm-v1', JSON.stringify(next)); } catch {} return next; });
  const [panelOpen, setPanelOpen] = useM(true);

  useEM(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setPanelOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setPanelOpen(false);
    };
    window.addEventListener('message', handler);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
    return () => window.removeEventListener('message', handler);
  }, []);

  const landing = <MobileLanding lang={s.lang} theme={s.theme} type={s.type}/>;

  const Device = s.device === 'ios' ? IOSDevice : AndroidDevice;
  const deviceDark = s.theme === 'dark';

  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 20px 40px' }}>
        {s.bezel === 'on' ? (
          <Device width={402} height={874} dark={deviceDark}>
            {landing}
          </Device>
        ) : (
          <div style={{ width: 402, height: 874, borderRadius: 18, overflow: 'hidden', background: deviceDark ? '#000' : '#fff', boxShadow: '0 30px 60px -20px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08)' }}>
            <div style={{ height: '100%', overflow: 'auto' }}>{landing}</div>
          </div>
        )}
      </div>
      <TweaksPanelLM s={s} set={set} open={panelOpen} setOpen={setPanelOpen}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppLM/>);
