import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import EditableText from './EditableText.jsx';

const LINKS = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#portfolio', label: 'Portfólio' },
  { href: '#experiencias', label: 'Experiências' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#contato', label: 'Contato' },
];

export default function Header({ data, editMode, updateField }) {
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(248, 246, 241, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0' }}
      >
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.2rem', maxWidth: 220 }}>
          <EditableText
            editMode={editMode}
            tag="span"
            value={data.configuracoes.nomeMarca}
            onChange={(v) => updateField('configuracoes.nomeMarca', v)}
          />
        </div>

        <nav
          style={{
            display: 'flex',
            gap: 28,
            fontSize: '0.82rem',
            letterSpacing: '0.03em',
          }}
          className="desktop-nav"
        >
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} style={{ textDecoration: 'none', color: 'var(--ink-soft)' }}>
              {l.label}
            </a>
          ))}
        </nav>

        <button
          className="btn btn-outline mobile-nav-toggle no-print"
          style={{ padding: 8, display: 'none' }}
          onClick={() => setOpen((o) => !o)}
          aria-label="Abrir menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>

        <a href="#contato" className="btn btn-primary no-print desktop-cta">
          Consultar disponibilidade
        </a>
      </div>

      {open && (
        <div className="container" style={{ paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ textDecoration: 'none', color: 'var(--ink)', fontSize: '0.95rem' }}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .desktop-nav, .desktop-cta { display: none !important; }
          .mobile-nav-toggle { display: inline-flex !important; }
        }
      `}</style>
    </header>
  );
}
