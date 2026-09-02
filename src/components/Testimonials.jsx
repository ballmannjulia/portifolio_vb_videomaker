import { Plus, Trash2, Quote, ArrowUp, ArrowDown, Eye, EyeOff, ImageUp } from 'lucide-react';
import EditableText from './EditableText.jsx';
import { saveUploadedFile } from '../utils/storage.js';

export default function Testimonials({ data, editMode, actions }) {
  const depoimentos = data.depoimentos;
  const visibleCount = depoimentos.filter((d) => d.visivel).length;

  const handleUpload = async (event, itemId, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await saveUploadedFile(file);
      actions.updateArrayItem('depoimentos', itemId, field, result?.dataUrl || '');
    } catch (error) {
      console.error(error);
      window.alert('Não foi possível enviar a imagem. Tente outra imagem menor ou em outro formato.');
    } finally {
      event.target.value = '';
    }
  };

  if (!editMode && visibleCount === 0) return null;

  return (
    <section id="depoimentos" className="section section--straw">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
          <p className="eyebrow">Depoimentos</p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', marginTop: 12 }}>
            Quem viveu, <span className="serif-italic">conta</span>
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {depoimentos.map((dep, i) => {
            if (!editMode && !dep.visivel) return null;
            return (
              <div
                key={dep.id}
                style={{
                  opacity: dep.visivel ? 1 : 0.45,
                  background: 'var(--white)',
                  borderRadius: 10,
                  padding: 30,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <Quote size={22} color="var(--clay)" />
                <EditableText
                  editMode={editMode}
                  tag="p"
                  multiline={editMode}
                  value={dep.texto}
                  onChange={(v) => actions.updateArrayItem('depoimentos', dep.id, 'texto', v)}
                  style={{ fontStyle: 'italic', color: 'var(--ink)', lineHeight: 1.7, fontSize: '0.98rem' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6 }}>
                  {dep.foto ? (
                    <img
                      src={dep.foto}
                      alt={dep.noivos}
                      style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: 'var(--straw)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <EditableText
                      editMode={editMode}
                      value={dep.noivos}
                      onChange={(v) => actions.updateArrayItem('depoimentos', dep.id, 'noivos', v)}
                      style={{ fontWeight: 600, fontSize: '0.92rem' }}
                    />
                    <div style={{ display: 'flex', gap: 6, fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
                      <EditableText
                        editMode={editMode}
                        value={dep.local}
                        placeholder="Local"
                        onChange={(v) => actions.updateArrayItem('depoimentos', dep.id, 'local', v)}
                      />
                      <span>·</span>
                      <EditableText
                        editMode={editMode}
                        value={dep.data}
                        placeholder="Ano"
                        onChange={(v) => actions.updateArrayItem('depoimentos', dep.id, 'data', v)}
                      />
                    </div>
                  </div>
                </div>

                {editMode && (
                  <>
                    <EditableText
                      editMode
                      value={dep.foto}
                      placeholder="URL da foto (opcional)"
                      onChange={(v) => actions.updateArrayItem('depoimentos', dep.id, 'foto', v)}
                      style={{ fontSize: '0.78rem' }}
                    />
                    <label
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        width: 'fit-content',
                        padding: '8px 10px',
                        border: '1px solid var(--line)',
                        borderRadius: 6,
                        background: 'var(--offwhite)',
                        color: 'var(--ink)',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                      }}
                    >
                      <ImageUp size={14} />
                      Enviar foto
                      <input type="file" accept="image/*" hidden onChange={(event) => handleUpload(event, dep.id, 'foto')} />
                    </label>
                    <div style={{ display: 'flex', gap: 6, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                      <button className="icon-btn" onClick={() => actions.moveItem('depoimentos', dep.id, 'up')} disabled={i === 0}>
                        <ArrowUp size={14} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => actions.moveItem('depoimentos', dep.id, 'down')}
                        disabled={i === depoimentos.length - 1}
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button className="icon-btn" onClick={() => actions.toggleItemVisibility('depoimentos', dep.id)}>
                        {dep.visivel ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>
                      <button
                        className="icon-btn"
                        style={{ marginLeft: 'auto' }}
                        onClick={() => actions.removeTestimonial(dep.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}

          {editMode && (
            <button
              onClick={actions.addTestimonial}
              className="btn btn-outline"
              style={{ minHeight: 160, justifyContent: 'center' }}
            >
              <Plus size={14} /> Adicionar depoimento
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
