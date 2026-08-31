import EditableText from './EditableText.jsx';

const MOMENTOS = ['Bastidores', 'Expectativa', 'Encontros', 'Detalhes', 'Abraços', 'Reações', 'Cerimônia', 'Festa'];

export default function About({ data, editMode, updateField }) {
  const { configuracoes } = data;

  return (
    <section id="sobre" className="section">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 48, maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
        <p className="eyebrow">
          <EditableText
            editMode={editMode}
            value={configuracoes.sobreTitulo}
            onChange={(v) => updateField('configuracoes.sobreTitulo', v)}
            className="eyebrow"
          />
        </p>

        <div>
          <EditableText
            editMode={editMode}
            tag="p"
            multiline={editMode}
            value={configuracoes.sobreTexto}
            onChange={(v) => updateField('configuracoes.sobreTexto', v)}
            style={{ fontSize: '1.15rem', color: 'var(--ink-soft)', lineHeight: 1.8 }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10,
            justifyContent: 'center',
          }}
        >
          {MOMENTOS.map((m) => (
            <span
              key={m}
              style={{
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
                padding: '8px 16px',
                border: '1px solid var(--line)',
                borderRadius: 30,
                color: 'var(--ink-soft)',
              }}
            >
              {m}
            </span>
          ))}
        </div>

        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }} className="serif-italic">
          <EditableText
            editMode={editMode}
            tag="span"
            value={configuracoes.sobreDestaque}
            onChange={(v) => updateField('configuracoes.sobreDestaque', v)}
            className="serif-italic"
          />
        </h2>
      </div>
    </section>
  );
}
