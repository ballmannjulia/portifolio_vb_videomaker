import EditableText from './EditableText.jsx';

export default function RealTime({ data, editMode, updateField }) {
  const { configuracoes } = data;

  return (
    <section className="section section--olive">
      <div className="container" style={{ maxWidth: 760, textAlign: 'center' }}>
        <p className="eyebrow">Experiência em tempo real</p>
        <h2 className="serif-italic" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', margin: '18px 0 28px' }}>
          <EditableText
            editMode={editMode}
            tag="span"
            value={configuracoes.sobreDestaque}
            onChange={(v) => updateField('configuracoes.sobreDestaque', v)}
            className="serif-italic"
          />
        </h2>
        <EditableText
          editMode={editMode}
          tag="p"
          multiline={editMode}
          value={configuracoes.realTimeTexto}
          onChange={(v) => updateField('configuracoes.realTimeTexto', v)}
          style={{ opacity: 0.88, fontSize: '1.05rem', lineHeight: 1.8 }}
        />
      </div>
    </section>
  );
}
