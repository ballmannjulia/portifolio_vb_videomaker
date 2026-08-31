import { Check } from 'lucide-react';

function formatBRL(value) {
  const n = Number(value) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export default function Comparison({ data, editMode }) {
  const experiencias = data.experiencias.filter((e) => editMode || e.visivel);
  if (experiencias.length < 2) return null;

  // Recolhe os títulos únicos de itens usados pelas experiências para linhas comparativas.
  const featureSet = [];
  experiencias.forEach((exp) => {
    exp.itens.forEach((item) => {
      if (!featureSet.includes(item.titulo)) featureSet.push(item.titulo);
    });
  });

  return (
    <section className="section section--straw">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <p className="eyebrow">Comparação</p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', marginTop: 12 }}>
            Lado a lado, <span className="serif-italic">com clareza</span>
          </h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `220px repeat(${experiencias.length}, minmax(200px, 1fr))`,
              minWidth: 220 + experiencias.length * 200,
              background: 'var(--white)',
              borderRadius: 10,
              overflow: 'hidden',
              boxShadow: 'var(--shadow-soft)',
            }}
          >
            <div style={{ padding: 20 }} />
            {experiencias.map((exp) => (
              <div
                key={exp.id}
                style={{
                  padding: '24px 20px',
                  background: exp.destaque ? 'var(--olive)' : 'transparent',
                  color: exp.destaque ? 'var(--offwhite)' : 'var(--ink)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>{exp.nome}</p>
                <p style={{ fontSize: '1.4rem', marginTop: 6, fontFamily: 'var(--font-display)' }}>
                  {formatBRL(exp.valor)}
                </p>
              </div>
            ))}

            {featureSet.map((feature, rowIdx) => (
              <RowFeature key={feature} feature={feature} experiencias={experiencias} rowIdx={rowIdx} />
            ))}

            <div style={{ padding: '18px 20px', fontSize: '0.85rem', fontWeight: 600 }}>Equipe</div>
            {experiencias.map((exp) => (
              <div key={exp.id} style={{ padding: '18px 20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                {exp.equipe}
              </div>
            ))}

            <div style={{ padding: '18px 20px', fontSize: '0.85rem', fontWeight: 600 }}>Entrega</div>
            {experiencias.map((exp) => (
              <div key={exp.id} style={{ padding: '18px 20px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                {exp.entrega}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RowFeature({ feature, experiencias, rowIdx }) {
  const bg = rowIdx % 2 === 0 ? 'rgba(107,112,92,0.04)' : 'transparent';
  return (
    <>
      <div style={{ padding: '16px 20px', fontSize: '0.85rem', background: bg }}>{feature}</div>
      {experiencias.map((exp) => {
        const has = exp.itens.some((i) => i.titulo === feature);
        return (
          <div key={exp.id} style={{ padding: '16px 20px', textAlign: 'center', background: bg }}>
            {has ? <Check size={16} color="var(--olive)" style={{ display: 'inline' }} /> : <span style={{ color: 'var(--line)' }}>—</span>}
          </div>
        );
      })}
    </>
  );
}
