import { Plus } from 'lucide-react';
import ExperienceCard from './ExperienceCard.jsx';
import { buildWhatsappHref } from '../utils/whatsapp.js';

export default function Experiences({ data, editMode, actions }) {
  const experiencias = data.experiencias;
  const visibleCount = experiencias.filter((e) => e.visivel).length;

  if (!editMode && visibleCount === 0) return null;

  return (
    <section id="experiencias" className="section">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
          <p className="eyebrow">Experiências</p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', marginTop: 12 }}>
            Escolha como <span className="serif-italic">sua história</span> será contada
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
            gap: 28,
            alignItems: 'start',
          }}
        >
          {experiencias.map((exp, i) => (
            <ExperienceCard
              key={exp.id}
              exp={exp}
              editMode={editMode}
              actions={actions}
              whatsappHref={buildWhatsappHref(data, `Olá! Tenho interesse na experiência "${exp.nome}".`)}
              isFirst={i === 0}
              isLast={i === experiencias.length - 1}
            />
          ))}
        </div>

        {editMode && (
          <button onClick={actions.addExperience} className="btn btn-outline" style={{ marginTop: 24 }}>
            <Plus size={14} /> Adicionar experiência
          </button>
        )}
      </div>
    </section>
  );
}
