import { Instagram, MessageCircle } from 'lucide-react';
import EditableText from './EditableText.jsx';
import { buildWhatsappHref } from '../utils/whatsapp.js';

export default function Contact({ data, editMode, updateField }) {
  const { configuracoes, contato, cliente } = data;
  const whatsappHref = buildWhatsappHref(data);
  const instagramHref = `https://instagram.com/${(contato.instagram || '').replace('@', '')}`;

  return (
    <section id="contato" className="section section--olive">
      <div className="container" style={{ textAlign: 'center', maxWidth: 720 }}>
        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', lineHeight: 1.2 }}>
          <EditableText
            editMode={editMode}
            tag="span"
            value={configuracoes.ctaFinalTitulo}
            onChange={(v) => updateField('configuracoes.ctaFinalTitulo', v)}
          />
          <br />
          <span className="serif-italic">
            <EditableText
              editMode={editMode}
              tag="span"
              value={configuracoes.ctaFinalTituloDestaque}
              onChange={(v) => updateField('configuracoes.ctaFinalTituloDestaque', v)}
              className="serif-italic"
            />
          </span>
        </h2>

        <EditableText
          editMode={editMode}
          tag="p"
          multiline={editMode}
          value={configuracoes.ctaFinalTexto}
          onChange={(v) => updateField('configuracoes.ctaFinalTexto', v)}
          style={{ opacity: 0.85, fontSize: '1.05rem', margin: '24px 0 40px', lineHeight: 1.8 }}
        />

        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn btn-primary">
            <MessageCircle size={15} /> Falar pelo WhatsApp
          </a>
          <a href="#experiencias" className="btn btn-outline">
            Consultar disponibilidade
          </a>
          <a href={instagramHref} target="_blank" rel="noreferrer" className="btn btn-outline">
            <Instagram size={15} /> Instagram
          </a>
        </div>

        {editMode && (
          <div
            style={{
              marginTop: 48,
              textAlign: 'left',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 8,
              padding: 24,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            <Field label="WhatsApp (com DDI e DDD)">
              <EditableText editMode value={contato.whatsapp} onChange={(v) => updateField('contato.whatsapp', v)} />
            </Field>
            <Field label="Instagram">
              <EditableText editMode value={contato.instagram} onChange={(v) => updateField('contato.instagram', v)} />
            </Field>
            <Field label="E-mail">
              <EditableText editMode value={contato.email} onChange={(v) => updateField('contato.email', v)} />
            </Field>
            <Field label="Valor personalizado (opcional)">
              <EditableText
                editMode
                value={cliente.valorPersonalizado}
                placeholder="Ex: R$ 2.200"
                onChange={(v) => updateField('cliente.valorPersonalizado', v)}
              />
            </Field>
            <Field label="Observações da proposta">
              <EditableText
                editMode
                multiline
                value={cliente.observacoes}
                onChange={(v) => updateField('cliente.observacoes', v)}
              />
            </Field>
          </div>
        )}

        {!editMode && cliente.ativa && (cliente.valorPersonalizado || cliente.observacoes) && (
          <div style={{ marginTop: 40, fontSize: '0.9rem', opacity: 0.85 }}>
            {cliente.valorPersonalizado && <p>Valor personalizado: {cliente.valorPersonalizado}</p>}
            {cliente.observacoes && <p>{cliente.observacoes}</p>}
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <p style={{ fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 6 }}>
        {label}
      </p>
      {children}
    </div>
  );
}
