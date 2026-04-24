// shell-a.jsx — Direction A shared shell (sidebar, styles) with Tweaks applied
// Exposes: Shell, SidebarA, Chip, Card, SearchBox, sharedAStyles, useAccent, tw helpers
// Supports: dark mode, density, sidebar collapse, accent color via CSS vars.

const SHELL_STYLE = `
.A-shell { font-family: Geist, system-ui; color: var(--a-ink-900); background: var(--a-bg); min-height: 100%; width: 100%; display: grid; }
.A-shell.sb-full { grid-template-columns: 240px 1fr; }
.A-shell.sb-mini { grid-template-columns: 64px 1fr; }

/* light (default) */
.A-shell[data-theme="light"] {
  --a-bg:#fafafb; --a-panel:#ffffff; --a-border:#eaeaf0; --a-divider:#f1f1f7;
  --a-ink-900:#0c0c1d; --a-ink-700:#3b3b52; --a-ink-500:#6b6b82; --a-ink-400:#9a9ab0;
  --a-chip-bg:#ffffff; --a-chip-hover:#f4f4f7;
  --a-hover:#f4f4f7; --a-active:#f4f4f7;
}
.A-shell[data-theme="dark"] {
  --a-bg:#07070f; --a-panel:#0f0f1e; --a-border:#1e1e2e; --a-divider:#17172a;
  --a-ink-900:#f4f4f7; --a-ink-700:#c8c8d5; --a-ink-500:#8a8a9e; --a-ink-400:#5a5a72;
  --a-chip-bg:#12121f; --a-chip-hover:#1a1a2a;
  --a-hover:#15152a; --a-active:#1a1a33;
}
/* density */
.A-shell[data-density="compact"]   { --a-pad:18px; --a-gap:10px; --a-kpi-pad:14px 16px; --a-row-pad:10px; --a-txpad:10px 4px; }
.A-shell[data-density="comfortable"] { --a-pad:32px; --a-gap:16px; --a-kpi-pad:20px 22px; --a-row-pad:14px; --a-txpad:16px 6px; }

/* Sidebar */
.A-sb { background: var(--a-panel); border-right: 1px solid var(--a-border); padding: 20px 14px; display: flex; flex-direction: column; gap: 2px; overflow: hidden; }
.A-shell.sb-mini .A-sb { padding: 20px 10px; align-items: center; }
.A-sb-brand { display: flex; align-items: center; gap: 10px; padding: 6px 8px 22px; }
.A-sb-brand img { width: 26px; height: 26px; flex: none; }
.A-sb-brand b { font-size: 14px; font-weight: 600; letter-spacing: -0.01em; white-space: nowrap; }
.A-shell.sb-mini .A-sb-brand { padding: 6px 0 22px; justify-content: center; }
.A-shell.sb-mini .A-sb-brand b, .A-shell.sb-mini .A-sb-sect, .A-shell.sb-mini .A-sb-item .lbl, .A-shell.sb-mini .A-sb-user .info { display: none; }
.A-sb-sect { font-family: Geist Mono, monospace; font-size: 10px; color: var(--a-ink-400); letter-spacing: 0.08em; padding: 16px 8px 8px; text-transform: uppercase; }
.A-sb-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; font-size: 13.5px; color: var(--a-ink-700); cursor: pointer; white-space: nowrap; text-decoration: none; }
.A-sb-item .ic { width: 16px; text-align: center; font-family: Geist Mono, monospace; font-size: 12px; color: var(--a-ink-500); flex: none; }
.A-shell.sb-mini .A-sb-item { justify-content: center; padding: 10px; }
.A-sb-item:hover { background: var(--a-hover); }
.A-sb-item.active { background: var(--a-active); color: var(--a-ink-900); font-weight: 500; }
.A-sb-item.active .ic { color: var(--accent); }
.A-sb-user { margin-top: auto; padding: 12px; border: 1px solid var(--a-border); border-radius: 12px; background: var(--a-bg); display: flex; align-items: center; gap: 10px; }
.A-shell.sb-mini .A-sb-user { padding: 6px; border: 0; background: transparent; }
.A-sb-user .av { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent-2)); color: white; display: grid; place-items: center; font-size: 12px; font-weight: 600; flex: none; }
.A-sb-user .info { flex: 1; min-width: 0; }
.A-sb-user .info .n { font-size: 12.5px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.A-sb-user .info .e { font-size: 11px; color: var(--a-ink-400); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Main */
.A-main { padding: var(--a-pad, 28px) var(--a-pad, 32px) 40px; overflow: hidden; }
.A-top { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 28px; gap: 16px; flex-wrap: wrap; }
.A-top h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.025em; color: var(--a-ink-900); }
.A-top .sub { font-size: 13px; color: var(--a-ink-500); margin-top: 4px; }

/* Chip */
.A-chip { height: 34px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--a-border); background: var(--a-chip-bg); display: inline-flex; align-items: center; gap: 6px; font-size: 12.5px; color: var(--a-ink-700); cursor: pointer; font-family: inherit; }
.A-chip:hover { background: var(--a-chip-hover); }
.A-chip.primary { background: var(--a-ink-900); color: var(--a-panel); border-color: var(--a-ink-900); font-weight: 500; }
.A-chip.primary:hover { background: var(--a-ink-700); }
.A-chip.active { border-color: var(--a-ink-900); color: var(--a-ink-900); font-weight: 500; background: var(--a-chip-bg); }
.A-chip.accent { background: var(--accent); color: white; border-color: var(--accent); font-weight: 500; }

/* Card */
.A-card { background: var(--a-panel); border: 1px solid var(--a-border); border-radius: 14px; padding: 20px; }
.A-card h3 { margin: 0; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; color: var(--a-ink-900); }
.A-card-h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
.A-card-h .meta { font-family: Geist Mono, monospace; font-size: 10.5px; color: var(--a-ink-400); letter-spacing: 0.05em; text-transform: uppercase; }

/* Search */
.A-search { display: flex; align-items: center; gap: 8px; height: 38px; padding: 0 12px; border: 1px solid var(--a-border); border-radius: 10px; background: var(--a-chip-bg); }
.A-search input { border: 0; outline: 0; font: inherit; font-size: 13px; flex: 1; color: var(--a-ink-900); background: transparent; }
.A-search input::placeholder { color: var(--a-ink-400); }

/* Tweaks panel — custom non-host-protocol inline panel per-artboard demo */
`;

