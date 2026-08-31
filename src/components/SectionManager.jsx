import { useState } from 'react';
import { Layers, ArrowUp, ArrowDown, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

const LABELS = {
  hero: 'Capa',
  about: 'Sobre o nosso olhar',
  gallery: 'Portfólio de vídeos',
  experiences: 'Experiências',
  comparison: 'Comparação',
  realtime: 'Experiência em tempo real',
  howItWorks: 'Como funciona',
  testimonials: 'Depoimentos',
  contact: 'Contato / CTA final',
};

export default function SectionManager({ order, visibility, moveSection, toggleSection }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="no-print" style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="admin-toolbar__row"
        style={{ width: '100%', background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}
      >
        <Layers size={14} /> Seções da página {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div style={{ padding: '4px clamp(16px, 4vw, 32px) 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {order.map((key, i) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '0.82rem',
                padding: '6px 10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 4,
                opacity: visibility[key] ? 1 : 0.5,
              }}
            >
              <span style={{ minWidth: 20, opacity: 0.5 }}>{i + 1}</span>
              <span style={{ flex: 1 }}>{LABELS[key] || key}</span>
              <button className="icon-btn" onClick={() => moveSection(key, 'up')} disabled={i === 0}>
                <ArrowUp size={12} />
              </button>
              <button className="icon-btn" onClick={() => moveSection(key, 'down')} disabled={i === order.length - 1}>
                <ArrowDown size={12} />
              </button>
              <button className="icon-btn" onClick={() => toggleSection(key)}>
                {visibility[key] ? <Eye size={12} /> : <EyeOff size={12} />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
