import { ArrowUp, ArrowDown, Trash2, Plus, Star } from 'lucide-react';
import EditableText from './EditableText.jsx';

function formatBRL(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export default function ExperienceCard({ exp, editMode, actions, whatsappHref, isFirst, isLast }) {
  if (!editMode && !exp.visivel) return null;

  return (
    <div
      className="fade-up"
      style={{
        opacity: exp.visivel ? 1 : 0.45,
        borderRadius: 10,
        padding: 36,
        display: 'flex',
        flexDirection: 'column',
        gap: 22,
        background: exp.destaque ? 'var(--olive)' : 'var(--white)',
        color: exp.destaque ? 'var(--offwhite)' : 'var(--ink)',
        border: exp.destaque ? 'none' : '1px solid var(--line)',
        boxShadow: exp.destaque ? 'var(--shadow-soft)' : 'none',
        position: 'relative',
      }}
    >
      {exp.destaque && (
        <span
          style={{
            position: 'absolute',
            top: -12,
            left: 36,
            background: 'var(--clay)',
            color: 'var(--offwhite)',
            fontSize: '0.68rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '5px 12px',
            borderRadius: 20,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Star size={11} fill="currentColor" /> Mais escolhida
        </span>
      )}

      <div>
        <EditableText
          editMode={editMode}
          tag="h3"
          value={exp.nome}
          onChange={(v) => actions.updateArrayItem('experiencias', exp.id, 'nome', v)}
          style={{ fontSize: '1.5rem' }}
        />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.1rem', marginTop: 8 }}>
          {editMode ? (
            <input
              type="number"
              className="editable"
              value={exp.valor}
              onChange={(e) => actions.updateArrayItem('experiencias', exp.id, 'valor', Number(e.target.value))}
              style={{ maxWidth: 160 }}
            />
          ) : (
            formatBRL(exp.valor)
          )}
        </div>
      </div>

      <EditableText
        editMode={editMode}
        tag="p"
        multiline={editMode}
        value={exp.resumo}
        onChange={(v) => actions.updateArrayItem('experiencias', exp.id, 'resumo', v)}
        style={{ opacity: 0.85, lineHeight: 1.7, fontSize: '0.95rem' }}
      />

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {exp.itens.map((item, idx) => (
          <li key={idx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: exp.destaque ? 'var(--straw)' : 'var(--clay)',
                  flexShrink: 0,
                }}
              />
              <EditableText
                editMode={editMode}
                value={item.titulo}
                onChange={(v) => actions.updateExperienceItem(exp.id, idx, 'titulo', v)}
                style={{ fontWeight: 600, fontSize: '0.92rem' }}
              />
              {editMode && (
                <button
                  className="icon-btn"
                  style={{ marginLeft: 'auto', flexShrink: 0 }}
                  onClick={() => actions.removeExperienceItem(exp.id, idx)}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
            <EditableText
              editMode={editMode}
              multiline={editMode}
              value={item.descricao}
              onChange={(v) => actions.updateExperienceItem(exp.id, idx, 'descricao', v)}
              style={{ fontSize: '0.85rem', opacity: 0.8, paddingLeft: 14 }}
            />
          </li>
        ))}
      </ul>

      {editMode && (
        <button
          onClick={() => actions.addExperienceItem(exp.id)}
          className="btn btn-ghost"
          style={{ alignSelf: 'flex-start', color: 'inherit', opacity: 0.8 }}
        >
          <Plus size={13} /> Adicionar item
        </button>
      )}

      <div style={{ fontSize: '0.8rem', opacity: 0.75, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <EditableText
          editMode={editMode}
          value={exp.equipe}
          onChange={(v) => actions.updateArrayItem('experiencias', exp.id, 'equipe', v)}
          placeholder="Equipe"
        />
        <EditableText
          editMode={editMode}
          value={exp.entrega}
          onChange={(v) => actions.updateArrayItem('experiencias', exp.id, 'entrega', v)}
          placeholder="Prazo de entrega"
        />
      </div>

      {!editMode && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className={exp.destaque ? 'btn btn-primary' : 'btn btn-outline'}
          style={{ justifyContent: 'center' }}
        >
          Quero {exp.destaque ? 'viver' : ''} esta experiência
        </a>
      )}

      {editMode && (
        <div style={{ display: 'flex', gap: 6, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14 }}>
          <button className="icon-btn" onClick={() => actions.moveItem('experiencias', exp.id, 'up')} disabled={isFirst}>
            <ArrowUp size={14} />
          </button>
          <button className="icon-btn" onClick={() => actions.moveItem('experiencias', exp.id, 'down')} disabled={isLast}>
            <ArrowDown size={14} />
          </button>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', marginLeft: 8 }}>
            <input
              type="checkbox"
              checked={exp.destaque}
              onChange={(e) => actions.updateArrayItem('experiencias', exp.id, 'destaque', e.target.checked)}
            />
            Destacar
          </label>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <input
              type="checkbox"
              checked={exp.visivel}
              onChange={() => actions.toggleItemVisibility('experiencias', exp.id)}
            />
            Visível
          </label>
          <button
            className="icon-btn"
            style={{ marginLeft: 'auto' }}
            onClick={() => actions.removeExperience(exp.id)}
            title="Remover experiência"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
