import EditableText from './EditableText.jsx';

export default function HowItWorks({ data, editMode, updateField }) {
  const steps = data.howItWorks;

  return (
    <section className="section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
          <p className="eyebrow">Como funciona</p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', marginTop: 12 }}>
            Do primeiro <span className="serif-italic">contato</span> à entrega final
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.2rem',
                  color: 'var(--olive-light)',
                }}
              >
                {step.numero}
              </span>
              <EditableText
                editMode={editMode}
                tag="h3"
                value={step.titulo}
                onChange={(v) => {
                  const next = [...steps];
                  next[idx] = { ...next[idx], titulo: v };
                  updateField('howItWorks', next);
                }}
                style={{ fontSize: '1.15rem' }}
              />
              <EditableText
                editMode={editMode}
                tag="p"
                multiline={editMode}
                value={step.descricao}
                onChange={(v) => {
                  const next = [...steps];
                  next[idx] = { ...next[idx], descricao: v };
                  updateField('howItWorks', next);
                }}
                style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.7 }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
