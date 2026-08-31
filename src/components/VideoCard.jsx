import { Play, ArrowUp, ArrowDown, EyeOff, Eye, Trash2, Film } from 'lucide-react';
import EditableText from './EditableText.jsx';

export default function VideoCard({
  video,
  editMode,
  onOpen,
  onChangeField,
  onRemove,
  onMove,
  onToggleVisibility,
  isFirst,
  isLast,
}) {
  const vertical = video.orientacao !== 'horizontal';

  if (!editMode && !video.visivel) return null;

  return (
    <div
      className="fade-up"
      style={{
        opacity: video.visivel ? 1 : 0.4,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <button
        onClick={() => onOpen(video)}
        style={{
          position: 'relative',
          border: 'none',
          padding: 0,
          borderRadius: 6,
          overflow: 'hidden',
          background: 'linear-gradient(155deg, var(--olive) 0%, var(--olive-dark) 100%)',
          aspectRatio: vertical ? '9 / 16' : '16 / 9',
          width: '100%',
          display: 'block',
          boxShadow: 'var(--shadow-soft)',
        }}
      >
        {video.capa ? (
          <img
            src={video.capa}
            alt={video.titulo}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(248,246,241,0.5)',
            }}
          >
            <Film size={32} />
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(248,246,241,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink)',
            }}
          >
            <Play size={18} fill="currentColor" style={{ marginLeft: 2 }} />
          </span>
        </div>
        <div style={{ position: 'absolute', left: 14, bottom: 12, textAlign: 'left', color: 'var(--offwhite)' }}>
          <p style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>
            {video.categoria}
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>{video.titulo}</p>
        </div>
      </button>

      {editMode && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 12,
            border: '1px solid var(--line)',
            borderRadius: 6,
            background: 'var(--white)',
          }}
        >
          <EditableText
            editMode
            value={video.titulo}
            placeholder="Nome do casal"
            onChange={(v) => onChangeField(video.id, 'titulo', v)}
          />
          <EditableText
            editMode
            value={video.categoria}
            placeholder="Categoria (Making Of, Cerimônia, Festa...)"
            onChange={(v) => onChangeField(video.id, 'categoria', v)}
          />
          <EditableText
            editMode
            value={video.url}
            placeholder="Link do vídeo (.mp4 ou embed)"
            onChange={(v) => onChangeField(video.id, 'url', v)}
          />
          <EditableText
            editMode
            value={video.capa}
            placeholder="URL da imagem de capa"
            onChange={(v) => onChangeField(video.id, 'capa', v)}
          />
          <select
            value={video.orientacao}
            onChange={(e) => onChangeField(video.id, 'orientacao', e.target.value)}
            style={{ padding: 8, border: '1px solid var(--line)', borderRadius: 4 }}
          >
            <option value="vertical">Vertical (9:16 / Reels)</option>
            <option value="horizontal">Horizontal (16:9)</option>
          </select>

          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <button className="icon-btn" onClick={() => onMove(video.id, 'up')} disabled={isFirst} title="Mover para cima">
              <ArrowUp size={14} />
            </button>
            <button className="icon-btn" onClick={() => onMove(video.id, 'down')} disabled={isLast} title="Mover para baixo">
              <ArrowDown size={14} />
            </button>
            <button className="icon-btn" onClick={() => onToggleVisibility(video.id)} title={video.visivel ? 'Ocultar' : 'Exibir'}>
              {video.visivel ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button className="icon-btn" onClick={() => onRemove(video.id)} title="Remover vídeo" style={{ marginLeft: 'auto' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