const SB_ITEMS = [
  {
    group: 'Geral',
    items: [
      { id: 'dashboard', label: 'Dashboard', ic: '▦' },
      { id: 'transactions', label: 'Transações', ic: '≡' },
      { id: 'categories', label: 'Categorias', ic: '◫' },
      { id: 'savings', label: 'Caixinhas', ic: '⎘' },
    ],
  },
  {
    group: 'Análises',
    items: [
      { id: 'reports', label: 'Relatórios', ic: '⌗' },
      { id: 'goals', label: 'Metas', ic: '◎' },
      { id: 'insights', label: 'Insights', ic: '✱' },
    ],
  },
  { group: 'Conta', items: [{ id: 'profile', label: 'Perfil', ic: '◉' }] },
];

function SidebarA({ active }) {
  return (
    <aside className="A-sb">
      <div className="A-sb-brand">
        <img src="public/logo-expense-tracker.png" alt="" />
        <b>Expense Tracker</b>
      </div>
      {SB_ITEMS.map((g) => (
        <React.Fragment key={g.group}>
          <div className="A-sb-sect">{g.group}</div>
          {g.items.map((it) => (
            <div key={it.id} className={'A-sb-item' + (active === it.id ? ' active' : '')}>
              <span className="ic">{it.ic}</span>
              <span className="lbl">{it.label}</span>
            </div>
          ))}
        </React.Fragment>
      ))}
      <div className="A-sb-user">
        <div className="av">DC</div>
        <div className="info">
          <div className="n">davyd camargo</div>
          <div className="e">davydfontoura@gmail.com</div>
        </div>
      </div>
    </aside>
  );
}

const ACCENTS = {
  indigo: { accent: '#6366f1', accent2: '#0ea5e9' },
  cyan: { accent: '#0ea5e9', accent2: '#22d3ee' },
  violet: { accent: '#8b5cf6', accent2: '#6366f1' },
};

function Shell({ children, active, tweaks }) {
  const t = tweaks || { theme: 'light', density: 'regular', sidebar: 'full', accent: 'indigo' };
  const a = ACCENTS[t.accent] || ACCENTS.indigo;
  return (
    <div
      className={`A-shell sb-${t.sidebar}`}
      data-theme={t.theme}
      data-density={t.density}
      style={{ '--accent': a.accent, '--accent-2': a.accent2 }}
    >
      <style>{SHELL_STYLE}</style>
      <SidebarA active={active} />
      {children}
    </div>
  );
}

Object.assign(window, { Shell, SidebarA, SHELL_STYLE, ACCENTS, SB_ITEMS });
