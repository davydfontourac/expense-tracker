/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';

// ─────────────────────────────────────────────────────────────────────────────
// Reveal on scroll (IntersectionObserver) + delayed entry for above-the-fold
// ─────────────────────────────────────────────────────────────────────────────
import { Reveal } from '@/components/Reveal';

// ─────────────────────────────────────────────────────────────────────────────
// Copy (PT-BR + EN)
// ─────────────────────────────────────────────────────────────────────────────
import { LANDING_COPY } from '@/components/Landing/LandingTranslations';
import type { LandingCopy } from '@/types/landing';

const COPY = LANDING_COPY;

import "./Landing.css";

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
const Icon = {
  arrow: (p: any) => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...p}>
      <path
        d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  play: (p: any) => (
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" {...p}>
      <path
        d="M1 1l8 5-8 5V1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="currentColor"
      />
    </svg>
  ),
  github: (p: any) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.79 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.39 1.24-3.23-.13-.3-.54-1.52.11-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.92 1.24 3.23 0 4.62-2.81 5.64-5.48 5.94.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58C20.56 22.28 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z" />
    </svg>
  ),
  linkedin: (p: any) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" {...p}>
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
    </svg>
  ),
};

// ─────────────────────────────────────────────────────────────────────────────
// Nav
// ─────────────────────────────────────────────────────────────────────────────
function Nav({ lang, setLang, t, scrolled, isMobile }: { lang: string, setLang: (l: string) => void, t: LandingCopy, scrolled: boolean, isMobile: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <a href="#" className="brand">
            <img src="/logo-expense-tracker.webp" alt="Logo" />
          </a>
          <div className="nav-links">
            <a href="#features">{t.nav.features}</a>
            <a href="#how">{t.nav.how}</a>
            <a
              href="https://github.com/davydfontourac/expense-tracker"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.nav.github}
            </a>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <div className="lang-toggle" role="tablist" aria-label="Language">
              <button className={lang === 'pt-BR' ? 'active' : ''} onClick={() => setLang('pt-BR')}>
                PT
              </button>
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
                EN
              </button>
            </div>
            <Link to={isMobile ? "/welcome?mode=login" : "/login"} className="btn btn-ghost btn-sm">
              {t.nav.signin}
            </Link>
            <Link to={isMobile ? "/welcome" : "/register"} className="btn btn-primary btn-sm">
              {t.nav.cta}
            </Link>
          </div>
          <button className="burger" onClick={() => setMenuOpen(true)} aria-label="Menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-sheet">
          <div className="top">
            <a href="#" className="brand" onClick={() => setMenuOpen(false)}>
              <img src="/logo-expense-tracker.webp" alt="Logo" />
            </a>
            <button className="x-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
              ✕
            </button>
          </div>
          <nav>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              {t.nav.features}
            </a>
            <a href="#how" onClick={() => setMenuOpen(false)}>
              {t.nav.how}
            </a>
            <a
              href="https://github.com/davydfontourac/expense-tracker"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              {t.nav.github}
            </a>
          </nav>
          <div className="foot">
            <div className="foot-row">
              <ThemeToggle dropdownPosition="top" align="left" />
              <div className="lang-toggle" role="tablist" aria-label="Language">
                <button
                  className={lang === 'pt-BR' ? 'active' : ''}
                  onClick={() => setLang('pt-BR')}
                >
                  PT
                </button>
                <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
                  EN
                </button>
              </div>
            </div>
            <Link to={isMobile ? "/welcome?mode=login" : "/login"} className="btn btn-ghost" onClick={() => setMenuOpen(false)}>
              {t.nav.signin}
            </Link>
            <Link to={isMobile ? "/welcome" : "/register"} className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              {t.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard mockup (clean, data-driven, not slop)
// ─────────────────────────────────────────────────────────────────────────────
function DashboardMock({ t }: { t: LandingCopy }) {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mkSpark = (pts: number[], color: string) => {
    const mx = Math.max(...pts);
    return (
      <svg
        width="100%"
        height="22"
        viewBox="0 0 100 22"
        preserveAspectRatio="none"
        style={{ marginTop: 10 }}
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          points={pts
            .map((v, i) => `${(i / (pts.length - 1)) * 100},${22 - (v / mx) * 20}`)
            .join(' ')}
        />
      </svg>
    );
  };

  return (
    <>
      {/* Desktop Version */}
      <div className="mock desktop-only">
        <div className="mock-chrome">
          <div className="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="url">myexpenseetracker.vercel.app/dashboard</div>
          <div style={{ width: 52 }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 500 }}>
          {/* Sidebar */}
          <aside
            style={{
              borderRight: '1px solid var(--ink-200)',
              padding: '20px 16px',
              background: 'var(--ink-50)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0 4px 16px',
                marginBottom: 4,
              }}
            >
              <img
                src="/logo-expense-tracker.webp"
                alt=""
                style={{ width: 22, height: 22, objectFit: 'contain', borderRadius: 6 }}
              />
              <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em' }}>
                Expense Tracker
              </span>
            </div>
            <div
              style={{
                fontFamily: 'Geist Mono, monospace',
                fontSize: 9.5,
                color: 'var(--ink-400)',
                letterSpacing: '0.08em',
                padding: '6px 10px 6px',
                textTransform: 'uppercase',
              }}
            >
              {t.mock.sidebar.general}
            </div>
            {[
              ['▦', t.mock.sidebar.dashboard, 0],
              ['≡', t.mock.sidebar.transactions, 1],
              ['◫', t.mock.sidebar.categories, 2],
              ['⎘', t.mock.sidebar.savings, 3],
            ].map(([ic, label, index]) => (
              <div
                key={label.toString()}
                onClick={() => setActiveTab(index as number)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(index as number); }}
                role="button"
                tabIndex={0}
                style={{
                  padding: '7px 10px',
                  borderRadius: 7,
                  fontSize: 13,
                  color: activeTab === index ? 'var(--ink-900)' : 'var(--ink-500)',
                  background: activeTab === index ? 'var(--ink-100)' : 'transparent',
                  fontWeight: activeTab === index ? 500 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
              >
                <span
                  style={{
                    width: 14,
                    fontFamily: 'Geist Mono, monospace',
                    fontSize: 11,
                    color: activeTab === index ? 'var(--brand-500)' : 'var(--ink-400)',
                    textAlign: 'center',
                  }}
                >
                  {ic}
                </span>
                {label}
              </div>
            ))}
          </aside>

          {/* Main */}
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.025em' }}>
                  {t.mock.header.greeting}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-500)', marginTop: 4 }}>
                  {t.mock.header.spent} <b style={{ color: 'var(--ink-900)' }}>R$ 3.420,00</b>{' '}
                  {t.mock.header.inApril} · 41% {t.mock.header.ofRevenue}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div
                  style={{
                    height: 30,
                    padding: '0 10px',
                    borderRadius: 7,
                    border: '1px solid var(--ink-200)',
                    background: 'white',
                    fontSize: 11.5,
                    color: 'var(--ink-700)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  📅 {t.mock.header.april2026}
                </div>
              </div>
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {activeTab === 0 && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {[
                      { label: t.mock.kpis.available, v: 'R$ 12.450,00', color: '#6366f1' },
                      { label: t.mock.kpis.income, v: 'R$ 8.200,00', color: '#10b981' },
                      { label: t.mock.kpis.expenses, v: 'R$ 3.420,00', color: '#ef4444' },
                    ].map((k, i) => (
                      <div key={i} style={{ padding: 14, borderRadius: 12, border: '1px solid var(--ink-200)', background: 'white' }}>
                        <div style={{ fontSize: 10, color: 'var(--ink-400)', fontFamily: 'Geist Mono', letterSpacing: '0.08em' }}>{k.label}</div>
                        <div style={{ fontSize: 22, fontWeight: 600, marginTop: 8 }}>{k.v}</div>
                        {mkSpark(i === 2 ? [60, 52, 58, 44, 50, 38, 30, 24] : [20, 28, 24, 36, 30, 42, 38, 50], k.color)}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 10, flex: 1 }}>
                    <div style={{ padding: 14, borderRadius: 12, border: '1px solid var(--ink-200)', background: 'white' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{t.mock.charts.monthlyTitle}</div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 110 }}>
                        {[42, 48, 52, 58, 65, 72, 68, 75, 82, 88, 92, 85].map((h, i) => (
                          <div key={i} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: '100%', height: h + '%', borderRadius: '3px 3px 0 0', background: i === 3 ? '#6366f1' : '#c7d2fe' }} />
                            <div style={{ fontSize: 8, color: 'var(--ink-400)', fontFamily: 'Geist Mono' }}>{t.mock.months[i]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ padding: 14, borderRadius: 12, border: '1px solid var(--ink-200)', background: 'white' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{t.mock.charts.distTitle}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}><Donut t={t} /></div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 1 && (
                <div style={{ background: 'white', borderRadius: 12, border: '1px solid var(--ink-200)', padding: 16, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{t.mock.sidebar.transactions}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {t.mock.tabs.transactions.map((tx: any, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--ink-100)' : 'none' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--ink-50)', display: 'grid', placeItems: 'center', fontSize: 14 }}>{tx.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{tx.title}</div>
                          <div style={{ fontSize: 10, color: 'var(--ink-400)', fontFamily: 'Geist Mono' }}>{tx.cat}</div>
                        </div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: tx.pos ? '#10b981' : 'var(--ink-900)' }}>{tx.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 2 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, flex: 1 }}>
                  {t.mock.tabs.categories.map((cat: any, i: number) => (
                    <div key={i} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--ink-200)', padding: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>{cat.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>{cat.val}</div>
                        <div style={{ fontSize: 9, color: 'var(--ink-400)' }}>{t.mock.header.target}: {cat.limit}</div>
                      </div>
                      <div style={{ height: 6, background: 'var(--ink-100)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: cat.pct + '%', height: '100%', background: cat.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 3 && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, flex: 1 }}>
                  {t.mock.tabs.savings.map((sav: any, i: number) => (
                    <div key={i} style={{ background: 'white', borderRadius: 12, border: '1px solid var(--ink-200)', padding: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{sav.name}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 700 }}>{sav.curr}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-400)' }}>{t.mock.sidebar.goals}: {sav.target}</div>
                      </div>
                      <div style={{ height: 8, background: 'var(--ink-100)', borderRadius: 4, overflow: 'hidden', marginBottom: 4 }}>
                        <div style={{ width: sav.pct + '%', height: '100%', background: '#10B981' }} />
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--ink-400)', textAlign: 'right' }}>{sav.pct}% {t.mock.header.completed}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="mock mobile-only" style={{ padding: 20 }}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ minHeight: 180 }}
        >
          {activeTab === 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: 'var(--ink-400)', textTransform: 'uppercase', fontFamily: 'Geist Mono' }}>Disponível · Abril</div>
                <div style={{ fontSize: 14 }}>⋯</div>
              </div>
              <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em' }}>R$ 12.450,00</div>
              <div style={{ fontSize: 11, color: '#10b981', marginTop: 8, fontFamily: 'Geist Mono' }}>+ R$ 1.200,00 (10,2%)</div>
              <div style={{ marginTop: 20, height: 60, background: 'var(--ink-50)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ transform: 'scale(0.7)' }}><Donut t={t} /></div>
              </div>
            </>
          )}

          {activeTab === 1 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{t.mock.sidebar.transactions}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {t.mock.tabs.transactions.slice(0, 3).map((tx: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12 }}>{tx.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: tx.pos ? '#10b981' : 'inherit' }}>{tx.val}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 2 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{t.mock.sidebar.categories}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {t.mock.tabs.categories.slice(0, 2).map((cat: any, i: number) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, marginBottom: 4 }}>{cat.name}</div>
                    <div style={{ height: 6, background: 'var(--ink-100)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: cat.pct + '%', height: '100%', background: cat.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 3 && (
            <>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{t.mock.sidebar.savings}</div>
              {t.mock.tabs.savings.slice(0, 1).map((sav: any, i: number) => (
                <div key={i} style={{ padding: 12, border: '1px solid var(--ink-200)', borderRadius: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{sav.name}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, margin: '8px 0' }}>{sav.curr}</div>
                  <div style={{ height: 6, background: 'var(--ink-100)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: sav.pct + '%', height: '100%', background: '#10b981' }} />
                  </div>
                </div>
              ))}
            </>
          )}
        </motion.div>
        
        {/* Mobile Tab Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid var(--ink-100)', marginTop: 24, paddingTop: 12 }}>
          {['▦', '≡', '◫', '⎘'].map((ic, i) => (
            <div 
              key={i} 
              onClick={() => setActiveTab(i)} 
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(i); }}
              role="button"
              tabIndex={0}
              style={{ fontSize: 18, color: activeTab === i ? 'var(--brand-500)' : 'var(--ink-300)', cursor: 'pointer' }}
            >
              {ic}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Donut({ t }: { t: LandingCopy }) {
  const segs = [
    { v: 38, c: '#6366f1' },
    { v: 30, c: '#8b5cf6' },
    { v: 16, c: '#22d3ee' },
    { v: 8, c: '#0ea5e9' },
    { v: 8, c: '#94a3b8' },
  ];
  const R = 36,
    C = 2 * Math.PI * R;
  let acc = 0;
  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={R} fill="none" stroke="var(--ink-100)" strokeWidth="14" />
      {segs.map((s, i) => {
        const len = (s.v / 100) * C;
        const el = (
          <circle
            key={i}
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke={s.c}
            strokeWidth="14"
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-acc}
            transform="rotate(-90 50 50)"
          />
        );
        acc += len;
        return el;
      })}
      <text
        x="50"
        y="48"
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill="#0c0c1d"
        fontFamily="Geist"
      >
        R$ 1.3k
      </text>
      <text x="50" y="62" textAnchor="middle" fontSize="8" fill="#9a9ab0" fontFamily="Geist Mono">
        {t.mock.charts.spent}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────────────────────────────────────
function Hero({ t, isMobile }: { t: LandingCopy, isMobile: boolean }) {
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
          {t.hero.h1a}
          <br />
          <em>{t.hero.h1b}</em>
        </h1>
        <p className="lede hero-sub">{t.hero.sub}</p>
        <div className="hero-actions">
          <Link to={isMobile ? "/welcome" : "/register"} className="btn btn-primary">
            {t.hero.cta} <Icon.arrow />
          </Link>
          <Link
            to="/login"
            className="btn btn-ghost"
          >
            <Icon.play /> {t.hero.cta2}
          </Link>
        </div>
        <div className="hero-trust">{t.hero.trust}</div>

        <Reveal className="mock-wrap" variant="scale" afterLoad={900}>
          <DashboardMock t={t} />
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Problems
// ─────────────────────────────────────────────────────────────────────────────
function Problems({ t }: { t: LandingCopy }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="section-head">
          <div className="kicker">{t.problems.kicker}</div>
          <h2 className="h2">{t.problems.title}</h2>
        </Reveal>
        <div className="prob-grid">
          {t.problems.items.map((p: any, i: number) => (
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
function FeatureVisuals(t: any) {
  return {
    dashboard: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div
          style={{
            padding: 14,
            borderRadius: 10,
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.25)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'Geist Mono, monospace',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {t.visuals.balance}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginTop: 4,
            }}
          >
            R$ 18.240
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'Geist Mono, monospace',
              color: 'var(--accent-400)',
              marginTop: 2,
            }}
          >
            {t.visuals.accumulated}
          </div>
        </div>
        <div
          style={{
            padding: 14,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'Geist Mono, monospace',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {t.visuals.expenses}
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: '#fff',
              letterSpacing: '-0.02em',
              marginTop: 4,
            }}
          >
            R$ 4.827
          </div>
          <div
            style={{
              fontSize: 10,
              fontFamily: 'Geist Mono, monospace',
              color: 'rgba(255,255,255,0.5)',
              marginTop: 2,
            }}
          >
            {t.visuals.oct2026}
          </div>
        </div>
      </div>
    ),
    csv: (
      <div
        style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 11,
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          padding: 12,
          color: 'rgba(255,255,255,0.75)',
        }}
      >
        <div style={{ color: 'rgba(255,255,255,0.4)' }}>$ statement.csv</div>
        <div style={{ marginTop: 6 }}>
          <span style={{ color: '#22d3ee' }}>02/10</span> IFOOD *PIZZARIA{' '}
          <span style={{ color: '#a78bfa' }}>→ {t.visuals.csv.food}</span>
        </div>
        <div>
          <span style={{ color: '#22d3ee' }}>04/10</span> UBER TRIP{' '}
          <span style={{ color: '#a78bfa' }}>→ {t.visuals.csv.transport}</span>
        </div>
        <div>
          <span style={{ color: '#22d3ee' }}>07/10</span> NETFLIX{' '}
          <span style={{ color: '#a78bfa' }}>→ {t.visuals.csv.subs}</span>
        </div>
        <div style={{ marginTop: 8, color: '#10b981' }}>✓ 47 {t.visuals.csv.imported}</div>
      </div>
    ),
    categories: (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[
          ['🍔', t.visuals.categories[0], 'rgba(239,68,68,0.2)'],
          ['🚗', t.visuals.categories[1], 'rgba(14,165,233,0.2)'],
          ['🏠', t.visuals.categories[2], 'rgba(99,102,241,0.2)'],
          ['🎬', t.visuals.categories[3], 'rgba(168,85,247,0.2)'],
          ['💊', t.visuals.categories[4], 'rgba(34,197,94,0.2)'],
          ['📚', t.visuals.categories[5], 'rgba(234,179,8,0.2)'],
          ['✈️', t.visuals.categories[6], 'rgba(34,211,238,0.2)'],
          ['+ ' + t.visuals.categories[7], '', 'rgba(255,255,255,0.06)'],
        ].map(([e, l, bg], i) => (
          <div
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 10px',
              borderRadius: 999,
              background: bg,
              border: '1px solid rgba(255,255,255,0.1)',
              fontSize: 12,
              color: '#fff',
            }}
          >
            <span>{e}</span>
            {l && <span>{l}</span>}
          </div>
        ))}
      </div>
    ),
    dark: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, height: 80 }}>
        <div style={{ borderRadius: 8, background: 'white', padding: 10 }}>
          <div style={{ height: 4, borderRadius: 2, background: '#e6e6ee', width: '60%' }} />
          <div
            style={{
              height: 12,
              borderRadius: 2,
              background: '#0c0c1d',
              marginTop: 6,
              width: '80%',
            }}
          />
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: '#e6e6ee',
              marginTop: 8,
              width: '50%',
            }}
          />
        </div>
        <div
          style={{
            borderRadius: 8,
            background: '#0c0c1d',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: 10,
          }}
        >
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.15)',
              width: '60%',
            }}
          />
          <div
            style={{
              height: 12,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.85)',
              marginTop: 6,
              width: '80%',
            }}
          />
          <div
            style={{
              height: 4,
              borderRadius: 2,
              background: 'rgba(255,255,255,0.15)',
              marginTop: 8,
              width: '50%',
            }}
          />
        </div>
      </div>
    ),
    security: (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: 14,
          borderRadius: 10,
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          fontFamily: 'Geist Mono, monospace',
          fontSize: 11,
        }}
      >
        <div style={{ color: '#10b981' }}>●</div>
        <div style={{ color: 'rgba(255,255,255,0.75)' }}>
          row-level-security <span style={{ color: 'rgba(255,255,255,0.4)' }}>ON</span>
        </div>
        <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.4)' }}>Supabase</div>
      </div>
    ),
  };
}

function Features({ t }: { t: LandingCopy }) {
  const v = FeatureVisuals(t);
  const visuals = [v.dashboard, v.csv, v.categories, v.dark, v.security];
  const classes = ['span-3', 'span-3', 'span-2', 'span-2', 'span-2'];

  return (
    <section className="section section-dark" id="features">
      <div className="container">
        <Reveal className="section-head">
          <div className="kicker">{t.features.kicker}</div>
          <h2 className="h2" style={{ color: '#fff' }}>
            {t.features.title}
          </h2>
        </Reveal>
        <div className="feat-grid">
          {t.features.items.map((f: any, i: number) => (
            <Reveal
              key={i}
              className={`feat-card ${classes[i]}`}
              variant="scale"
              delay={(i % 3) + 1}
            >
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
function HowItWorks({ t, lang }: { t: LandingCopy, lang: string }) {
  const stats =
    lang === 'pt-BR'
      ? [
          [
            '100%',
            <>
              <em>open</em> source
            </>,
            'Código no GitHub · MIT',
          ],
          ['5min', 'Até o primeiro relatório', 'Do cadastro ao insight'],
          ['∞', 'Categorias customizáveis', 'Emoji, cor, seu jeito'],
          ['R$ 0', 'Gratuito para sempre', 'Sem pegadinha, sem cartão'],
        ]
      : [
          [
            '100%',
            <>
              <em>open</em> source
            </>,
            'Code on GitHub · MIT',
          ],
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
          {t.how.steps.map((s: any, i: number) => (
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
              <div
                className="stat-l"
                style={{ fontFamily: 'Geist', color: 'var(--ink-700)', fontSize: 14, marginTop: 4 }}
              >
                {sub}
              </div>
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
function FinalCTA({ t, isMobile }: { t: LandingCopy, isMobile: boolean }) {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <Reveal className="final-cta" variant="scale">
          <div className="final-cta-inner">
            <h2 className="h2">{t.cta.title}</h2>
            <p className="lede">{t.cta.sub}</p>
            <div className="actions">
              <Link to={isMobile ? "/welcome" : "/register"} className="btn btn-primary">
                {t.cta.btn} <Icon.arrow />
              </Link>
              <a
                href="https://github.com/davydfontourac/expense-tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
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
function Footer({ t }: { t: LandingCopy }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <a href="#" className="brand">
              <img
                src="/logo-expense-tracker.webp"
                alt="Logo"
                style={{ width: 110, height: 80, objectFit: 'contain' }}
              />
            </a>
            <div
              style={{
                marginTop: 14,
                fontSize: 14,
                color: 'var(--ink-500)',
                maxWidth: 320,
                lineHeight: 1.55,
              }}
            >
              {t.footer.tag}
            </div>
          </div>
          <div className="footer-col">
            <h4>{t.footer.product}</h4>
            <ul>
              {t.footer.links.product.map(([l, h]: any) => (
                <li key={l}>
                  <a href={h}>{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.company}</h4>
            <ul>
              {t.footer.links.company.map(([l, h]: any) => (
                <li key={l}>
                  <a
                    href={h}
                    target={h.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t.footer.resources}</h4>
            <ul>
              {t.footer.links.resources.map(([l, h]: any) => (
                <li key={l}>
                  {h.startsWith('/') ? (
                    <Link to={h}>{l}</Link>
                  ) : (
                    <a href={h}>{l}</a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div>{t.footer.rights}</div>
          <div className="footer-social">
            <a
              href="https://github.com/davydfontourac"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Icon.github />
            </a>
            <a
              href="https://linkedin.com/in/davyd-camargo-dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Icon.linkedin />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Landing Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function Landing() {
  useTheme();
  const [lang, setLang] = useState(() => localStorage.getItem('language') || 'pt-BR');
  const [isDark, setIsDark] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 820);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const checkDark = () => {
      setIsDark(root.classList.contains('dark'));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const t = COPY[lang];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang === 'pt-BR' ? 'pt-BR' : 'en';
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="landing-wrapper"
      data-theme={isDark ? 'dark' : 'light'}
      style={{
        background: isDark ? '#07070f' : 'white',
        color: isDark ? '#e8e8f0' : 'var(--ink-900)',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      <Nav lang={lang} setLang={setLang} t={t} scrolled={scrolled} isMobile={isMobile} />
      <Hero t={t} isMobile={isMobile} />
      <Problems t={t} />
      <Features t={t} />
      <HowItWorks t={t} lang={lang} />
      <FinalCTA t={t} isMobile={isMobile} />
      <Footer t={t} />
    </div>
  );
}
