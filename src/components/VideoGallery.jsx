import { useState } from 'react';
import { Plus } from 'lucide-react';
import VideoCard from './VideoCard.jsx';
import VideoModal from './VideoModal.jsx';

export default function VideoGallery({ data, editMode, actions }) {
  const [openVideo, setOpenVideo] = useState(null);
  const videos = data.videos;
  const visibleCount = videos.filter((v) => v.visivel).length;

  if (!editMode && visibleCount === 0) return null;

  return (
    <section id="portfolio" className="section section--straw">
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 56px' }}>
          <p className="eyebrow">Portfólio</p>
          <h2 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', marginTop: 12 }}>
            Histórias contadas <span className="serif-italic">como elas aconteceram</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: 24,
          }}
        >
          {videos.map((video, i) => (
            <VideoCard
              key={video.id}
              video={video}
              editMode={editMode}
              onOpen={setOpenVideo}
              onChangeField={actions.updateArrayItem.bind(null, 'videos')}
              onRemove={actions.removeVideo}
              onMove={actions.moveItem.bind(null, 'videos')}
              onToggleVisibility={actions.toggleItemVisibility.bind(null, 'videos')}
              isFirst={i === 0}
              isLast={i === videos.length - 1}
            />
          ))}

          {editMode && (
            <button
              onClick={actions.addVideo}
              style={{
                aspectRatio: '9 / 16',
                border: '2px dashed var(--olive-light)',
                borderRadius: 6,
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: 'var(--olive)',
              }}
            >
              <Plus size={22} />
              <span style={{ fontSize: '0.8rem' }}>Adicionar vídeo</span>
            </button>
          )}
        </div>
      </div>

      <VideoModal video={openVideo} onClose={() => setOpenVideo(null)} />
    </section>
  );
}
