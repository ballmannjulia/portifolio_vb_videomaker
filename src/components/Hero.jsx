import EditableText from './EditableText.jsx';

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function Hero({ data, editMode, updateField }) {
  const { cliente, configuracoes } = data;
  const isPersonalized = cliente.ativa && (cliente.noiva || cliente.noivo);

  return (
    <section
      id="topo"
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(120% 100% at 50% 0%, var(--straw-soft) 0%, var(--offwhite) 55%, var(--offwhite) 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(90deg, transparent, transparent 119px, rgba(107,112,92,0.06) 120px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container fade-up" style={{ textAlign: 'center', padding: '120px clamp(20px,5vw,40px) 80px' }}>
        {editMode && (
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.75rem',
              marginBottom: 24,
              color: 'var(--ink-soft)',
            }}
          >
            <input
              type="checkbox"
              checked={cliente.ativa}
              onChange={(e) => updateField('cliente.ativa', e.target.checked)}
            />
            Ativar proposta personalizada (mostrar nomes do casal na capa)
          </label>
        )}

        {(isPersonalized || editMode) && (
          <div style={{ marginBottom: 28 }}>
            <p className="eyebrow" style={{ marginBottom: 14 }}>
              Uma proposta especialmente criada para
            </p>
            {editMode ? (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                }}
              >
                <EditableText
                  editMode
                  value={cliente.noiva}
                  placeholder="Noiva"
                  onChange={(v) => updateField('cliente.noiva', v)}
                  className="serif-italic"
                  style={{ textAlign: 'right', maxWidth: 220 }}
                />
                <span>&amp;</span>
                <EditableText
                  editMode
                  value={cliente.noivo}
                  placeholder="Noivo"
                  onChange={(v) => updateField('cliente.noivo', v)}
                  className="serif-italic"
                  style={{ textAlign: 'left', maxWidth: 220 }}
                />
              </div>
            ) : (
              isPersonalized && (
                <h2 className="serif-italic" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
                  {cliente.noiva} &amp; {cliente.noivo}
                </h2>
              )
            )}

            {editMode ? (
              <div style={{ marginTop: 14, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <input
                  type="date"
                  className="editable"
                  style={{ maxWidth: 180, textAlign: 'center' }}
                  value={cliente.data}
                  onChange={(e) => updateField('cliente.data', e.target.value)}
                />
                <EditableText
                  editMode
                  value={cliente.local}
                  placeholder="Local do casamento"
                  onChange={(v) => updateField('cliente.local', v)}
                  style={{ maxWidth: 220, textAlign: 'center' }}
                />
              </div>
            ) : (
              isPersonalized && (
                <p style={{ color: 'var(--ink-soft)', marginTop: 10 }}>
                  {formatDate(cliente.data)} {cliente.local && `· ${cliente.local}`}
                </p>
              )
            )}
          </div>
        )}

        <p className="eyebrow" style={{ marginBottom: 20 }}>
          <EditableText
            editMode={editMode}
            value={configuracoes.tagline}
            onChange={(v) => updateField('configuracoes.tagline', v)}
            className="eyebrow"
          />
        </p>

        <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', lineHeight: 1.15, maxWidth: 880, margin: '0 auto' }}>
          <EditableText
            editMode={editMode}
            tag="span"
            value={configuracoes.heroTitulo}
            onChange={(v) => updateField('configuracoes.heroTitulo', v)}
            multiline={editMode}
          />
          <br />
          <span className="serif-italic" style={{ color: 'var(--olive)' }}>
            <EditableText
              editMode={editMode}
              tag="span"
              value={configuracoes.heroTituloDestaque}
              onChange={(v) => updateField('configuracoes.heroTituloDestaque', v)}
              multiline={editMode}
              className="serif-italic"
            />
          </span>
        </h1>

        <div style={{ marginTop: 44 }}>
          <a href="#portfolio" className="btn btn-primary">
            Conheça nosso trabalho
          </a>
        </div>
      </div>
    </section>
  );
}
