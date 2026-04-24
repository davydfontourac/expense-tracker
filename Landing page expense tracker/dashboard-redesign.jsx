// dashboard-redesign.jsx — Direction A canvas driver
// Mounts all Direction A screens as DCArtboards with shared Tweaks (theme/density/sidebar/accent)

const { useState: useStateDR, useEffect: useEffectDR } = React;

const DEFAULTS = /*EDITMODE-BEGIN*/ {
  theme: 'light',
  density: 'regular',
  sidebar: 'full',
  accent: 'indigo',
}; /*EDITMODE-END*/

function useTweaksDR() {
  const [t, setT] = useStateDR(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('dr-tweaks-v2') || '{}');
      return { ...DEFAULTS, ...saved };
    } catch {
      return DEFAULTS;
    }
  });
  useEffectDR(() => {
    try {
      localStorage.setItem('dr-tweaks-v2', JSON.stringify(t));
    } catch {}
  }, [t]);
  return [t, (patch) => setT((prev) => ({ ...prev, ...patch }))];
}

// Canvas-level tweaks panel (floating, bottom-right)
const TWK_STYLE = `
.DR-tweaks { position: fixed; right: 20px; bottom: 20px; width: 268px; background: #ffffff; border: 1px solid #e4e4e7; border-radius: 14px; padding: 14px; box-shadow: 0 20px 40px -12px rgba(0,0,0,0.18); font-family: Geist, system-ui; color: #0c0c1d; z-index: 9999; }
.DR-tweaks h4 { margin: 0 0 12px; font-size: 12px; font-family: Geist Mono, monospace; letter-spacing: 0.08em; text-transform: uppercase; color: #6b6b82; display: flex; justify-content: space-between; align-items: center; }
.DR-tweaks h4 button { border: 0; background: transparent; color: #9a9ab0; cursor: pointer; font-size: 14px; padding: 0 4px; }
.DR-row { margin-bottom: 14px; }
.DR-row > label { font-size: 11.5px; color: #6b6b82; display: block; margin-bottom: 6px; font-weight: 500; }
.DR-seg { display: grid; grid-auto-flow: column; grid-auto-columns: 1fr; gap: 2px; padding: 3px; background: #f4f4f7; border-radius: 8px; }
.DR-seg button { appearance: none; border: 0; background: transparent; padding: 6px 0; border-radius: 6px; font: inherit; font-size: 12px; color: #6b6b82; cursor: pointer; }
.DR-seg button.on { background: #fff; color: #0c0c1d; font-weight: 500; box-shadow: 0 1px 2px rgba(0,0,0,0.06); }
.DR-sw { display: flex; gap: 6px; }
.DR-sw button { flex: 1; height: 28px; border-radius: 6px; border: 1px solid #eaeaf0; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; font: inherit; font-size: 11px; color: #6b6b82; }
.DR-sw button.on { border-color: #0c0c1d; color: #0c0c1d; font-weight: 500; }
.DR-sw .dot { width: 10px; height: 10px; border-radius: 50%; }
`;

function TweaksPanelDR({ t, set }) {
  const [open, setOpen] = useStateDR(true);
  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          right: 20,
          bottom: 20,
          height: 38,
          padding: '0 14px',
          borderRadius: 10,
          border: '1px solid #e4e4e7',
          background: '#fff',
          fontFamily: 'Geist',
          fontSize: 13,
          color: '#0c0c1d',
          cursor: 'pointer',
          boxShadow: '0 6px 16px -4px rgba(0,0,0,0.1)',
          zIndex: 9999,
        }}
      >
        ⚙ Tweaks
      </button>
    );
  return (
    <div className="DR-tweaks">
      <style>{TWK_STYLE}</style>
      <h4>
        Tweaks <button onClick={() => setOpen(false)}>✕</button>
      </h4>
      <div className="DR-row">
        <label>Tema</label>
        <div className="DR-seg">
          {[
            ['light', 'Light'],
            ['dark', 'Dark'],
          ].map(([v, l]) => (
            <button key={v} className={t.theme === v ? 'on' : ''} onClick={() => set({ theme: v })}>
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="DR-row">
        <label>Densidade</label>
        <div className="DR-seg">
          {[
            ['compact', 'Compact'],
            ['regular', 'Regular'],
            ['comfortable', 'Comfort'],
          ].map(([v, l]) => (
            <button
              key={v}
              className={t.density === v ? 'on' : ''}
              onClick={() => set({ density: v })}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="DR-row">
        <label>Sidebar</label>
        <div className="DR-seg">
          {[
            ['full', 'Full'],
            ['mini', 'Mini'],
          ].map(([v, l]) => (
            <button
              key={v}
              className={t.sidebar === v ? 'on' : ''}
              onClick={() => set({ sidebar: v })}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="DR-row" style={{ marginBottom: 0 }}>
        <label>Accent</label>
        <div className="DR-sw">
          {[
            ['indigo', '#6366f1'],
            ['violet', '#8b5cf6'],
            ['cyan', '#0ea5e9'],
          ].map(([v, c]) => (
            <button
              key={v}
              className={t.accent === v ? 'on' : ''}
              onClick={() => set({ accent: v })}
            >
              <span className="dot" style={{ background: c }} />
              {v}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Main canvas
function AppDR() {
  const [t, set] = useTweaksDR();

  // Edit-mode protocol
  useEffectDR(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') {
        /* panel visible by default */
      }
    };
    window.addEventListener('message', handler);
    try {
      window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    } catch {}
    return () => window.removeEventListener('message', handler);
  }, []);

  const screens = [
    {
      id: 'auth',
      label: '00 · Login / Cadastro',
      w: 1240,
      h: 780,
      render: () => <AuthA tweaks={t} />,
    },
    {
      id: 'dashboard',
      label: '01 · Dashboard',
      w: 1320,
      h: 980,
      render: () => <DashboardA tweaks={t} />,
    },
    {
      id: 'transactions',
      label: '02 · Transações',
      w: 1320,
      h: 980,
      render: () => <TransactionsA tweaks={t} />,
    },
    {
      id: 'categories',
      label: '03 · Categorias',
      w: 1320,
      h: 780,
      render: () => <CategoriesA tweaks={t} />,
    },
    {
      id: 'savings',
      label: '04 · Caixinhas / Metas',
      w: 1320,
      h: 820,
      render: () => <SavingsA tweaks={t} />,
    },
    { id: 'profile', label: '05 · Perfil', w: 1320, h: 880, render: () => <ProfileA tweaks={t} /> },
  ];

  return (
    <>
      <DesignCanvas
        title="Expense Tracker · Direção A (Clean)"
        subtitle="Redesign completo — sidebar, dashboard, transações, categorias, caixinhas, perfil e auth"
      >
        <DCSection id="auth" title="Entrada · Login & Cadastro">
          <DCArtboard id="auth" label={screens[0].label} width={screens[0].w} height={screens[0].h}>
            {screens[0].render()}
          </DCArtboard>
        </DCSection>
        <DCSection id="core" title="App · Telas principais">
          {screens.slice(1, 5).map((s) => (
            <DCArtboard key={s.id} id={s.id} label={s.label} width={s.w} height={s.h}>
              {s.render()}
            </DCArtboard>
          ))}
        </DCSection>
        <DCSection id="account" title="Conta">
          <DCArtboard
            id="profile"
            label={screens[5].label}
            width={screens[5].w}
            height={screens[5].h}
          >
            {screens[5].render()}
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
      <TweaksPanelDR t={t} set={set} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppDR />);
